import express from 'express';
import { getEventParticipants, markAttendance, exportParticipants } from '../controllers/participantController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// All these routes require authentication
router.get('/event/:eventId', protect, getEventParticipants);
router.post('/attendance/:bookingId', protect, markAttendance);
router.get('/export/:eventId', protect, exportParticipants);

export default router;