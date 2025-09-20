const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full Name is Required'],
        trim: true,
        maxlength: [100, 'Full name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is Required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is Required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    phone: {
        type: String,
        trim: true,
        match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
    },
    address: {
        type: String,
        trim: true,
        maxlength: [200, 'Address cannot exceed 200 characters']
    },
    district: {
        type: String,
        trim: true
    },
    // Location coordinates for proximity searches
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0],
            index: '2dsphere'
        }
    },
    bloodType: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        uppercase: true
    },
    dateOfBirth: {
        type: Date
    },
    profilePicture: {
        type: String,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isDonor: {
        type: Boolean,
        default: false
    },
    lastDonationDate: {
        type: Date
    },
    // Social Media Links
    socialMedia: {
        facebook: { type: String, default: '' },
        instagram: { type: String, default: '' },
        twitter: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        youtube: { type: String, default: '' },
        whatsapp: { type: String, default: '' }
    },
    // Communities the user is part of
    communities: [{
        name: { type: String, required: true },
        joinedDate: { type: Date, default: Date.now },
        role: { type: String, default: 'Member' }
    }],
    // Donation Statistics
    donationStats: {
        totalDonations: { type: Number, default: 0 },
        volunteerHours: { type: Number, default: 0 },
        lastDonationDate: { type: Date }
    },
    // Profile Description
    description: {
        type: String,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    // Availability for donation
    availability: {
        isAvailable: { type: Boolean, default: true },
        availableDate: { type: Date },
        notes: { type: String }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Update updatedAt field before saving
userSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

module.exports = mongoose.model('User', userSchema);