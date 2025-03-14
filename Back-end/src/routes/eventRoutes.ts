import express from "express";
import { createEvent, getAllEvents, getEventById } from "../controllers/eventController";
import { uploadFiles } from "../middleware/fileUpload";

const router = express.Router();

router.post('/createEvent', uploadFiles, createEvent);
router.get('/getAllEvents', getAllEvents);

router.get('/getEventById/:id', getEventById);

export default router;
