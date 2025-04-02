import { Request, Response } from 'express';
import { Booking } from '../models/Booking';
import { Event } from '../models/Event';
import mongoose from 'mongoose';

// Get participants for an event
export const getEventParticipants = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;
    const organizerId = req.user?.id;

    // Verify event exists and belongs to the organizer
    const event = await Event.findOne({ 
      _id: eventId,
      organizerId: organizerId
    });

    if (!event) {
      res.status(403).json({
        success: false,
        error: 'Unauthorized: Event not found or you do not have access to it'
      });
      return;
    }

    // Fetch all bookings for this event
    const bookings = await Booking.find({
      event: eventId,
      bookingStatus: { $ne: 'cancelled' } // Exclude cancelled bookings
    }).populate('user', 'name email').lean();

    // Format the participants data
    const participants = bookings.map(booking => {
      // Add the primary participant
      const participants = [{
        id: booking._id.toString(),
        name: booking.name,
        email: booking.email,
        phone: booking.phone,
        registrationDate: booking.createdAt,
        attendanceStatus: booking.attendanceStatus || 'not_marked',
        ticketId: booking.ticketId,
        attendeeType: booking.attendeeType,
        userId: booking.user?._id?.toString() || null
      }];

      // Add any additional participants if they exist
      if (booking.additionalParticipants && booking.additionalParticipants.length > 0) {
        booking.additionalParticipants.forEach((participant, index) => {
          participants.push({
            id: `${booking._id.toString()}-${index + 1}`,
            name: participant.name,
            email: participant.email,
            phone: '', // Additional participants might not have phone numbers
            registrationDate: booking.createdAt,
            attendanceStatus: 'not_marked',
            ticketId: `${booking.ticketId}-${index + 1}`,
            attendeeType: booking.attendeeType,
            userId: null // Additional participants aren't linked to user accounts
          });
        });
      }

      return participants;
    });

    // Flatten the array of arrays
    const flattenedParticipants = participants.flat();

    res.status(200).json({
      success: true,
      count: flattenedParticipants.length,
      data: flattenedParticipants
    });
  } catch (error: any) {
    console.error('Error fetching event participants:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error fetching participants'
    });
  }
};

// Mark attendance for a participant
export const markAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const organizerId = req.user?.id;

    if (!['present', 'absent', 'not_marked'].includes(status)) {
      res.status(400).json({
        success: false,
        error: 'Invalid attendance status'
      });
      return;
    }

    // Find the booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
      return;
    }

    // Check if the event belongs to the organizer
    const event = await Event.findOne({
      _id: booking.event,
      organizerId: organizerId
    });

    if (!event) {
      res.status(403).json({
        success: false,
        error: 'Unauthorized: You do not have permission to update this participant'
      });
      return;
    }

    // Update attendance status
    booking.attendanceStatus = status;
    await booking.save();

    res.status(200).json({
      success: true,
      message: `Attendance marked as ${status}`,
      data: {
        id: booking._id,
        attendanceStatus: status
      }
    });
  } catch (error: any) {
    console.error('Error marking attendance:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error updating attendance'
    });
  }
};

// Export participant list to CSV
export const exportParticipants = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;
    const organizerId = req.user?.id;

    // Verify event exists and belongs to the organizer
    const event = await Event.findOne({ 
      _id: eventId,
      organizerId: organizerId
    });

    if (!event) {
      res.status(403).json({
        success: false,
        error: 'Unauthorized: Event not found or you do not have access to it'
      });
      return;
    }

    // Fetch all bookings for this event
    const bookings = await Booking.find({
      event: eventId,
      bookingStatus: { $ne: 'cancelled' } // Exclude cancelled bookings
    }).lean();

    // Create CSV data
    let csvData = "Name,Email,Phone,Registration Date,Attendee Type,Attendance Status,Ticket ID\n";
    
    bookings.forEach(booking => {
      // Add primary participant
      csvData += `"${booking.name}","${booking.email}","${booking.phone}","${new Date(booking.createdAt).toLocaleDateString()}","${booking.attendeeType}","${booking.attendanceStatus || 'not_marked'}","${booking.ticketId}"\n`;
      
      // Add additional participants if any
      if (booking.additionalParticipants && booking.additionalParticipants.length > 0) {
        booking.additionalParticipants.forEach((participant, index) => {
          csvData += `"${participant.name}","${participant.email}","","${new Date(booking.createdAt).toLocaleDateString()}","${booking.attendeeType}","not_marked","${booking.ticketId}-${index + 1}"\n`;
        });
      }
    });

    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=participants-${eventId}.csv`);
    
    res.status(200).send(csvData);
  } catch (error: any) {
    console.error('Error exporting participants:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error generating export'
    });
  }
};