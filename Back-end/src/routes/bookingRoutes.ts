import express from 'express';
import { 
  createBooking, 
  getUserBookings, 
  getBookingById, 
  cancelBooking,
  getRemainingSpots
} from '../controllers/bookingController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Protected routes (require authentication)
router.post('/create', protect, createBooking);
router.get('/my-tickets', protect, getUserBookings);
router.get('/details/:id', protect, getBookingById);
router.put('/cancel/:id', protect, cancelBooking);
router.get('/:id', protect, getBookingById); // Add this if it's missing

// Public route to get remaining spots
router.get('/remaining-spots/:eventId', getRemainingSpots);

export default router;