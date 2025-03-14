import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/dbConfig';
import eventRoutes from './routes/eventRoutes';
import organizerRoutes from './routes/organizerRoutes';
import cors from 'cors';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes - Note the path without extra 'api'
app.use('/api/organizer', organizerRoutes);
app.use('/api/events', eventRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  
  console.log(`Server running on port ${PORT}`);
});
