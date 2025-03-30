import express from "express";
import { createEvent, getAllEvents, getEventById ,getEventsByOrganizer} from "../controllers/eventController";
import { uploadFiles } from "../middleware/fileUpload";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

//router.post('/createEvent', uploadFiles, createEvent);
router.get('/getAllEvents', getAllEvents);

router.get('/getEventById/:id', getEventById);

// Protected routes (require authentication)
router.post('/createEvent',protect, uploadFiles, createEvent);
router.get('/organizer/:organizerId', protect, getEventsByOrganizer);


export default router;
