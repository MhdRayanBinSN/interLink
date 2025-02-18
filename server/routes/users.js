import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

// Mock database
const users = [];

// Get user profile
router.get('/profile', (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
});

// Update user profile
router.put('/profile',
  [
    body('name').optional().isString().trim().notEmpty(),
    body('email').optional().isEmail(),
  ],
  validateRequest,
  (req, res) => {
    const userIndex = users.findIndex(u => u.id === req.user.id);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    users[userIndex] = { ...users[userIndex], ...req.body };
    res.json(users[userIndex]);
  }
);

export { router as usersRouter };