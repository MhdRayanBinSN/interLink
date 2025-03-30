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
        const organizerId = req.user?.id;
        
        if (!organizerId) {
            console.log(res.status(401).json({
                success: false,
                error: 'Not authorized - organizer ID missing'
            }))
        }

        // Check if eventData exists in request body
        if (!req.body.eventData) {
           console.log( res.status(400).json({
                success: false,
                error: 'Event data is required'
            }))
        }
        
        const eventData = JSON.parse(req.body.eventData);
        console.log('Parsed event data:', eventData);
        
        // Add organizerId to event data
        eventData.organizerId = organizerId;
        
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

export const getEventsByOrganizer = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const organizerId = req.params.organizerId;
        
        if (!organizerId) {
            res.status(400).json({
                success: false,
                error: 'Organizer ID is required'
            });
            return;
        }

        // Find all events for this organizer with populated fields
        const events = await Event.find({ organizerId })
            .populate('registeredParticipants', 'name email')
            .populate({
                path: 'bookings',
                select: 'bookingStatus ticketCount totalAmount'
            })
            .sort({ startDateTime: -1 });

        res.status(200).json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (error: any) {
        console.error('Error getting organizer events:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Error fetching organizer events'
        });
    }
};
