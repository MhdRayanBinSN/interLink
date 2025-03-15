import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full Name is required']
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
    dob: {
        type: Date,
        required: [true, 'Date of birth is required']
    },
    attendeeType: {
        type: String,
        required: [true, 'Attendee type is required'],
        enum: {
            values: ['student', 'educator', 'professional'],
            message: '{VALUE} is not a valid attendee type'
        }
    },
    profilePicture: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    interests: [{
        type: String
    }],
    eventsRegistered: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    eventsCreated: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    profileDetails: {
        organization: {
            type: String,
            default: ''
        },
        specialization: {
            type: String,
            default: ''
        },
        githubProfile: {
            type: String,
            default: ''
        },
        linkedinProfile: {
            type: String,
            default: ''
        },
        domain: {
            type: String,
            default: ''
        }
    }
},{
    timestamps: true
});

// Add a pre-save hook to hash password if needed
// userSchema.pre('save', async function(next) {
//    // Password hashing logic here
// });

export const User = mongoose.model('User', userSchema);