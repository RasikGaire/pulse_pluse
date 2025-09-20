const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Hospital name is required'],
        trim: true,
        maxlength: [100, 'Hospital name cannot exceed 100 characters']
    },
    address: {
        street: {
            type: String,
            required: [true, 'Street address is required'],
            trim: true
        },
        city: {
            type: String,
            required: [true, 'City is required'],
            trim: true
        },
        state: {
            type: String,
            required: [true, 'State is required'],
            trim: true
        },
        postalCode: {
            type: String,
            required: [true, 'Postal code is required'],
            trim: true
        },
        country: {
            type: String,
            default: 'Nepal',
            trim: true
        }
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
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        validate: {
            validator: function(v) {
                return /^[\+]?[0-9\s\-\(\)]+$/.test(v);
            },
            message: 'Please enter a valid phone number'
        }
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return !v || /^\S+@\S+\.\S+$/.test(v);
            },
            message: 'Please enter a valid email address'
        }
    },
    website: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                return !v || /^https?:\/\/.+/.test(v);
            },
            message: 'Please enter a valid website URL'
        }
    },
    hasBloodBank: {
        type: Boolean,
        default: false
    },
    emergencyServices: {
        type: Boolean,
        default: false
    },
    specialties: [{
        type: String,
        trim: true,
        enum: [
            'Cardiology',
            'Neurology',
            'Orthopedics',
            'Pediatrics',
            'Oncology',
            'Emergency Medicine',
            'Internal Medicine',
            'Surgery',
            'Obstetrics and Gynecology',
            'Radiology',
            'Anesthesiology',
            'Pathology',
            'Dermatology',
            'Psychiatry',
            'Ophthalmology',
            'ENT',
            'Urology',
            'Gastroenterology',
            'Nephrology',
            'Pulmonology',
            'Endocrinology',
            'Rheumatology',
            'Hematology',
            'Infectious Disease',
            'Physical Medicine',
            'Plastic Surgery',
            'General Practice'
        ]
    }],
    operatingHours: {
        monday: {
            open: { type: String, default: '00:00' },
            close: { type: String, default: '23:59' },
            is24Hours: { type: Boolean, default: true }
        },
        tuesday: {
            open: { type: String, default: '00:00' },
            close: { type: String, default: '23:59' },
            is24Hours: { type: Boolean, default: true }
        },
        wednesday: {
            open: { type: String, default: '00:00' },
            close: { type: String, default: '23:59' },
            is24Hours: { type: Boolean, default: true }
        },
        thursday: {
            open: { type: String, default: '00:00' },
            close: { type: String, default: '23:59' },
            is24Hours: { type: Boolean, default: true }
        },
        friday: {
            open: { type: String, default: '00:00' },
            close: { type: String, default: '23:59' },
            is24Hours: { type: Boolean, default: true }
        },
        saturday: {
            open: { type: String, default: '00:00' },
            close: { type: String, default: '23:59' },
            is24Hours: { type: Boolean, default: true }
        },
        sunday: {
            open: { type: String, default: '00:00' },
            close: { type: String, default: '23:59' },
            is24Hours: { type: Boolean, default: true }
        }
    },
    contactPerson: {
        name: {
            type: String,
            trim: true
        },
        designation: {
            type: String,
            trim: true
        },
        phone: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            trim: true,
            lowercase: true
        }
    },
    bloodBankDetails: {
        capacity: {
            type: Number,
            default: 0
        },
        currentStock: {
            type: Number,
            default: 0
        },
        bloodTypes: [{
            type: String,
            enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
        }],
        storageCapacity: {
            wholeBlood: { type: Number, default: 0 },
            redBloodCells: { type: Number, default: 0 },
            platelets: { type: Number, default: 0 },
            plasma: { type: Number, default: 0 }
        }
    },
    certification: {
        type: String,
        trim: true
    },
    licenseNumber: {
        type: String,
        trim: true
    },
    establishedYear: {
        type: Number,
        min: [1800, 'Established year must be after 1800'],
        max: [new Date().getFullYear(), 'Established year cannot be in the future']
    },
    bedCapacity: {
        total: { type: Number, default: 0 },
        icu: { type: Number, default: 0 },
        emergency: { type: Number, default: 0 }
    },
    rating: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        totalReviews: {
            type: Number,
            default: 0
        }
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Under Maintenance'],
        default: 'Active'
    },
    verificationStatus: {
        type: String,
        enum: ['Pending', 'Verified', 'Rejected'],
        default: 'Pending'
    },
    verifiedAt: {
        type: Date
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Create indexes for better query performance
hospitalSchema.index({ 'address.city': 1 });
hospitalSchema.index({ 'address.state': 1 });
hospitalSchema.index({ hasBloodBank: 1 });
hospitalSchema.index({ emergencyServices: 1 });
hospitalSchema.index({ specialties: 1 });
hospitalSchema.index({ status: 1 });
hospitalSchema.index({ verificationStatus: 1 });

// Virtual for full address
hospitalSchema.virtual('fullAddress').get(function() {
    return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.postalCode}`;
});

// Method to check if hospital is currently open
hospitalSchema.methods.isCurrentlyOpen = function() {
    const now = new Date();
    const currentDay = now.toLocaleLowerCase().substring(0, 3); // mon, tue, wed, etc.
    const currentTime = now.toTimeString().substring(0, 5); // HH:MM format
    
    const daySchedule = this.operatingHours[currentDay];
    if (!daySchedule) return false;
    
    if (daySchedule.is24Hours) return true;
    
    return currentTime >= daySchedule.open && currentTime <= daySchedule.close;
};

// Method to get distance from a point (requires coordinates)
hospitalSchema.methods.getDistanceFrom = function(latitude, longitude) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (latitude - this.location.coordinates[1]) * Math.PI / 180;
    const dLon = (longitude - this.location.coordinates[0]) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(this.location.coordinates[1] * Math.PI / 180) * Math.cos(latitude * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in kilometers
    return Math.round(d * 100) / 100; // Round to 2 decimal places
};

// Pre-save middleware
hospitalSchema.pre('save', function(next) {
    // Ensure coordinates are numbers
    if (this.location && this.location.coordinates) {
        this.location.coordinates = this.location.coordinates.map(coord => 
            typeof coord === 'string' ? parseFloat(coord) : coord
        );
    }
    
    next();
});

module.exports = mongoose.model('Hospital', hospitalSchema);