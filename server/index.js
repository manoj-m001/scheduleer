import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import slotRoute from './routes/slotRoute.js';
import bookingRoute from './routes/bookingRoute.js';
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({origin:process.env.FRONTEND_URL}));
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));
  
  app.use('/api', slotRoute,bookingRoute);
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
