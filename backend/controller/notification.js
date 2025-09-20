const Notification = require("../model/Notification.js");
const User = require("../model/User.js");
const {errorHandler} = require("../auth.js");

// [SECTION] Get User Notifications
module.exports.getUserNotifications = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { page = 1, limit = 20, type, status, isRead } = req.query;

        // Build filter object
        let filter = { 
            recipient: userId,
            expiresAt: { $gt: new Date() } // Only non-expired notifications
        };
        
        if (type) filter.type = type;
        if (status) filter.status = status;
        if (isRead !== undefined) filter.isRead = isRead === 'true';

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Get notifications with pagination
        const notifications = await Notification.find(filter)
            .populate('relatedRequest', 'bloodType urgencyLevel requester hospital')
            .populate('relatedUser', 'fullName')
            .populate('relatedBloodBank', 'name address')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const total = await Notification.countDocuments(filter);
        const unreadCount = await Notification.getUnreadCount(userId);

        res.json({
            success: true,
            notifications,
            unreadCount,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalNotifications: total,
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.error('Get notifications error:', error);
        return errorHandler(error, req, res);
    }
};

// [SECTION] Mark Notification as Read
module.exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const notification = await Notification.findOne({
            _id: id,
            recipient: userId
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        await notification.markAsRead();

        res.json({
            success: true,
            message: 'Notification marked as read'
        });

    } catch (error) {
        console.error('Mark notification as read error:', error);
        return errorHandler(error, req, res);
    }
};

// [SECTION] Mark All Notifications as Read
module.exports.markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.userId;

        await Notification.updateMany(
            { 
                recipient: userId, 
                isRead: false,
                expiresAt: { $gt: new Date() }
            },
            { 
                $set: { 
                    isRead: true, 
                    readAt: new Date(),
                    status: 'Read'
                }
            }
        );

        res.json({
            success: true,
            message: 'All notifications marked as read'
        });

    } catch (error) {
        console.error('Mark all notifications as read error:', error);
        return errorHandler(error, req, res);
    }
};

// [SECTION] Dismiss Notification
module.exports.dismissNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const notification = await Notification.findOne({
            _id: id,
            recipient: userId
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        await notification.dismiss();

        res.json({
            success: true,
            message: 'Notification dismissed'
        });

    } catch (error) {
        console.error('Dismiss notification error:', error);
        return errorHandler(error, req, res);
    }
};

// [SECTION] Click Notification (track engagement)
module.exports.clickNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const notification = await Notification.findOne({
            _id: id,
            recipient: userId
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        await notification.markAsClicked();

        res.json({
            success: true,
            message: 'Notification clicked',
            notification
        });

    } catch (error) {
        console.error('Click notification error:', error);
        return errorHandler(error, req, res);
    }
};

// [SECTION] Get Notification Statistics
module.exports.getNotificationStats = async (req, res) => {
    try {
        const userId = req.user.userId;

        const stats = await Notification.aggregate([
            {
                $match: { 
                    recipient: userId,
                    expiresAt: { $gt: new Date() }
                }
            },
            {
                $group: {
                    _id: '$type',
                    total: { $sum: 1 },
                    unread: { 
                        $sum: { 
                            $cond: [{ $eq: ['$isRead', false] }, 1, 0] 
                        }
                    },
                    high_priority: {
                        $sum: {
                            $cond: [{ $in: ['$priority', ['High', 'Critical']] }, 1, 0]
                        }
                    }
                }
            }
        ]);

        const totalUnread = await Notification.getUnreadCount(userId);

        res.json({
            success: true,
            stats: {
                byType: stats,
                totalUnread
            }
        });

    } catch (error) {
        console.error('Get notification statistics error:', error);
        return errorHandler(error, req, res);
    }
};

// [SECTION] Send Notification to Nearby Donors
module.exports.notifyNearbyDonors = async (bloodRequest) => {
    try {
        // Get compatible blood types for the request
        const compatibleBloodTypes = getCompatibleBloodTypes(bloodRequest.bloodType);
        
        // Search radius in kilometers (configurable)
        const searchRadius = bloodRequest.urgencyLevel === 'Critical' ? 50 : 25;

        // Find nearby donors who can donate
        const nearbyDonors = await User.find({
            isDonor: true,
            bloodType: { $in: compatibleBloodTypes },
            'availability.isAvailable': true,
            // Add location filter if coordinates are available
            ...(bloodRequest.location && bloodRequest.location.coordinates && {
                location: {
                    $geoWithin: {
                        $centerSphere: [
                            bloodRequest.location.coordinates,
                            searchRadius / 6378.1 // Convert km to radians
                        ]
                    }
                }
            })
        });

        console.log(`Found ${nearbyDonors.length} potential donors for blood type ${bloodRequest.bloodType}`);

        // Create notifications for each donor
        const notifications = [];
        for (const donor of nearbyDonors) {
            // Calculate distance if location is available
            let distance = 0;
            if (bloodRequest.location && bloodRequest.location.coordinates && 
                donor.location && donor.location.coordinates) {
                distance = calculateDistance(
                    bloodRequest.location.coordinates[1], // latitude
                    bloodRequest.location.coordinates[0], // longitude
                    donor.location.coordinates[1],
                    donor.location.coordinates[0]
                );
            }

            const notification = Notification.createBloodRequestNotification(
                donor, 
                bloodRequest, 
                Math.round(distance)
            );
            
            notifications.push(notification);
        }

        // Save all notifications
        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
            console.log(`Sent ${notifications.length} notifications to nearby donors`);
        }

        return {
            success: true,
            notificationsSent: notifications.length,
            donorsFound: nearbyDonors.length
        };

    } catch (error) {
        console.error('Error notifying nearby donors:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Helper function to get compatible blood types
function getCompatibleBloodTypes(requestedBloodType) {
    const compatibility = {
        'A+': ['A+', 'A-', 'O+', 'O-'],
        'A-': ['A-', 'O-'],
        'B+': ['B+', 'B-', 'O+', 'O-'],
        'B-': ['B-', 'O-'],
        'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        'AB-': ['A-', 'B-', 'AB-', 'O-'],
        'O+': ['O+', 'O-'],
        'O-': ['O-']
    };

    return compatibility[requestedBloodType] || [];
}

// Helper function to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in kilometers
    return d;
}