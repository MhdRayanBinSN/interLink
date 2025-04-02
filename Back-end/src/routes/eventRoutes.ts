import express from "express";
import { 
  createEvent, 
  getAllEvents, 
  getEventById, 
  getEventsByOrganizer, 
  my_events, 
  getOrganizerEventById,
  updateEvent
} from "../controllers/eventController";
import { uploadFiles } from "../middleware/fileUpload";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Public routes
router.get('/getAllEvents', getAllEvents);
router.get('/getEventById/:id', getEventById);

// Protected routes (require authentication)
router.post('/createEvent', protect, uploadFiles, createEvent);
router.get('/organizer/:organizerId', protect, getEventsByOrganizer);
router.get('/my-events', protect, my_events);

// Add these new routes for event editing
router.get('/getOrganizerEventById/:id', protect, getOrganizerEventById);
router.put('/updateEvent/:id', protect, uploadFiles, updateEvent);

export default router;
