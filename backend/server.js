const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Import routes
const userRoutes = require('./routes/user');
const bloodRequestRoutes = require('./routes/bloodRequest');
const bloodBankRoutes = require('./routes/bloodBank');
const contactRoutes = require('./routes/contact');
const hospitalRoutes = require('./routes/hospital');
const notificationRoutes = require('./routes/notification');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('✅ MongoDB connected successfully');
})
.catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'PulsePlush Blood Donation API is running',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/blood-requests', bloodRequestRoutes);
app.use('/api/blood-banks', bloodBankRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/notifications', notificationRoutes);

// Direct API routes for frontend compatibility
app.use('/api', userRoutes);




// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
