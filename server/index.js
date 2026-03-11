import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import mongoose from 'mongoose';
import Booking from './Booking.js';
import { google } from 'googleapis';
import oauth2Client from './googleconfig.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Mongoose Schema & Model



// Zod schema for validation
const bookingSchema = z.object({
  firstName: z.string().min(2),
  surname: z.string().min(2),
  email: z.string().email(),
  date: z.string().datetime(),
  time: z.string(),
  timezone: z.string(),
  timezoneLabel: z.string()
});

// Setup Nodemailer transporter with Ethereal Email for testing
let transporter;
nodemailer.createTestAccount((err, account) => {
    if (err) {
        console.error('Failed to create a testing account. ' + err.message);
        return;
    }
    transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
            user: account.user,
            pass: account.pass
        }
    });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/slots', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: "Date parameter is required" });
    }

    // Convert requested date to the start and end of that specific day
    // The date from frontend is usually an ISO string like "2026-03-08T18:30:00.000Z"
    const queryDate = new Date(date);
    const startOfDay = new Date(queryDate.getFullYear(), queryDate.getMonth(), queryDate.getDate());
    const endOfDay = new Date(queryDate.getFullYear(), queryDate.getMonth(), queryDate.getDate() + 1);

    // Fetch existing bookings for this day
    const existingBookings = await Booking.find({
      date: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    });
    
    // Extract times that are already booked
    const bookedTimes = existingBookings.map(b => b.time);

    // Available slots (simplified rule: 16:30 to 17:45 as per standard set earlier)
    const allSlots = ["16:30", "16:45", "17:00", "17:15", "17:30", "17:45"];
    
    // Filter out booked times
    const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));
    
    res.json({ slots: availableSlots });
  } catch (err) {
    console.error("Error fetching slots:", err);
    res.status(500).json({ message: "Error fetching availability" });
  }
});

app.post('/api/book', async (req, res) => {
  try {
    // 1. Validate data
    const validatedData = bookingSchema.parse(req.body);
    
    // 2. Check for double booking conflicts
    const bookingDate = new Date(validatedData.date);
    
    // We check for exact matching date (day level in DB) and exact matching time string
    // In a timezone-aware app, you'd normalize everything to UTC timestamps.
    const startOfDay = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate());
    const endOfDay = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate() + 1);

    const existingBooking = await Booking.findOne({
      date: { $gte: startOfDay, $lt: endOfDay },
      time: validatedData.time
    });

    if (existingBooking) {
      return res.status(409).json({ 
        message: 'This time slot has already been booked. Please choose another one.' 
      });
    }

    // 3. Save booking to MongoDB
    const newBooking = new Booking({
      ...validatedData,
      date: bookingDate
    });
    
    await newBooking.save();

    // 3. Generate Google Meet Link via Google Calendar API
    let meetLink = "https://meet.google.com/rbd-jnpe-ufp"; // Fallback
    
    try {
      if (process.env.REFRESH_TOKEN) {
        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
        
        // Parse the start time (assuming booked time implies start time on the date selected)
        const [hours, minutes] = validatedData.time.split(':');
        const startDateTime = new Date(bookingDate);
        startDateTime.setHours(Number(hours), Number(minutes), 0);
        
        // Duration is 30 mins based on the design
        const endDateTime = new Date(startDateTime.getTime() + 30 * 60000);

        const event = {
          summary: `Meeting: ${validatedData.firstName} ${validatedData.surname} with Victoire Serruys`,
          description: `Scheduled via booking app. Contact: ${validatedData.email}`,
          start: {
            dateTime: startDateTime.toISOString(),
            timeZone: 'UTC', // Since we store and process dates neutrally
          },
          end: {
            dateTime: endDateTime.toISOString(),
            timeZone: 'UTC',
          },
          attendees: [
            { email: validatedData.email }
          ],
          conferenceData: {
            createRequest: {
              requestId: newBooking.id.toString(),
              conferenceSolutionKey: { type: 'hangoutsMeet' }
            }
          }
        };

        const eventResponse = await calendar.events.insert({
          calendarId: 'primary',
          conferenceDataVersion: 1,
          resource: event,
        });

        if (eventResponse.data && eventResponse.data.hangoutLink) {
          meetLink = eventResponse.data.hangoutLink;
          // Update DB with the generated link
          newBooking.google_meet_url = meetLink;
          await newBooking.save();
        }
      } else {
        console.warn("No REFRESH_TOKEN provided. Falling back to default Meet link.");
      }
    } catch (googleErr) {
      console.error("Google Calendar API Error:", googleErr.message || googleErr);
      // We log but don't fail the whole booking process if calendar fails (fallback link used)
    }

    // 4. Format Date for Email
    const meetingDate = new Date(validatedData.date);
    const dateString = meetingDate.toLocaleDateString('en-GB', { 
       day: 'numeric', month: 'long', year: 'numeric' 
    });

    // 5. Send Confirmation Email
    if (transporter) {
      const mailOptions = {
        from: '"Victoire Serruys" <victoire@climatiq.io>',
        to: validatedData.email,
        subject: `Confirmed: Meeting with Victoire Serruys`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <p>Hi ${validatedData.firstName},</p>
            <p>Your meeting with Victoire Serruys is confirmed.</p>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Date:</strong> ${dateString}</p>
              <p><strong>Time:</strong> ${validatedData.time} (${validatedData.timezoneLabel})</p>
              <p><strong>Location:</strong> <a href="${meetLink}">${meetLink}</a></p>
            </div>
            <div style="margin-top: 30px;">
              <a href="#" style="background-color: transparent; border: 1px solid #d1d5db; color: #374151; padding: 8px 16px; text-decoration: none; border-radius: 4px; margin-right: 10px;">Reschedule</a>
              <a href="#" style="background-color: transparent; border: 1px solid #ef4444; color: #ef4444; padding: 8px 16px; text-decoration: none; border-radius: 4px;">Cancel</a>
            </div>
          </div>
        `
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    // 5. Respond
    res.status(201).json({
      message: 'Booking successful',
      booking: newBooking
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
