const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
        type: String,
        trim: true,
        match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    subject: {
        type: String,
        maxlength: [200, 'Subject cannot exceed 200 characters']
    },
    status: {
        type: String,
        enum: ['New', 'Read', 'Replied', 'Resolved'],
        default: 'New'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    adminNotes: {
        type: String
    },
    repliedAt: {
        type: Date
    },
    repliedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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
contactMessageSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Index for efficient searching
contactMessageSchema.index({ status: 1, createdAt: -1 });
contactMessageSchema.index({ email: 1 });

module.exports = mongoose.model('ContactMessage', contactMessageSchema);