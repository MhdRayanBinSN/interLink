import { Event } from "../models/Event";
import express from "express"



declare global {
    namespace Express {
      interface Request {
        files?: {
          [fieldname: string]: Express.Multer.File[]
        }
      }
    }
}

export const createEvent = async (req: express.Request, res: express.Response) => {
    try {
        console.log('Request body:', req.body);
        
        // Check if eventData exists in request body
        if (!req.body.eventData) {
           return console.error("Missing data");
           
           
        }
        
        const eventData = JSON.parse(req.body.eventData);
        console.log('Parsed event data:', eventData);
        
        if (req.files) {
            // Add banner image URL
            if (req.files.bannerImage) {
                eventData.bannerImageUrl = req.files.bannerImage[0].path;
            }
            
            // Add speaker image URLs
            if (req.files.speakerImages && eventData.speakers) {
                req.files.speakerImages.forEach((file, index) => {
                    if (eventData.speakers[index]) {
                        eventData.speakers[index].imageUrl = file.path;
                    }
                });
            }
            
            // Add resource URLs
            if (req.files.resources) {
                eventData.resourceUrls = req.files.resources.map(file => file.path);
            }
        }
        
        // FIX: Use eventData instead of req.body
        const event = await Event.create(eventData);
        
        res.status(201).json({
            success: true,
            data: event
        });
    } catch (error: any) {
        console.error('Error creating event:', error);
        
        res.status(500).json({
            success: false,
            error: error.message || 'Error creating event'
        });
    }
}

export const getAllEvents = async (req: express.Request, res: express.Response) => {
    try {
        const eventsData = await Event.find({});
        res.status(200).json({
            success: true,
            count: eventsData.length,
            data: eventsData
        });
    } catch (error : any) {
        console.error('Error Getting event:', error);
        
        res.status(500).json({
            success: false,
            error: error.message || 'Error getting event'
        });
    }
        
}
export const getEventById = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const { id } = req.params;
        
        if (!id) {
            res.status(400).json({
                success: false,
                error: 'Event ID is required'
            });
            return;
        }
        
        const eventData = await Event.findById(id);
        
        if (!eventData) {
            res.status(404).json({
                success: false,
                error: 'Event not found'
            });
            return;
        }
        
        res.status(200).json({
            success: true,
            data: eventData
        });
    } catch (error : any) {
        console.error('Error getting event by ID:', error);
        
        res.status(500).json({
            success: false,
            error: error.message || 'Error getting event'
        });
    }
}
