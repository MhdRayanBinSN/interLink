import express from 'express';
import { 
  loginOrganizer, 
  registerOrganizer, 
  getOrganizerProfile, 
  updateOrganizerProfile,
  currentUser,
  refreshToken,
  changeOrganizerPassword, // Import the new controller
  
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
router.put('/change-password', protect, changeOrganizerPassword); // New route

// Add the refresh token route
router.post('/refresh-token', protect, refreshToken);

export default router;