const BloodRequest = require("../model/BloodRequest.js");
const User = require("../model/User.js");
const Notification = require("../model/Notification.js");
const {errorHandler} = require("../auth.js");
const {notifyNearbyDonors} = require("./notification.js");

// [SECTION] Create Blood Request
module.exports.createBloodRequest = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { 
            bloodGroup, 
            bloodUnits, 
            appointmentDate, 
            phoneNumber, 
            district, 
            hospitalName, 
            description,
            urgencyLevel,
            isEmergency,
            latitude,
            longitude
        } = req.body;

        // Validation
        if (!bloodGroup || !bloodUnits || !appointmentDate || !phoneNumber || !district || !hospitalName || !description) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be provided'
            });
        }

        // Check if appointment date is in the future
        const appointmentDateTime = new Date(appointmentDate);
        if (appointmentDateTime <= new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Appointment date must be in the future'
            });
        }

        // Create new blood request
        const newBloodRequest = new BloodRequest({
            requester: userId,
            bloodGroup,
            bloodType: bloodGroup, // For compatibility with notification system
            bloodUnits,
            appointmentDate: appointmentDateTime,
            phoneNumber,
            district,
            hospitalName,
            description,
            urgencyLevel: urgencyLevel || 'Medium',
            isEmergency: isEmergency || false,
            // Add location if provided
            ...(latitude && longitude && {
                location: {
                    type: 'Point',
                    coordinates: [parseFloat(longitude), parseFloat(latitude)]
                }
            })
        });

        // Save blood request to MongoDB
        await newBloodRequest.save();

        // Populate requester details
        await newBloodRequest.populate('requester', 'fullName email phone');

        // Notify nearby donors asynchronously (don't block the response)
        setImmediate(async () => {
            try {
                const notificationResult = await notifyNearbyDonors(newBloodRequest);
                console.log('Donor notification result:', notificationResult);
            } catch (error) {
                console.error('Error sending donor notifications:', error);
            }
        });

        res.status(201).json({
            success: true,
            message: 'Blood request created successfully. Nearby donors will be notified.',
            bloodRequest: newBloodRequest
        });

    } catch (error) {
        console.error('Create blood request error:', error);
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors
            });
        }
        
        return errorHandler(error, req, res);
    }
};

// [SECTION] Get All Blood Requests (for admin or public view)
module.exports.getAllBloodRequests = async (req, res) => {
    try {
        const { page = 1, limit = 10, bloodGroup, district, status, urgencyLevel } = req.query;
        
        // Build filter object
        let filter = {};
        if (bloodGroup) filter.bloodGroup = bloodGroup;
        if (district) filter.district = new RegExp(district, 'i');
        if (status) filter.status = status;
        if (urgencyLevel) filter.urgencyLevel = urgencyLevel;

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Get blood requests with pagination
        const bloodRequests = await BloodRequest.find(filter)
            .populate('requester', 'fullName email phone')
            .sort({ createdAt: -1, urgencyLevel: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const total = await BloodRequest.countDocuments(filter);

        res.json({
            success: true,
            bloodRequests,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalRequests: total,
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.error('Get blood requests error:', error);
        return errorHandler(error, req, res);
    }
};

// [SECTION] Get User's Blood Requests
module.exports.getUserBloodRequests = async (req, res) => {
    try {
        const userId = req.user.userId;

        const bloodRequests = await BloodRequest.find({ requester: userId })
            .populate('requester', 'fullName email phone')
            .populate('matchedDonors.donor', 'fullName email phone bloodType')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            bloodRequests
        });

    } catch (error) {
        console.error('Get user blood requests error:', error);
        return errorHandler(error, req, res);
    }
};

// [SECTION] Get Blood Request by ID
module.exports.getBloodRequestById = async (req, res) => {
    try {
        const { id } = req.params;

        const bloodRequest = await BloodRequest.findById(id)
            .populate('requester', 'fullName email phone')
            .populate('matchedDonors.donor', 'fullName email phone bloodType socialMedia')
            .populate('fulfilledBy', 'fullName email phone');

        if (!bloodRequest) {
            return res.status(404).json({
                success: false,
                message: 'Blood request not found'
            });
        }

        res.json({
            success: true,
            bloodRequest
        });

    } catch (error) {
        console.error('Get blood request error:', error);
        return errorHandler(error, req, res);
    }
};

// [SECTION] Update Blood Request Status
module.exports.updateBloodRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;
        const userId = req.user.userId;

        const bloodRequest = await BloodRequest.findById(id);

        if (!bloodRequest) {
            return res.status(404).json({
                success: false,
                message: 'Blood request not found'
            });
        }

        // Check if user is the requester or admin
        if (bloodRequest.requester.toString() !== userId && !req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this request'
            });
        }

        // Update status
        bloodRequest.status = status;
        if (notes) bloodRequest.notes = notes;
        
        if (status === 'Fulfilled') {
            bloodRequest.fulfilledBy = userId;
            bloodRequest.fulfilledAt = new Date();
        }

        await bloodRequest.save();

        res.json({
            success: true,
            message: 'Blood request status updated successfully',
            bloodRequest
        });

    } catch (error) {
        console.error('Update blood request status error:', error);
        return errorHandler(error, req, res);
    }
};

