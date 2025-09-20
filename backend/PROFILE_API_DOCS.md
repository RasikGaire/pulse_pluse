# Profile Management API Documentation

## Overview
The backend now includes complete profile management functionality for users in the blood donation system.

## New API Endpoints

### 1. Get User Profile
**GET** `/api/profile`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "user": {
    "_id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St, City",
    "bloodType": "O+",
    "dateOfBirth": "1990-01-01T00:00:00.000Z",
    "isVerified": false,
    "createdAt": "2025-09-20T07:00:00.000Z",
    "updatedAt": "2025-09-20T07:00:00.000Z"
  }
}
```

### 2. Update User Profile
**PUT** `/api/profile`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "fullName": "John Doe Updated",
  "email": "newemail@example.com",
  "phone": "+1234567890",
  "address": "456 New Street, New City",
  "bloodType": "A+",
  "dateOfBirth": "1990-01-01"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    // updated user object
  }
}
```

### 3. Change Password
**PUT** `/api/profile/password`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

## Updated User Model Fields

The User model now includes additional fields for a complete profile:

- `fullName` - User's full name (required)
- `email` - Email address (required, unique)
- `password` - Hashed password (required)
- `phone` - Phone number (optional, validated)
- `address` - Physical address (optional)
- `bloodType` - Blood type (optional, enum: A+, A-, B+, B-, AB+, AB-, O+, O-)
- `dateOfBirth` - Date of birth (optional)
- `profilePicture` - Profile picture URL (optional)
- `isVerified` - Account verification status (default: false)
- `lastDonationDate` - Last blood donation date (optional)
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

## Security Features

1. **JWT Authentication**: All profile endpoints require valid JWT tokens
2. **Password Hashing**: Passwords are automatically hashed using bcrypt
3. **Email Uniqueness**: Email validation prevents duplicate accounts
4. **Input Validation**: Comprehensive validation for all fields
5. **Error Handling**: Proper error responses for validation and authentication failures

## Usage Example

```javascript
// Frontend example using fetch
const updateProfile = async (profileData) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:5000/api/profile', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(profileData)
  });
  
  return await response.json();
};

// Update user profile
const result = await updateProfile({
  fullName: "Updated Name",
  phone: "+1234567890",
  bloodType: "O+"
});
```

## Error Responses

### Authentication Errors
```json
{
  "success": false,
  "message": "Access token required"
}
```

### Validation Errors
```json
{
  "success": false,
  "message": "Validation error",
  "errors": ["Please enter a valid phone number"]
}
```

### Duplicate Email Error
```json
{
  "success": false,
  "message": "Email is already in use"
}
```

This implementation provides a complete profile management system that integrates seamlessly with your existing authentication system and supports all the features needed for a blood donation application.