import { Event } from "../models/Event";
import express from "express";

declare global {
    namespace Express {
        interface Request {
            files?: {
                [fieldname: string]: Express.Multer.File[];
            };
        }
    }
}

export const createEvent = async (req: express.Request, res: express.Response) => {
    try {
        console.log('Request body:', req.body);
        const organizerId = req.user?.id;
        
        if (!organizerId) {
          res.status(401).json({
                success: false,
                error: 'Not authorized - organizer ID missing'
            });
        }

        // Check if eventData exists in request body
        if (!req.body.eventData) {
             res.status(400).json({
                success: false,
                error: 'Event data is required'
            });
        }
        
        const eventData = JSON.parse(req.body.eventData);
        console.log('Parsed event data:', eventData);
        
        // Force add organizerId to event data
        eventData.organizerId = organizerId;
        console.log('Added organizerId to event data:', organizerId);
        
        // Handle file uploads if any
        if (req.files) {
            // Your existing file handling code
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

        console.log('Creating event with data:', eventData);
        
        // Create the event in database
        const event = await Event.create(eventData);
        console.log('Created event:', event._id);
        
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
};

export const getAllEvents = async (req: express.Request, res: express.Response) => {
    try {
        const eventsData = await Event.find({});
        res.status(200).json({
            success: true,
            count: eventsData.length,
            data: eventsData
        });
    } catch (error: any) {
        console.error('Error Getting event:', error);

        res.status(500).json({
            success: false,
            error: error.message || 'Error getting event'
        });
    }
};

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
    } catch (error: any) {
        console.error('Error getting event by ID:', error);

        res.status(500).json({
            success: false,
            error: error.message || 'Error getting event'
        });
    }
};

export const getEventsByOrganizer = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const { organizerId } = req.params;

        console.log('Fetching events for organizer:', organizerId);

        if (!organizerId) {
            res.status(400).json({
                success: false,
                message: 'Organizer ID is required'
            });
            return;
        }

        // First try to find events by the ID directly from request params
        let events = await Event.find({ organizerId });

        // If no events found and user is authenticated, try with the authenticated user's ID
        if (events.length === 0 && req.user && req.user.id) {
            console.log('No events found with params ID, trying with authenticated user ID:', req.user.id);
            events = await Event.find({ organizerId: req.user.id });
        }

        console.log(`Found ${events.length} events`);

        res.status(200).json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (error: any) {
        console.error('Error fetching events by organizer:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching events'
        });
    }
};

export const my_events = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        // Get organizerId from authenticated user
        const organizerId = req.user?.id;

        if (!organizerId) {
            res.status(401).json({
                success: false,
                message: 'Not authenticated'
            });
            return;
        }

        console.log('Fetching events for authenticated organizer:', organizerId);
        console.log('Type of organizerId:', typeof organizerId);

        let events = await Event.find({ organizerId: organizerId.toString() });

        console.log(`Found ${events.length} events for authenticated organizer`);
        //case sesnsitive search
        /*
        if (events.length === 0) {
            console.log('Trying case-insensitive search');
            const allEvents = await Event.find({});
            
            console.log('All events:', allEvents.map(e => ({
                id: e._id, 
                title: e.title,
                organizerId: e.organizerId
            })));
        }
*/
        res.status(200).json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (error) {
        console.error('Error fetching events for authenticated user:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching events'
        });
    }
};

// Get event by ID for organizer (with auth check)
export const getOrganizerEventById = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const { id } = req.params;
        const organizerId = req.user?.id;

        if (!id) {
            res.status(400).json({
                success: false,
                error: 'Event ID is required'
            });
            return;
        }

        // Find the event
        const event = await Event.findById(id);

        if (!event) {
            res.status(404).json({
                success: false,
                error: 'Event not found'
            });
            return;
        }

        // Check if the event belongs to the authenticated organizer
        if (event.organizerId.toString() !== organizerId) {
            res.status(403).json({
                success: false,
                error: 'Unauthorized: You do not have permission to access this event'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error: any) {
        console.error('Error getting organizer event by ID:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Error getting event'
        });
    }
};

// Update an existing event
export const updateEvent = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const { id } = req.params;
        const organizerId = req.user?.id;
        
        if (!organizerId) {
            res.status(401).json({
                success: false,
                error: 'Not authorized - organizer ID missing'
            });
            return;
        }

        // Find the event to update
        const event = await Event.findById(id);
        
        if (!event) {
            res.status(404).json({
                success: false,
                error: 'Event not found'
            });
            return;
        }
        
        // Verify ownership - only the event creator can update it
        if (event.organizerId.toString() !== organizerId) {
            res.status(403).json({
                success: false,
                error: 'Unauthorized: You do not have permission to update this event'
            });
            return;
        }
        
        // Check if eventData exists in request body
        if (!req.body.eventData) {
            res.status(400).json({
                success: false,
                error: 'Event data is required'
            });
            return;
        }
        
        // Parse the event data
        const eventData = JSON.parse(req.body.eventData);
        console.log('Parsed event update data:', eventData);
        
        // Handle file uploads if any
        if (req.files) {
            // Banner image
            if (req.files.bannerImage) {
                eventData.bannerImageUrl = req.files.bannerImage[0].path;
            }

            // Speaker images
            if (req.files.speakerImages && eventData.speakers) {
                req.files.speakerImages.forEach((file, index) => {
                    const speakerIndex = parseInt(req.body[`speakerIndex${index}`] || index);
                    if (eventData.speakers[speakerIndex]) {
                        eventData.speakers[speakerIndex].imageUrl = file.path;
                    }
                });
            }

            // Resources
            if (req.files.resources) {
                eventData.resourceUrls = req.files.resources.map(file => file.path);
            }
        }
        
        // Ensure organizerId remains unchanged
        eventData.organizerId = organizerId;
        
        // Update the event
        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            { $set: eventData },
            { new: true, runValidators: true }
        );
        
        if (!updatedEvent) {
            res.status(404).json({
                success: false,
                error: 'Event not found or update failed'
            });
            return;
        }
        
        res.status(200).json({
            success: true,
            data: updatedEvent,
            message: 'Event updated successfully'
        });
        
    } catch (error: any) {
        console.error('Error updating event:', error);
        
        res.status(500).json({
            success: false,
            error: error.message || 'Error updating event'
        });
    }
};