import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { sendConfirmationEmail } from './emailService.js';
import { z } from 'zod';
import mongoose from 'mongoose';
import Booking from './Booking.js';

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

// Email service is configured in emailService.js

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
    const validatedData = bookingSchema.parse(req.body);
    
    const bookingDate = new Date(validatedData.date);
    
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
    let meetLink = "https://meet.google.com/rbd-jnpe-ufp"; // Fallback
    const newBooking = new Booking({
      ...validatedData,
      date: bookingDate,
      google_meet_url: meetLink
    });
    
    await newBooking.save();
    // 4. Format Date for Email
    const meetingDate = new Date(validatedData.date);
    const dateString = meetingDate.toLocaleDateString('en-GB', { 
       day: 'numeric', month: 'long', year: 'numeric' 
    });

    // 5. Send Confirmation Email
    try {
      await sendConfirmationEmail({
        firstName: validatedData.firstName,
        email: validatedData.email,
        dateString,
        time: validatedData.time,
        timezoneLabel: validatedData.timezoneLabel,
        meetLink
      });
    } catch (emailError) {
      console.error("Failed to send email confirmation:", emailError);
      // We log but don't fail the whole booking process if email fails
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
