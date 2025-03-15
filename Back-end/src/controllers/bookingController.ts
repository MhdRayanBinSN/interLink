import { Request, Response } from 'express';
import { Booking } from '../models/Booking';
import { Event } from '../models/Event';
import { User } from '../models/User';
import mongoose from 'mongoose';

// Create a new booking
export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('==== START BOOKING CREATION ====');
    const userId = req.user.id; // From auth middleware
    console.log('User ID:', userId);
    const {
      eventId, 
      name, 
      email, 
      phone, 
      attendeeType,
      additionalParticipants = [],
      ticketCount
    } = req.body;
    
    // Get these from primary contact if using that structure
    const primaryContact = req.body.primaryContact || {};
    const bookingName = name || primaryContact.name;
    const bookingEmail = email || primaryContact.email;
    const bookingPhone = phone || primaryContact.phone;
    const bookingType = attendeeType || primaryContact.attendeeType;
    const bookingLocation = primaryContact.location;
    
    console.log('Received booking data:', {
      userId,
      eventId, 
      name: bookingName, 
      email: bookingEmail, 
      phone: bookingPhone, 
      type: bookingType,
      ticketCount,
      additionalParticipants
    });
    
    // Validate required fields
    if (!eventId || !bookingName || !bookingEmail || !bookingPhone || !bookingType) {
      res.status(400).json({
        success: false,
        error: 'Missing required booking information'
      });
      return;
    }
    
    // Check if event exists - no session
    const event = await Event.findById(eventId);
    
    if (!event) {
      res.status(404).json({
        success: false,
        error: 'Event not found'
      });
      return;
    }
    
    // Check if event has already started or ended
    const now = new Date();
    const eventDate = new Date(event.startDateTime);
    
    if (eventDate < now) {
      res.status(400).json({
        success: false,
        error: 'Event has already started or passed'
      });
      return;
    }
    
    // Check if registration deadline has passed
    const regDeadline = new Date(event.registrationDeadline);
    if (regDeadline < now) {
      res.status(400).json({
        success: false,
        error: 'Registration deadline has passed'
      });
      return;
    }
    
    // Count existing bookings - no session
    const bookedCount = await Booking.aggregate([
      { 
        $match: { 
          event: new mongoose.Types.ObjectId(eventId), 
          bookingStatus: 'confirmed' 
        }
      },
      { 
        $group: { 
          _id: null, 
          totalTickets: { $sum: '$ticketCount' } 
        } 
      }
    ]);
    
    const bookedTickets = bookedCount.length > 0 ? bookedCount[0].totalTickets : 0;
    const availableSpots = event.maxParticipants - bookedTickets;
    
    // Check if enough spots are available
    if (availableSpots < ticketCount) {
      res.status(400).json({
        success: false,
        error: `Only ${availableSpots} spots available`
      });
      return;
    }
    
    // Calculate amount (free for now, will be updated for paid events)
    let totalAmount = 0;
    if (event.entryType === 'paid' && event.ticketPrice) {
      totalAmount = event.ticketPrice * ticketCount;
    }
    
    // Create booking without session
    const newBooking = new Booking({
      user: userId,
      event: eventId,
      name: bookingName,
      email: bookingEmail,
      phone: bookingPhone,
      attendeeType: bookingType,
      additionalParticipants: additionalParticipants || [],
      ticketCount,
      totalAmount,
      paymentStatus: event.entryType === 'free' ? 'completed' : 'pending',
      bookingStatus: event.entryType === 'free' ? 'confirmed' : 'pending'
    });
    
    // Before saving
    console.log('About to save booking:', newBooking);
    
    try {
      await newBooking.save();
      console.log('Booking saved successfully with ID:', newBooking._id);
    } catch (saveError) {
      console.error('Error saving booking:', saveError);
      res.status(500).json({
        success: false,
        error: `Error saving booking ${saveError}`,
      });
      return;
    }
    
    // Add event to user's registered events without session
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { eventsRegistered: eventId } }
    );
    
    // Get booking with event data for response
    const completeBooking = await Booking.findById(newBooking._id)
      .populate('event', 'title bannerImageUrl startDateTime venue mode entryType')
      .lean();
    
    res.status(201).json({
      success: true,
      data: completeBooking,
      message: 'Booking confirmed successfully!'
    });
    
    console.log('==== END BOOKING CREATION ====');
    
  } catch (error: any) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error processing booking'
    });
  }
};

