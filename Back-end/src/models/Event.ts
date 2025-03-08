import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  // Basic Details
  title: {
    type: String,
    required: true,
    trim: true
  },
  eventType: {
    type: String,
    required: true,
    enum: ['workshop', 'hackathon', 'seminar', 'bootcamp']
  }
  
}, {
  timestamps: true
});

export const Event = mongoose.model('Event', eventSchema);