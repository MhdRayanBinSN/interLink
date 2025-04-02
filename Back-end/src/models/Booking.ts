import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  event: mongoose.Types.ObjectId;
  ticketId: string;
  name: string;
  email: string;
  phone: string;
  attendeeType: string;
  additionalParticipants?: {
    name: string;
    email: string;
  }[];
  ticketCount: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  bookingStatus: 'confirmed' | 'cancelled' | 'pending';
  attendanceStatus?: 'present' | 'absent' | 'not_marked';
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema: Schema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  ticketId: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  attendeeType: {
    type: String,
    required: true,
    enum: ['student', 'professional', 'other']
  },
  additionalParticipants: [{
    name: String,
    email: String
  }],
  ticketCount: {
    type: Number,
    default: 1,
    required: true,
    min: 1
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed' // Default to completed for free events
  },
  bookingStatus: {
    type: String,
    enum: ['confirmed', 'cancelled', 'pending'],
    default: 'confirmed'
  },
  attendanceStatus: {
    type: String,
    enum: ['present', 'absent', 'not_marked'],
    default: 'not_marked'
  }
}, {
  timestamps: true
});

// Generate a unique ticket ID before saving
bookingSchema.pre('save', function(this: IBooking, next) {
  if (!this.ticketId) {
    const eventId = this.event.toString().substring(this.event.toString().length - 6);
    const userId = this.user.toString().substring(this.user.toString().length - 6);
    const timestamp = Date.now().toString().substring(Date.now().toString().length - 6);
    this.ticketId = `EVNT-${eventId}-${userId}-${timestamp}`;
  }
  next();
});

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);