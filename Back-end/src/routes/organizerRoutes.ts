import express from 'express';
import { 
  loginOrganizer, 
  registerOrganizer, 
  getOrganizerProfile, 
  updateOrganizerProfile,
  currentUser
} from '../controllers/organizerController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.post('/register', registerOrganizer);
router.post("/login", loginOrganizer);

// Protected routes (require authentication)
router.get('/profile', protect, getOrganizerProfile);
router.put('/profile', protect, updateOrganizerProfile);
router.get('/current', protect, currentUser);

export default router;