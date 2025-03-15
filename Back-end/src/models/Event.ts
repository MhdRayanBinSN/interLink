import mongoose, { Document, Schema } from 'mongoose';

// Speaker interface
interface ISpeaker {
  name: string;
  bio: string;
  topic?: string;
  designation?: string;
  organization?: string;
  imageUrl?: string;
}

// Schedule item interface
interface IScheduleItem {
  time: string;
  title: string;
  description: string;
}

// Social media link interface
interface ISocialLink {
  platform: string;
  url: string;
}

// Bank details interface
interface IBankDetails {
  accountName: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  upiId?: string;
}

// Main Event interface
export interface IEvent extends Document {
  // Basic Details
  title: string;
  eventType: 'workshop' | 'hackathon' | 'seminar' | 'bootcamp';
  category: string;
  bannerImageUrl?: string;
  eventWebsite?: string;
  
  // Organizer Details
  organizerName: string;
  organizerEmail: string;
  organizerPhone: string;
  organizationName?: string;
  
  // Schedule & Location
  startDateTime: Date;
  endDateTime: Date;
  mode: 'online' | 'offline' | 'hybrid';
  venue?: string;
  languages: string[];
  schedules: IScheduleItem[];
  
  // Participation Details
  targetAudience: string[];
  eligibilityCriteria?: string;
  maxParticipants: number;
  registrationDeadline: Date;
  
  // Ticketing
  entryType: 'free' | 'paid';
  ticketPrice?: number;
  paymentGateway?: string;
  bankDetails?: IBankDetails;
  
  // Content
  speakers: ISpeaker[];
  aboutEvent: string;
  streamingLink?: string;
  resourceUrls?: string[];
  socialLinks: ISocialLink[];
  
  // Status
  status: 'draft' | 'upcoming' | 'ongoing' | 'completed' | 'canceled';
  
  // System fields
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
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
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    bannerImageUrl: {
      type: String,
      trim: true
    },
    eventWebsite: {
      type: String,
      trim: true
    },
    
    // Organizer Details
    organizerName: {
      type: String,
      required: true,
      trim: true
    },
    organizerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    organizerPhone: {
      type: String,
      required: true,
      trim: true
    },
    organizationName: {
      type: String,
      trim: true
    },
    
    // Schedule & Location
    startDateTime: {
      type: Date,
      required: true
    },
    endDateTime: {
      type: Date,
      required: true
    },
    mode: {
      type: String,
      required: true,
      enum: ['online', 'offline', 'hybrid']
    },
    venue: {
      type: String,
      trim: true
    },
    languages: [{
      type: String,
      trim: true
    }],
    schedules: [{
      time: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true,
        trim: true
      },
      description: {
        type: String,
        trim: true
      }
    }],
    
    // Participation Details
    targetAudience: [{
      type: String,
      trim: true
    }],
    eligibilityCriteria: {
      type: String,
      trim: true
    },
    maxParticipants: {
      type: Number,
      required: true,
      min: 1
    },
    registrationDeadline: {
      type: Date,
      required: true
    },
    
    // Ticketing
    entryType: {
      type: String,
      required: true,
      enum: ['free', 'paid']
    },
    ticketPrice: {
      type: Number,
      min: 0
    },
    paymentGateway: {
      type: String,
      trim: true
    },
    bankDetails: {
      accountName: {
        type: String,
        trim: true
      },
      accountNumber: {
        type: String,
        trim: true
      },
      bankName: {
        type: String,
        trim: true
      },
      ifscCode: {
        type: String,
        trim: true
      },
      upiId: {
        type: String,
        trim: true
      }
    },
    
    // Content
    speakers: [{
      name: {
        type: String,
        required: true,
        trim: true
      },
      bio: {
        type: String,
        trim: true
      },
      topic: {
        type: String,
        trim: true
      },
      designation: {
        type: String,
        trim: true
      },
      organization: {
        type: String,
        trim: true
      },
      imageUrl: {
        type: String,
        trim: true
      }
    }],
    aboutEvent: {
      type: String,
      default: ""
    },
    streamingLink: {
      type: String,
      trim: true
    },
    resourceUrls: [{
      type: String,
      trim: true
    }],
    socialLinks: [{
      platform: {
        type: String,
        trim: true,
        required: true
      },
      url: {
        type: String,
        trim: true,
        required: true
      }
    }],
    
    // Status
    status: {
      type: String,
      required: true,
      enum: ['draft', 'upcoming', 'ongoing', 'completed', 'canceled'],
      default: 'draft'
    }
  },
  {
    timestamps: true
  }
);

// Add validation for ticketPrice when entryType is paid
eventSchema.pre('validate', function(next) {
  if (this.entryType === 'paid' && (this.ticketPrice === undefined || this.ticketPrice <= 0)) {
    this.invalidate('ticketPrice', 'Ticket price is required for paid events');
  }
  
  // Validate venue for offline/hybrid events
  if ((this.mode === 'offline' || this.mode === 'hybrid') && !this.venue) {
    this.invalidate('venue', 'Venue is required for offline or hybrid events');
  }
  
  // Validate streaming link for online/hybrid events
  if ((this.mode === 'online' || this.mode === 'hybrid') && !this.streamingLink) {
    this.invalidate('streamingLink', 'Streaming link is required for online or hybrid events');
  }
  
  next();
});

// Add this function to your Event model if not already present
eventSchema.methods.getRemainingSpots = async function(): Promise<number> {
  const bookedCount = await mongoose.model('Booking').aggregate([
    { $match: { event: this._id, bookingStatus: 'confirmed' } },
    { $group: { _id: null, totalTickets: { $sum: '$ticketCount' } } }
  ]);
  
  const bookedTickets = bookedCount.length > 0 ? bookedCount[0].totalTickets : 0;
  return this.maxParticipants - bookedTickets;
};

export const Event = mongoose.model<IEvent>('Event', eventSchema);