// [SECTION] Search Compatible Donors
module.exports.searchCompatibleDonors = async (req, res) => {
    try {
        const { bloodGroup, district } = req.query;

        if (!bloodGroup) {
            return res.status(400).json({
                success: false,
                message: 'Blood group is required'
            });
        }

        // Blood compatibility mapping
        const compatibilityMap = {
            'A+': ['A+', 'A-', 'O+', 'O-'],
            'A-': ['A-', 'O-'],
            'B+': ['B+', 'B-', 'O+', 'O-'],
            'B-': ['B-', 'O-'],
            'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
            'AB-': ['A-', 'B-', 'AB-', 'O-'],
            'O+': ['O+', 'O-'],
            'O-': ['O-']
        };

        const compatibleBloodTypes = compatibilityMap[bloodGroup] || [bloodGroup];

        // Build query
        let query = {
            bloodType: { $in: compatibleBloodTypes },
            isDonor: true,
            isVerified: true,
            'availability.isAvailable': true
        };

        if (district) {
            query.district = new RegExp(district, 'i');
        }

        const compatibleDonors = await User.find(query)
            .select('fullName email phone bloodType district socialMedia donationStats availability')
            .sort({ 'donationStats.totalDonations': -1 });

        res.json({
            success: true,
            compatibleDonors,
            bloodGroup,
            totalFound: compatibleDonors.length
        });

    } catch (error) {
        console.error('Search compatible donors error:', error);
        return errorHandler(error, req, res);
    }
};

