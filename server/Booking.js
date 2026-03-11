import mongoose from "mongoose";


const bookingMongooseSchema = new mongoose.Schema({
  firstName: String,
  surname: String,
  email: String,
  date: Date,
  time: String,
  timezone: String,
  timezoneLabel: String,
  google_meet_url: String,
  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingMongooseSchema);

export default Booking;