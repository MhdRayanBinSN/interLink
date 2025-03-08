import { Event } from "../models/Event";
import express from "express"

export const createEvent = async (req: express.Request, res: express.Response) => {
    try {
        const event = await Event.create(req.body);
        res.status(201).json({
            success: true,
            data: event
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error creating event'
        });
    }
}