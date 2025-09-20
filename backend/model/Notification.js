const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Recipient is required']
    },
    type: {
        type: String,
        enum: [
            'BloodRequest',
            'DonationReminder',
            'ProfileUpdate',
            'SystemAlert',
            'BloodBankAlert',
            'EmergencyRequest'
        ],
        required: [true, 'Notification type is required']
    },
    title: {
        type: String,
        required: [true, 'Notification title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    message: {
        type: String,
        required: [true, 'Notification message is required'],
        trim: true,
        maxlength: [500, 'Message cannot exceed 500 characters']
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    },
    // Related data
    relatedRequest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BloodRequest'
    },
    relatedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    relatedBloodBank: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BloodBank'
    },
    // Location-based data for blood requests
    requestLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    },
    distance: {
        type: Number, // Distance in kilometers
        default: 0
    },
    bloodTypeNeeded: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    urgencyLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    },
    // Status tracking
    status: {
        type: String,
        enum: ['Pending', 'Sent', 'Read', 'Clicked', 'Dismissed', 'Expired'],
        default: 'Pending'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    readAt: {
        type: Date
    },
    sentAt: {
        type: Date
    },
    clickedAt: {
        type: Date
    },
    dismissedAt: {
        type: Date
    },
    // Delivery channels
    channels: {
        inApp: {
            enabled: { type: Boolean, default: true },
            sent: { type: Boolean, default: false },
            sentAt: { type: Date }
        },
        email: {
            enabled: { type: Boolean, default: false },
            sent: { type: Boolean, default: false },
            sentAt: { type: Date }
        },
        sms: {
            enabled: { type: Boolean, default: false },
            sent: { type: Boolean, default: false },
            sentAt: { type: Date }
        },
        push: {
            enabled: { type: Boolean, default: true },
            sent: { type: Boolean, default: false },
            sentAt: { type: Date }
        }
    },
    // Action buttons for the notification
    actionButtons: [{
        label: { type: String, required: true },
        action: { type: String, required: true }, // 'donate', 'view', 'dismiss', 'contact'
        url: { type: String },
        style: { type: String, enum: ['primary', 'secondary', 'danger'], default: 'primary' }
    }],
    // Expiration
    expiresAt: {
        type: Date,
        default: function() {
            // Default expiration: 24 hours for blood requests, 7 days for others
            const hours = this.type === 'BloodRequest' ? 24 : 168;
            return new Date(Date.now() + hours * 60 * 60 * 1000);
        }
    },
    // Metadata
    metadata: {
        deviceInfo: { type: String },
        userAgent: { type: String },
        ipAddress: { type: String },
        source: { type: String, default: 'system' }
    }
}, {
    timestamps: true
});

// Create indexes for better query performance
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ type: 1, status: 1 });
notificationSchema.index({ priority: 1, createdAt: -1 });
notificationSchema.index({ isRead: 1, recipient: 1 });
notificationSchema.index({ expiresAt: 1 });
notificationSchema.index({ 'requestLocation': '2dsphere' });

// Virtual for time since created
notificationSchema.virtual('timeAgo').get(function() {
    const now = new Date();
    const diffMs = now - this.createdAt;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
});

// Virtual to check if notification is expired
notificationSchema.virtual('isExpired').get(function() {
    return new Date() > this.expiresAt;
});

// Method to mark as read
notificationSchema.methods.markAsRead = function() {
    if (!this.isRead) {
        this.isRead = true;
        this.readAt = new Date();
        this.status = 'Read';
    }
    return this.save();
};

// Method to mark as clicked
notificationSchema.methods.markAsClicked = function() {
    this.clickedAt = new Date();
    this.status = 'Clicked';
    if (!this.isRead) {
        this.isRead = true;
        this.readAt = new Date();
    }
    return this.save();
};

// Method to dismiss notification
notificationSchema.methods.dismiss = function() {
    this.status = 'Dismissed';
    this.dismissedAt = new Date();
    return this.save();
};

// Static method to create blood request notification
notificationSchema.statics.createBloodRequestNotification = function(recipient, bloodRequest, distance) {
    const urgencyText = bloodRequest.urgencyLevel === 'Critical' ? 'URGENT: ' : '';
    
    return new this({
        recipient: recipient._id,
        type: 'BloodRequest',
        title: `${urgencyText}Blood Needed: ${bloodRequest.bloodType}`,
        message: `Someone ${distance ? `${distance}km away` : 'nearby'} needs ${bloodRequest.bloodType} blood. Your donation could save a life!`,
        priority: bloodRequest.urgencyLevel === 'Critical' ? 'Critical' : 'High',
        relatedRequest: bloodRequest._id,
        relatedUser: bloodRequest.requester,
        requestLocation: bloodRequest.location,
        distance: distance || 0,
        bloodTypeNeeded: bloodRequest.bloodType,
        urgencyLevel: bloodRequest.urgencyLevel,
        actionButtons: [
            {
                label: 'I can donate',
                action: 'donate',
                url: `/blood-requests/${bloodRequest._id}`,
                style: 'primary'
            },
            {
                label: 'View details',
                action: 'view',
                url: `/blood-requests/${bloodRequest._id}`,
                style: 'secondary'
            }
        ],
        channels: {
            inApp: { enabled: true },
            push: { enabled: true },
            email: { enabled: recipient.notificationPreferences?.email || false },
            sms: { enabled: recipient.notificationPreferences?.sms || false }
        }
    });
};

// Static method to clean up expired notifications
notificationSchema.statics.cleanupExpired = async function() {
    return await this.deleteMany({
        expiresAt: { $lt: new Date() },
        status: { $in: ['Dismissed', 'Expired'] }
    });
};

// Static method to get user's unread notifications count
notificationSchema.statics.getUnreadCount = async function(userId) {
    return await this.countDocuments({
        recipient: userId,
        isRead: false,
        expiresAt: { $gt: new Date() }
    });
};

// Pre-save middleware to set sentAt when status changes to Sent
notificationSchema.pre('save', function(next) {
    if (this.isModified('status') && this.status === 'Sent' && !this.sentAt) {
        this.sentAt = new Date();
    }
    next();
});

// Pre-save middleware to expire old notifications
notificationSchema.pre('save', function(next) {
    if (this.isExpired && this.status !== 'Expired') {
        this.status = 'Expired';
    }
    next();
});

module.exports = mongoose.model('Notification', notificationSchema);