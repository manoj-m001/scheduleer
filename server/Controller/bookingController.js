import Booking from "../models/Booking.js";
import { bookingSchema } from "../zodValidation/Validation.js";
import {z} from "zod";
import {sendConfirmationEmail} from "../utils/emailService.js";

export const bookslot=async (req, res) => {
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
    console.log("backend: saving to mongoDB...");
    console.time("MongoDB Save");
    let meetLink = "https://meet.google.com/rbd-jnpe-ufp"; // Fallback
    const newBooking = new Booking({
      ...validatedData,
      date: bookingDate,
      google_meet_url: meetLink
    });
    
    await newBooking.save();
    console.timeEnd("MongoDB Save");
    // 4. Format Date for Email
    const meetingDate = new Date(validatedData.date);
    const dateString = meetingDate.toLocaleDateString('en-GB', { 
       day: 'numeric', month: 'long', year: 'numeric' 
    });

    // 5. Send Confirmation Email (Async - don't await so we don't block the API response)
    sendConfirmationEmail({
      firstName: validatedData.firstName,
      email: validatedData.email,
      dateString,
      time: validatedData.time,
      timezoneLabel: validatedData.timezoneLabel,
      meetLink
    }).catch(emailError => {
      console.error("Failed to send email confirmation in background:", emailError);
    });

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
  }};
