const mongoose = require('mongoose');

const bloodBankSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Blood bank name is required'],
        trim: true,
        maxlength: [200, 'Name cannot exceed 200 characters']
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true
    },
    district: {
        type: String,
        required: [true, 'District is required'],
        trim: true
    },
    contact: {
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
        },
        emergencyContact: {
            type: String,
            match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid emergency contact']
        }
    },
    operatingHours: {
        monday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
        tuesday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
        wednesday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
        thursday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
        friday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
        saturday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
        sunday: { open: String, close: String, isOpen: { type: Boolean, default: false } }
    },
    bloodInventory: {
        'A+': { type: Number, default: 0, min: 0 },
        'A-': { type: Number, default: 0, min: 0 },
        'B+': { type: Number, default: 0, min: 0 },
        'B-': { type: Number, default: 0, min: 0 },
        'AB+': { type: Number, default: 0, min: 0 },
        'AB-': { type: Number, default: 0, min: 0 },
        'O+': { type: Number, default: 0, min: 0 },
        'O-': { type: Number, default: 0, min: 0 }
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            index: '2dsphere'
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    facilities: [{
        type: String,
        enum: ['Blood Collection', 'Blood Testing', 'Storage', 'Emergency Services', 'Mobile Units']
    }],
    certification: {
        isGovernmentApproved: { type: Boolean, default: false },
        license: String,
        expiryDate: Date
    },
    lastInventoryUpdate: {
        type: Date,
        default: Date.now
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
bloodBankSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Index for efficient searching
bloodBankSchema.index({ district: 1, isActive: 1 });
bloodBankSchema.index({ 'bloodInventory.A+': 1 });
bloodBankSchema.index({ 'bloodInventory.B+': 1 });
bloodBankSchema.index({ 'bloodInventory.O+': 1 });
bloodBankSchema.index({ 'bloodInventory.AB+': 1 });

module.exports = mongoose.model('BloodBank', bloodBankSchema);