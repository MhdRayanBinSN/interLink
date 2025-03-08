import express from "express"
import { createEvent } from "../controllers/eventController"
const router = express.Router()


//router.route('/').get(getEvents)
router.post('/createEvent',createEvent)



export default router
