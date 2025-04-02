import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/dbConfig';
import cors from 'cors';
//Route imports
import eventRoutes from './routes/eventRoutes';
import organizerRoutes from './routes/organizerRoutes';
import  userRoutes from './routes/userRoutes';
import bookingRoutes from './routes/bookingRoutes';
import participantRoutes from './routes/participantRoutes';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes - Check these exact paths
app.use('/api/organizer', organizerRoutes);  // This needs to match your axios calls
app.use('/api/events', eventRoutes);
app.use('/api/user', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/participants', participantRoutes);



const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  
  console.log(`Server running on port ${PORT}`);
});
