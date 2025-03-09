import mongoose from 'mongoose';
import bcrypt from 'bcrypt-ts';

const organizerSchema = new mongoose.Schema({
    organizationName: {
        type: String,
        required: [true, 'Organization name is required'],
        trim: true
      },
      organizationType: {
        type: String,
        required: [true, 'Organization type is required'],
        enum: ['educational', 'tech-company', 'non-profit', 'community','individual'],
        default: 'educational'
      },
      website: {
        type: String,
        trim: true,
        match: [
          /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
          'Please enter a valid URL'
        ]
      },
      contactPerson: {
        type: String,
        required: [true, 'Contact person name is required'],
        trim: true
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
      },
      phone: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
      },
      password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false // Excludes password by default in queries
      },
      userId: {
        type: String,
        required: [true, 'User ID is required'],
        unique: true,
        trim: true
      }
}, {
  timestamps: true
});

// Hash password before saving
organizerSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

export const Organizer = mongoose.model('Organizer', organizerSchema);