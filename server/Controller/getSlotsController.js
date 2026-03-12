import Booking from "../models/Booking.js";

export const getSlots=async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: "Date parameter is required" });
    }

    const queryDate = new Date(date);
    const startOfDay = new Date(queryDate.getFullYear(), queryDate.getMonth(), queryDate.getDate());
    const endOfDay = new Date(queryDate.getFullYear(), queryDate.getMonth(), queryDate.getDate() + 1);

    const existingBookings = await Booking.find({
      date: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    });
    
    const bookedTimes = existingBookings.map(b => b.time);

    const allSlots = ["16:30", "16:45", "17:00", "17:15", "17:30", "17:45"];
    
    const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));
    
    res.json({ slots: availableSlots });
  } catch (err) {
    console.error("Error fetching slots:", err);
    res.status(500).json({ message: "Error fetching availability" });
  }
}