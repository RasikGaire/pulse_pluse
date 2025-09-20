const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Requester is required']
    },
    bloodGroup: {
        type: String,
        required: [true, 'Blood group is required'],
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        uppercase: true
    },
    bloodUnits: {
        type: Number,
        required: [true, 'Number of blood units is required'],
        min: [1, 'At least 1 unit is required'],
        max: [10, 'Maximum 10 units can be requested']
    },
    appointmentDate: {
        type: Date,
        required: [true, 'Appointment date is required']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
    },
    district: {
        type: String,
        required: [true, 'District is required'],
        trim: true
    },
    hospitalName: {
        type: String,
        required: [true, 'Hospital name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    urgencyLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    },
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
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Fulfilled', 'Cancelled', 'Expired'],
        default: 'Pending'
    },
    matchedDonors: [{
        donor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['Contacted', 'Confirmed', 'Declined'],
            default: 'Contacted'
        },
        contactedAt: {
            type: Date,
            default: Date.now
        }
    }],
    fulfilledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    fulfilledAt: {
        type: Date
    },
    notes: {
        type: String
    },
    isEmergency: {
        type: Boolean,
        default: false
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

// Update updatedAt field before saving
bloodRequestSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Index for efficient searching
bloodRequestSchema.index({ bloodGroup: 1, status: 1 });
bloodRequestSchema.index({ district: 1, status: 1 });
bloodRequestSchema.index({ appointmentDate: 1 });

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);