// Get user's bookings
export const getUserBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    
    // First, lean() will convert Mongoose documents to plain JavaScript objects
    const bookings = await Booking.find({ user: userId })
      .populate({
        path: 'event',
        select: 'title bannerImageUrl startDateTime endDateTime venue mode'
      })
      .sort({ createdAt: -1 })
      .lean();
    
    // Transform bookings to match frontend TicketData format
    const tickets = bookings.map(booking => {
      // Make sure the event object exists and has the needed properties
      if (!booking.event || typeof booking.event !== 'object') {
        return null;
      }
      
      // Safely access event properties (TypeScript treats event as any here)
      const event = booking.event as any;
      let eventDate: Date;
      
      try {
        eventDate = new Date(event.startDateTime || Date.now());
      } catch (e) {
        eventDate = new Date();
      }
      
      // Determine status - fix the typo from 'venur' to 'event'
      let status: 'upcoming' | 'completed' | 'cancelled' = 'upcoming';
      if (booking.bookingStatus === 'cancelled') {
        status = 'cancelled';
      } else if (event.endDateTime && new Date(event.endDateTime) < new Date()) {
        status = 'completed';
      }
      
      return {
        id: booking._id,
        eventId: event._id,
        eventName: event.title || 'Unnamed Event',
        eventDate: event.startDateTime || booking.createdAt,
        eventTime: eventDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        eventLocation: event.venue || (event.mode === 'online' ? 'Online' : 'TBA'),
        ticketType: booking.attendeeType === 'student' ? 'Student' : 
                  booking.attendeeType === 'professional' ? 'Professional' : 'General',
        ticketNumber: booking.ticketId,
        price: booking.totalAmount,
        purchaseDate: booking.createdAt,
        status
      };
    }).filter(Boolean); // Remove any null results
    
    res.status(200).json({
      success: true,
      data: tickets
    });
  } catch (error: any) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error retrieving bookings'
    });
  }
};

// Get booking by ID
export const getBookingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;
    
    const booking = await Booking.findById(bookingId)
      .populate('event', 'title bannerImageUrl startDateTime endDateTime venue mode entryType')
      .lean();
    
    if (!booking) {
      res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
      return;
    }
    
    // Check if the booking belongs to the user
    if (booking.user.toString() !== userId) {
      res.status(403).json({
        success: false,
        error: 'Not authorized to access this booking'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error: any) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error retrieving booking details'
    });
  }
};

// Cancel booking - Replace with non-transaction version
export const cancelBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;
    
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
      return;
    }
    
    // Check if the booking belongs to the user
    if (booking.user.toString() !== userId) {
      res.status(403).json({
        success: false,
        error: 'Not authorized to cancel this booking'
      });
      return;
    }
    
    // Get event to check its start time
    const event = await Event.findById(booking.event);
    
    if (!event) {
      res.status(404).json({
        success: false,
        error: 'Event not found'
      });
      return;
    }
    
    // Check if event has already started
    const now = new Date();
    const eventStart = new Date(event.startDateTime);
    
    if (eventStart <= now) {
      res.status(400).json({
        success: false,
        error: 'Cannot cancel booking after event has started'
      });
      return;
    }
    
    // Update booking status
    booking.bookingStatus = 'cancelled';
    await booking.save();
    
    // Remove event from user's eventsRegistered array
    await User.findByIdAndUpdate(
      userId,
      { $pull: { eventsRegistered: booking.event } }
    );
    
    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error: any) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error cancelling booking'
    });
  }
};

// Get remaining spots for an event
export const getRemainingSpots = async (req: Request, res: Response): Promise<void> => {
  try {
    const eventId = req.params.eventId;
    
    // Check if event exists
    const event = await Event.findById(eventId);
    
    if (!event) {
      res.status(404).json({
        success: false,
        error: 'Event not found'
      });
      return;
    }
    
    // Calculate booked tickets
    const bookedCount = await Booking.aggregate([
      { 
        $match: { 
          event: new mongoose.Types.ObjectId(eventId), 
          bookingStatus: 'confirmed' 
        } 
      },
      { 
        $group: { 
          _id: null, 
          totalTickets: { $sum: '$ticketCount' } 
        } 
      }
    ]);
    
    const bookedTickets = bookedCount.length > 0 ? bookedCount[0].totalTickets : 0;
    const availableSpots = event.maxParticipants - bookedTickets;
    
    res.status(200).json({
      success: true,
      data: {
        totalCapacity: event.maxParticipants,
        bookedTickets,
        availableSpots
      }
    });
  } catch (error: any) {
    console.error('Error fetching remaining spots:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error calculating remaining spots'
    });
  }
};