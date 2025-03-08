import express from 'express';
import { registerOrganizer } from '../controllers/organizerController';

const router = express.Router();

router.post('/register', registerOrganizer);

export default router;