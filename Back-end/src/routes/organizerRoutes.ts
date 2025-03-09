import express from 'express';
import { loginOrganizer, registerOrganizer } from '../controllers/organizerController';

const router = express.Router();

router.post('/register', registerOrganizer);
router.post("/login",loginOrganizer)

export default router;