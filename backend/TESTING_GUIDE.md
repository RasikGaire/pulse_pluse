# Testing Guide - Profile Update & Donor Notification System

## 🔧 Issues Fixed & Features Added

### 1. ✅ Profile Edit Functionality Fixed
**Problem**: Profile edit was not working properly
**Solution**: Enhanced profile update endpoint to handle all user fields

**New Profile Update Fields Supported:**
- Basic Info: `fullName`, `email`, `phone`, `address`, `district`
- Blood Info: `bloodType`, `isDonor`, `dateOfBirth`
- Social Media: `socialMedia` object with platforms
- Availability: `availability` object for donation status
- Location: `latitude`, `longitude` for proximity matching
- Description: Personal description field

### 2. 🔔 Donor Notification System Implemented
**Feature**: Automatic notifications to nearby donors when blood requests are created
**How it works**: When a blood request is created, the system finds compatible donors within a configurable radius and sends notifications

## 📡 New API Endpoints

### Profile Management
```
PUT /api/users/profile
Content-Type: application/json
Authorization: Bearer <token>

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+977-9841234567",
  "address": "Kathmandu, Nepal",
  "district": "Kathmandu",
  "bloodType": "O+",
  "isDonor": true,
  "description": "Happy to help save lives",
  "latitude": 27.7172,
  "longitude": 85.3240,
  "socialMedia": {
    "facebook": "https://facebook.com/johndoe",
    "instagram": "@johndoe"
  },
  "availability": {
    "isAvailable": true,
    "notes": "Available on weekends"
  }
}
```

### Blood Request with Location
```
POST /api/blood-requests
Content-Type: application/json
Authorization: Bearer <token>

{
  "bloodGroup": "O+",
  "bloodUnits": 2,
  "appointmentDate": "2024-12-25T10:00:00Z",
  "phoneNumber": "+977-9841234567",
  "district": "Kathmandu",
  "hospitalName": "Bir Hospital",
  "description": "Urgent blood needed for surgery",
  "urgencyLevel": "Critical",
  "isEmergency": true,
  "latitude": 27.7172,
  "longitude": 85.3240
}
```

### Notification Management
```
GET /api/notifications          # Get user notifications
GET /api/notifications/stats    # Get notification statistics
PUT /api/notifications/mark-all-read  # Mark all as read
PUT /api/notifications/:id/read      # Mark specific as read
PUT /api/notifications/:id/click     # Track click
PUT /api/notifications/:id/dismiss   # Dismiss notification
```

## 🧪 Testing Steps

### Test 1: Profile Update
1. **Register/Login** a user
2. **Update Profile** with new fields:
   ```bash
   curl -X PUT http://localhost:5000/api/users/profile \
   -H "Authorization: Bearer YOUR_TOKEN" \
   -H "Content-Type: application/json" \
   -d '{
     "fullName": "Updated Name",
     "bloodType": "O+",
     "isDonor": true,
     "latitude": 27.7172,
     "longitude": 85.3240
   }'
   ```
3. **Verify Response** includes updated fields

### Test 2: Donor Notification System
1. **Setup Donors**: Create 2-3 users with:
   - `isDonor: true`
   - Compatible blood types
   - Location coordinates
   - `availability.isAvailable: true`

2. **Create Blood Request** with location:
   ```bash
   curl -X POST http://localhost:5000/api/blood-requests \
   -H "Authorization: Bearer REQUESTER_TOKEN" \
   -H "Content-Type: application/json" \
   -d '{
     "bloodGroup": "O+",
     "bloodUnits": 1,
     "appointmentDate": "2024-12-25T10:00:00Z",
     "phoneNumber": "+977-9841234567",
     "district": "Kathmandu",
     "hospitalName": "Test Hospital",
     "description": "Test request",
     "urgencyLevel": "High",
     "latitude": 27.7172,
     "longitude": 85.3240
   }'
   ```

3. **Check Notifications** for donors:
   ```bash
   curl -X GET http://localhost:5000/api/notifications \
   -H "Authorization: Bearer DONOR_TOKEN"
   ```

### Test 3: Blood Compatibility
The system automatically finds compatible donors:
- **A+** can receive from: A+, A-, O+, O-
- **A-** can receive from: A-, O-
- **B+** can receive from: B+, B-, O+, O-
- **B-** can receive from: B-, O-
- **AB+** can receive from: All types (Universal Recipient)
- **AB-** can receive from: A-, B-, AB-, O-
- **O+** can receive from: O+, O-
- **O-** can receive from: O- only

### Test 4: Location-Based Matching
- **Critical Requests**: 50km radius
- **Normal Requests**: 25km radius
- Distance calculation included in notifications

## 🔍 Debugging Tips

### Check Server Logs
```bash
# Terminal where server is running shows:
Found X potential donors for blood type Y
Sent X notifications to nearby donors
```

### Common Issues
1. **Profile Update Fails**: Check if all required fields are provided
2. **No Notifications Sent**: 
   - Verify donors have `isDonor: true`
   - Check blood type compatibility
   - Ensure donors have location coordinates
   - Verify `availability.isAvailable: true`

### Database Verification
```javascript
// Check if notifications were created
db.notifications.find({}).sort({createdAt: -1}).limit(5)

// Check donor profiles
db.users.find({isDonor: true, "availability.isAvailable": true})
```

## 📊 Expected Behavior

### When Blood Request is Created:
1. ✅ Request saved to database
2. ✅ System finds compatible donors within radius
3. ✅ Notifications created for each eligible donor
4. ✅ Response confirms "nearby donors will be notified"
5. ✅ Console logs show notification count

### When Donor Checks Notifications:
1. ✅ Receives notification with blood type needed
2. ✅ Shows distance from request location
3. ✅ Includes urgency level and action buttons
4. ✅ Can click "I can donate" or "View details"

### Profile Update Features:
1. ✅ All user fields can be updated
2. ✅ Location coordinates saved for proximity matching
3. ✅ Social media links and availability status
4. ✅ Validation ensures data integrity

## 🚀 Next Steps
1. Frontend integration for geolocation
2. Real-time notifications (WebSocket/SSE)
3. Email/SMS notification channels
4. Push notifications for mobile app
5. Advanced filtering (age, last donation date)

---
**Status**: ✅ All functionality implemented and tested
**Server**: Running on http://localhost:5000
**Documentation**: Complete with test cases