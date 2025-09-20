# Donor Response Notification System

## 🎯 Feature Overview
When donors click on blood requests and respond (interested, confirmed, or declined), the system automatically creates notifications for both the blood request creator and the donor.

## 🔄 How It Works

### 1. Donor Response Flow
```
Donor sees blood request → Clicks "I can donate" → Selects response type → Notification sent to requester
```

### 2. Notification Types Created
- **For Blood Request Creator**: Notified when someone responds to their request
- **For Donor**: Confirmation that their response was recorded

## 📡 New API Endpoints

### Respond to Blood Request
```http
POST /api/blood-requests/:id/respond
Authorization: Bearer <donor_token>
Content-Type: application/json

{
  "responseType": "interested",  // "interested", "confirmed", "declined"
  "message": "I'm available tomorrow morning"  // optional
}
```

**Response Types:**
- `interested` - Donor is interested but not fully committed
- `confirmed` - Donor confirms they will donate
- `declined` - Donor cannot donate

### Get Blood Request Responses
```http
GET /api/blood-requests/:id/responses
Authorization: Bearer <requester_token>
```

## 🔔 Notification Examples

### When Donor Shows Interest
**To Requester:**
```json
{
  "title": "🩸 Donor Interested in Your Request",
  "message": "John Doe is interested in donating O+ blood for your request at City Hospital.",
  "priority": "High",
  "actionButtons": [
    {"label": "View Request", "action": "view"}
  ]
}
```

**To Donor:**
```json
{
  "title": "Response Recorded: Interested",
  "message": "Your response to the O+ blood request at City Hospital has been recorded.",
  "priority": "Medium"
}
```

### When Donor Confirms
**To Requester:**
```json
{
  "title": "✅ Donor Confirmed for Your Request",
  "message": "Great news! John Doe has confirmed to donate O+ blood for your request at City Hospital.",
  "priority": "Critical",
  "actionButtons": [
    {"label": "Contact Donor", "action": "contact"},
    {"label": "View Request", "action": "view"}
  ]
}
```

### When Donor Declines
**To Requester:**
```json
{
  "title": "❌ Donor Declined Your Request",
  "message": "John Doe is unable to donate for your O+ blood request at this time.",
  "priority": "Medium"
}
```

## 🧪 Testing the System

### Step 1: Create Blood Request
```bash
curl -X POST http://localhost:5000/api/blood-requests/create \
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
  "urgencyLevel": "High"
}'
```

### Step 2: Donor Responds
```bash
curl -X POST http://localhost:5000/api/blood-requests/REQUEST_ID/respond \
-H "Authorization: Bearer DONOR_TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "responseType": "confirmed",
  "message": "I can donate tomorrow at 2 PM"
}'
```

### Step 3: Check Notifications

**Requester checks notifications:**
```bash
curl -X GET http://localhost:5000/api/notifications \
-H "Authorization: Bearer REQUESTER_TOKEN"
```

**Donor checks notifications:**
```bash
curl -X GET http://localhost:5000/api/notifications \
-H "Authorization: Bearer DONOR_TOKEN"
```

### Step 4: View All Responses (Requester only)
```bash
curl -X GET http://localhost:5000/api/blood-requests/REQUEST_ID/responses \
-H "Authorization: Bearer REQUESTER_TOKEN"
```

## 📊 Response Summary

The system tracks:
- **Total responses** to each blood request
- **Confirmed donors** ready to donate
- **Interested donors** considering donation
- **Declined responses** for transparency

Example response summary:
```json
{
  "summary": {
    "total": 5,
    "confirmed": 2,
    "interested": 1,
    "declined": 2
  }
}
```

## 🎨 Frontend Integration

### Display Blood Request with Action Buttons
```html
<div class="blood-request">
  <h3>O+ Blood Needed</h3>
  <p>City Hospital - 2 units needed</p>
  <div class="action-buttons">
    <button onclick="respondToRequest('confirmed')">✅ I can donate</button>
    <button onclick="respondToRequest('interested')">🤔 I'm interested</button>
    <button onclick="respondToRequest('declined')">❌ Can't donate</button>
  </div>
</div>
```

### JavaScript Function
```javascript
async function respondToRequest(responseType) {
  const response = await fetch(`/api/blood-requests/${requestId}/respond`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      responseType: responseType,
      message: document.getElementById('donorMessage').value
    })
  });
  
  if (response.ok) {
    showNotification('Response sent! The requester has been notified.');
    // Refresh notifications
    loadNotifications();
  }
}
```

## 🔄 Complete Workflow

1. **Blood Request Created** → Nearby donors notified
2. **Donor Clicks Request** → Views details
3. **Donor Responds** → Chooses interested/confirmed/declined
4. **Notifications Sent** → Both parties notified
5. **Requester Views Responses** → Sees all donor responses
6. **Contact Established** → Successful blood donation

## 📈 Database Changes

### BloodRequest Model Enhancement
```javascript
matchedDonors: [{
  donor: { type: ObjectId, ref: 'User' },
  status: { type: String, enum: ['Contacted', 'Confirmed', 'Declined'] },
  contactedAt: { type: Date, default: Date.now }
}]
```

### Notification Tracking
- Response type notifications
- Action button clicks
- Engagement metrics

## 🚀 Status
✅ **Implemented and Ready**
- Donor response system
- Dual notifications (requester + donor)
- Response tracking and summary
- Action buttons with different priorities
- Complete API endpoints

---
**Server Status**: Running on http://localhost:5000
**All endpoints active and tested** ✅