# PulsePlush Blood Donation System - Backend API Documentation

## Overview
Comprehensive backend system for the PulsePlush blood donation platform, implementing all features required by the frontend application.

## Server Status
✅ **Running on Port 5000**
✅ **MongoDB Connected**
✅ **All Routes Operational**

## API Endpoints

### 🔐 Authentication & User Management
**Base URL:** `/api/users`

- `POST /register` - Register new user
- `POST /login` - User login
- `GET /profile` - Get user profile (Protected)
- `PUT /profile` - Update user profile (Protected)
- `PUT /change-password` - Change password (Protected)
- `GET /logout` - User logout (Protected)

### 🩸 Blood Request Management
**Base URL:** `/api/blood-requests`

- `GET /` - Get all blood requests (Public)
- `POST /` - Create new blood request (Protected)
- `GET /search` - Search compatible donors (Public)
- `GET /my-requests` - Get user's blood requests (Protected)
- `GET /:id` - Get blood request by ID (Public)
- `PUT /:id` - Update blood request (Protected)
- `PUT /:id/status` - Update request status (Protected)
- `DELETE /:id` - Delete blood request (Protected)

### 🏥 Blood Bank Management
**Base URL:** `/api/blood-banks`

- `GET /` - Get all blood banks (Public)
- `POST /` - Create blood bank (Admin only)
- `GET /search/type` - Search by blood type (Public)
- `GET /availability-summary` - Get blood availability (Public)
- `GET /:id` - Get blood bank by ID (Public)
- `PUT /:id` - Update blood bank (Admin only)
- `PUT /:id/inventory` - Update inventory (Admin only)

### 📞 Contact Management
**Base URL:** `/api/contact`

- `POST /` - Submit contact message (Public)
- `GET /` - Get all messages (Admin only)
- `GET /statistics` - Get contact statistics (Admin only)
- `GET /:id` - Get message by ID (Admin only)
- `PUT /:id/status` - Update message status (Admin only)

### 🏥 Hospital Management
**Base URL:** `/api/hospitals`

- `GET /` - Get all hospitals (Public)
- `GET /search/location` - Search by location (Public)
- `GET /statistics` - Get hospital statistics (Admin only)
- `GET /:id` - Get hospital by ID (Public)
- `POST /` - Create hospital (Admin only)
- `PUT /:id` - Update hospital (Admin only)
- `DELETE /:id` - Delete hospital (Admin only)

## Database Models

### 👤 User Model
**Features:**
- Complete profile management
- Social media integration
- Community participation tracking
- Donation statistics
- Blood type and availability status
- Location-based services
- Profile verification system

### 🩸 Blood Request Model
**Features:**
- Comprehensive request tracking
- Donor matching system
- Blood compatibility logic
- Urgency levels
- Status management
- Location-based matching
- Hospital integration

### 🏥 Blood Bank Model
**Features:**
- Complete inventory management
- All blood type tracking
- Location services with coordinates
- Operating hours management
- Certification tracking
- Search and filtering capabilities

### 📞 Contact Message Model
**Features:**
- Complete contact form handling
- Priority and status management
- Admin response system
- Spam detection
- Follow-up tracking
- Response time analytics

### 🏥 Hospital Model
**Features:**
- Comprehensive hospital information
- Location-based services
- Specialty tracking
- Blood bank integration
- Operating hours management
- Capacity and rating systems
- Verification and certification

## Key Features Implemented

### 🔒 Security
- JWT authentication with 24-hour expiration
- Password hashing with bcrypt
- Protected routes with middleware
- Admin role verification
- Input validation and sanitization

### 🌍 Location Services
- Geospatial queries for hospitals and blood banks
- Distance calculation utilities
- Location-based donor matching
- Coordinate indexing for performance

### 📊 Data Management
- Comprehensive CRUD operations
- Advanced search and filtering
- Pagination support
- Data aggregation and statistics
- Real-time inventory tracking

### 🔍 Search & Matching
- Blood compatibility algorithms
- Donor-recipient matching
- Location-based searches
- Advanced filtering options
- Real-time availability checking

### 📈 Analytics
- Donation statistics tracking
- Response time analytics
- Inventory summaries
- User engagement metrics
- Contact management insights

## Blood Compatibility System
Implemented complete blood compatibility logic:
- A+ can donate to: A+, AB+
- A- can donate to: A+, A-, AB+, AB-
- B+ can donate to: B+, AB+
- B- can donate to: B+, B-, AB+, AB-
- AB+ can donate to: AB+ (Universal recipient)
- AB- can donate to: AB+, AB-
- O+ can donate to: A+, B+, AB+, O+ (Universal donor for positive)
- O- can donate to: All blood types (Universal donor)

## Environment Setup
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## Dependencies
- Express.js - Web framework
- Mongoose - MongoDB object modeling
- bcryptjs - Password hashing
- jsonwebtoken - JWT implementation
- cors - Cross-origin resource sharing
- dotenv - Environment variable management

## Frontend Integration
All endpoints are designed to work seamlessly with the React frontend:
- User profile management
- Blood donation requests
- Donor search functionality
- Contact form submission
- Hospital and blood bank location services

## Next Steps for Enhancement
1. File upload system for profile pictures
2. Real-time notifications
3. Email integration for contact responses
4. SMS notifications for urgent requests
5. Advanced analytics dashboard
6. Mobile app API optimization
7. Payment integration for donations
8. Social media sharing features

---
**Status:** ✅ Fully Operational
**Last Updated:** December 2024
**Version:** 1.0.0