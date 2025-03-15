import express from 'express';
import { registerUser, loginUser, getProfile, updateUserProfile, changePassword } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('profilePicture'), updateUserProfile);
router.put('/change-password', protect, changePassword);

export default router;