// [SECTION] Donor Response to Blood Request
module.exports.respondToBloodRequest = async (req, res) => {
    try {
        const { id } = req.params; // Blood request ID
        const donorId = req.user.userId;
        const { responseType, message } = req.body; // 'interested', 'confirmed', 'declined'

        // Validation
        if (!responseType || !['interested', 'confirmed', 'declined'].includes(responseType)) {
            return res.status(400).json({
                success: false,
                message: 'Valid response type is required (interested, confirmed, declined)'
            });
        }

        // Find the blood request
        const bloodRequest = await BloodRequest.findById(id)
            .populate('requester', 'fullName email phone');

        if (!bloodRequest) {
            return res.status(404).json({
                success: false,
                message: 'Blood request not found'
            });
        }

        // Find the donor
        const donor = await User.findById(donorId);
        if (!donor) {
            return res.status(404).json({
                success: false,
                message: 'Donor not found'
            });
        }

        // Check if donor already responded
        const existingResponse = bloodRequest.matchedDonors.find(
            match => match.donor.toString() === donorId
        );

        let notificationTitle, notificationMessage, notificationPriority;

        if (existingResponse) {
            // Update existing response
            existingResponse.status = responseType === 'interested' ? 'Contacted' : 
                                    responseType === 'confirmed' ? 'Confirmed' : 'Declined';
            existingResponse.contactedAt = new Date();
        } else {
            // Add new response
            bloodRequest.matchedDonors.push({
                donor: donorId,
                status: responseType === 'interested' ? 'Contacted' : 
                       responseType === 'confirmed' ? 'Confirmed' : 'Declined',
                contactedAt: new Date()
            });
        }

        // Create different notifications based on response type
        switch (responseType) {
            case 'interested':
                notificationTitle = `🩸 Donor Interested in Your Request`;
                notificationMessage = `${donor.fullName} is interested in donating ${bloodRequest.bloodGroup} blood for your request at ${bloodRequest.hospitalName}.`;
                notificationPriority = 'High';
                break;
            case 'confirmed':
                notificationTitle = `✅ Donor Confirmed for Your Request`;
                notificationMessage = `Great news! ${donor.fullName} has confirmed to donate ${bloodRequest.bloodGroup} blood for your request at ${bloodRequest.hospitalName}.`;
                notificationPriority = 'Critical';
                break;
            case 'declined':
                notificationTitle = `❌ Donor Declined Your Request`;
                notificationMessage = `${donor.fullName} is unable to donate for your ${bloodRequest.bloodGroup} blood request at this time.`;
                notificationPriority = 'Medium';
                break;
        }

        // Save the updated blood request
        await bloodRequest.save();

        // Create notification for the blood request creator
        const notification = new Notification({
            recipient: bloodRequest.requester._id,
            type: 'BloodRequest',
            title: notificationTitle,
            message: notificationMessage + (message ? ` Message: "${message}"` : ''),
            priority: notificationPriority,
            relatedRequest: bloodRequest._id,
            relatedUser: donorId,
            bloodTypeNeeded: bloodRequest.bloodGroup,
            urgencyLevel: bloodRequest.urgencyLevel,
            actionButtons: responseType === 'confirmed' ? [
                {
                    label: 'Contact Donor',
                    action: 'contact',
                    url: `/donors/${donorId}/contact`,
                    style: 'primary'
                },
                {
                    label: 'View Request',
                    action: 'view',
                    url: `/blood-requests/${bloodRequest._id}`,
                    style: 'secondary'
                }
            ] : [
                {
                    label: 'View Request',
                    action: 'view',
                    url: `/blood-requests/${bloodRequest._id}`,
                    style: 'primary'
                }
            ],
            channels: {
                inApp: { enabled: true },
                push: { enabled: true },
                email: { enabled: true }
            }
        });

        await notification.save();

        // Also create a notification for the donor confirming their response
        const donorNotification = new Notification({
            recipient: donorId,
            type: 'BloodRequest',
            title: `Response Recorded: ${responseType.charAt(0).toUpperCase() + responseType.slice(1)}`,
            message: `Your response to the ${bloodRequest.bloodGroup} blood request at ${bloodRequest.hospitalName} has been recorded.`,
            priority: 'Medium',
            relatedRequest: bloodRequest._id,
            relatedUser: bloodRequest.requester._id,
            bloodTypeNeeded: bloodRequest.bloodGroup,
            actionButtons: [
                {
                    label: 'View Request',
                    action: 'view',
                    url: `/blood-requests/${bloodRequest._id}`,
                    style: 'primary'
                }
            ]
        });

        await donorNotification.save();

        res.json({
            success: true,
            message: `Response recorded successfully. The requester has been notified.`,
            response: {
                type: responseType,
                bloodRequest: {
                    id: bloodRequest._id,
                    bloodGroup: bloodRequest.bloodGroup,
                    hospitalName: bloodRequest.hospitalName
                },
                donor: {
                    id: donor._id,
                    name: donor.fullName
                },
                notificationSent: true
            }
        });

    } catch (error) {
        console.error('Respond to blood request error:', error);
        return errorHandler(error, req, res);
    }
};

// [SECTION] Get Blood Request Responses (for request creator)
module.exports.getBloodRequestResponses = async (req, res) => {
    try {
        const { id } = req.params; // Blood request ID
        const userId = req.user.userId;

        // Find the blood request and verify ownership
        const bloodRequest = await BloodRequest.findById(id)
            .populate({
                path: 'matchedDonors.donor',
                select: 'fullName email phone bloodType socialMedia donationStats'
            });

        if (!bloodRequest) {
            return res.status(404).json({
                success: false,
                message: 'Blood request not found'
            });
        }

        // Check if user owns this blood request
        if (bloodRequest.requester.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You can only view responses to your own blood requests'
            });
        }

        res.json({
            success: true,
            bloodRequest: {
                id: bloodRequest._id,
                bloodGroup: bloodRequest.bloodGroup,
                hospitalName: bloodRequest.hospitalName,
                status: bloodRequest.status,
                createdAt: bloodRequest.createdAt
            },
            responses: bloodRequest.matchedDonors,
            summary: {
                total: bloodRequest.matchedDonors.length,
                confirmed: bloodRequest.matchedDonors.filter(r => r.status === 'Confirmed').length,
                interested: bloodRequest.matchedDonors.filter(r => r.status === 'Contacted').length,
                declined: bloodRequest.matchedDonors.filter(r => r.status === 'Declined').length
            }
        });

    } catch (error) {
        console.error('Get blood request responses error:', error);
        return errorHandler(error, req, res);
    }
};