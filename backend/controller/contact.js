const ContactMessage = require("../model/ContactMessage.js");
const {errorHandler} = require("../auth.js");

// [SECTION] Create Contact Message
module.exports.createContactMessage = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, message, subject } = req.body;

        // Validation
        if (!firstName || !lastName || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'First name, last name, email, and message are required'
            });
        }

        // Create new contact message
        const newContactMessage = new ContactMessage({
            firstName,
            lastName,
            email,
            phone,
            message,
            subject: subject || 'General Inquiry'
        });

        // Save contact message to MongoDB
        await newContactMessage.save();

        res.status(201).json({
            success: true,
            message: 'Thank you for contacting us! We will get back to you soon.',
            contactMessage: {
                id: newContactMessage._id,
                firstName: newContactMessage.firstName,
                lastName: newContactMessage.lastName,
                email: newContactMessage.email,
                createdAt: newContactMessage.createdAt
            }
        });

    } catch (error) {
        console.error('Create contact message error:', error);
        
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

// [SECTION] Get All Contact Messages (Admin only)
module.exports.getAllContactMessages = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, priority } = req.query;
        
        // Build filter object
        let filter = {};
        if (status) filter.status = status;
        if (priority) filter.priority = priority;

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Get contact messages with pagination
        const contactMessages = await ContactMessage.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const total = await ContactMessage.countDocuments(filter);

        res.json({
            success: true,
            contactMessages,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalMessages: total,
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.error('Get contact messages error:', error);
        return errorHandler(error, req, res);
    }
};

// [SECTION] Get Contact Message by ID (Admin only)
module.exports.getContactMessageById = async (req, res) => {
    try {
        const { id } = req.params;

        const contactMessage = await ContactMessage.findById(id)
            .populate('repliedBy', 'fullName email');

        if (!contactMessage) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            });
        }

        // Mark as read if it's new
        if (contactMessage.status === 'New') {
            contactMessage.status = 'Read';
            await contactMessage.save();
        }

        res.json({
            success: true,
            contactMessage
        });

    } catch (error) {
        console.error('Get contact message error:', error);
        return errorHandler(error, req, res);
    }
};

// [SECTION] Update Contact Message Status (Admin only)
module.exports.updateContactMessageStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, priority, adminNotes } = req.body;
        const adminId = req.user.userId;

        const contactMessage = await ContactMessage.findById(id);

        if (!contactMessage) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            });
        }

        // Update fields
        if (status) contactMessage.status = status;
        if (priority) contactMessage.priority = priority;
        if (adminNotes) contactMessage.adminNotes = adminNotes;

        if (status === 'Replied') {
            contactMessage.repliedAt = new Date();
            contactMessage.repliedBy = adminId;
        }

        await contactMessage.save();

        res.json({
            success: true,
            message: 'Contact message updated successfully',
            contactMessage
        });

    } catch (error) {
        console.error('Update contact message error:', error);
        return errorHandler(error, req, res);
    }
};

// [SECTION] Get Contact Statistics (Admin only)
module.exports.getContactStatistics = async (req, res) => {
    try {
        const statistics = await ContactMessage.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const priorityStats = await ContactMessage.aggregate([
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get total messages this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const thisMonthCount = await ContactMessage.countDocuments({
            createdAt: { $gte: startOfMonth }
        });

        res.json({
            success: true,
            statistics: {
                byStatus: statistics,
                byPriority: priorityStats,
                thisMonth: thisMonthCount,
                total: await ContactMessage.countDocuments({})
            }
        });

    } catch (error) {
        console.error('Get contact statistics error:', error);
        return errorHandler(error, req, res);
    }
};