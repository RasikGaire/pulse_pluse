const BloodBank = require("../model/BloodBank.js");
const {errorHandler} = require("../auth.js");

// [SECTION] Get All Blood Banks
module.exports.getAllBloodBanks = async (req, res) => {
    try {
        const { page = 1, limit = 10, district, bloodGroup } = req.query;
        
        // Build filter object
        let filter = { isActive: true };
        if (district) filter.district = new RegExp(district, 'i');

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Get blood banks with pagination
        let bloodBanks = await BloodBank.find(filter)
            .sort({ name: 1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Filter by blood group availability if specified
        if (bloodGroup) {
            bloodBanks = bloodBanks.filter(bank => 
                bank.bloodInventory[bloodGroup] && bank.bloodInventory[bloodGroup] > 0
            );
        }

        // Get total count for pagination
        const total = await BloodBank.countDocuments(filter);

        res.json({
            success: true,
            bloodBanks,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalBanks: total,
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.error('Get blood banks error:', error);
        return errorHandler(error, req, res);
    }
};

// [SECTION] Get Blood Bank by ID
module.exports.getBloodBankById = async (req, res) => {
    try {
        const { id } = req.params;

        const bloodBank = await BloodBank.findById(id);

        if (!bloodBank) {
            return res.status(404).json({
                success: false,
                message: 'Blood bank not found'
            });
        }

        res.json({
            success: true,
            bloodBank
        });

    } catch (error) {
        console.error('Get blood bank error:', error);
        return errorHandler(error, req, res);
    }
};

// [SECTION] Create Blood Bank (Admin only)
module.exports.createBloodBank = async (req, res) => {
    try {
        const {
            name,
            address,
            district,
            contact,
            operatingHours,
            bloodInventory,
            location,
            facilities
        } = req.body;

        // Validation
        if (!name || !address || !district || !contact?.phone) {
            return res.status(400).json({
                success: false,
                message: 'Name, address, district, and phone are required'
            });
        }

        // Create new blood bank
        const newBloodBank = new BloodBank({
            name,
            address,
            district,
            contact,
            operatingHours,
            bloodInventory,
            location,
            facilities
        });

        // Save blood bank to MongoDB
        await newBloodBank.save();

        res.status(201).json({
            success: true,
            message: 'Blood bank created successfully',
            bloodBank: newBloodBank
        });

    } catch (error) {
        console.error('Create blood bank error:', error);
        
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

// [SECTION] Update Blood Bank Inventory
module.exports.updateBloodInventory = async (req, res) => {
    try {
        const { id } = req.params;
        const { bloodInventory } = req.body;

        const bloodBank = await BloodBank.findById(id);

        if (!bloodBank) {
            return res.status(404).json({
                success: false,
                message: 'Blood bank not found'
            });
        }

        // Update inventory
        if (bloodInventory) {
            Object.keys(bloodInventory).forEach(bloodType => {
                if (bloodBank.bloodInventory.hasOwnProperty(bloodType)) {
                    bloodBank.bloodInventory[bloodType] = bloodInventory[bloodType];
                }
            });
        }

        bloodBank.lastInventoryUpdate = new Date();
        await bloodBank.save();

        res.json({
            success: true,
            message: 'Blood inventory updated successfully',
            bloodBank
        });

    } catch (error) {
        console.error('Update blood inventory error:', error);
        return errorHandler(error, req, res);
    }
};

// [SECTION] Search Blood Banks by Blood Type
module.exports.searchBloodBanksByType = async (req, res) => {
    try {
        const { bloodGroup, district, minUnits = 1 } = req.query;

        if (!bloodGroup) {
            return res.status(400).json({
                success: false,
                message: 'Blood group is required'
            });
        }

        // Build query
        let query = {
            isActive: true,
            [`bloodInventory.${bloodGroup}`]: { $gte: parseInt(minUnits) }
        };

        if (district) {
            query.district = new RegExp(district, 'i');
        }

        const bloodBanks = await BloodBank.find(query)
            .sort({ [`bloodInventory.${bloodGroup}`]: -1 });

        res.json({
            success: true,
            bloodBanks,
            bloodGroup,
            totalFound: bloodBanks.length
        });

    } catch (error) {
        console.error('Search blood banks error:', error);
        return errorHandler(error, req, res);
    }
};

// [SECTION] Get Blood Availability Summary
module.exports.getBloodAvailabilitySummary = async (req, res) => {
    try {
        const { district } = req.query;

        let matchQuery = { isActive: true };
        if (district) {
            matchQuery.district = new RegExp(district, 'i');
        }

        const summary = await BloodBank.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: null,
                    totalBanks: { $sum: 1 },
                    'A+': { $sum: '$bloodInventory.A+' },
                    'A-': { $sum: '$bloodInventory.A-' },
                    'B+': { $sum: '$bloodInventory.B+' },
                    'B-': { $sum: '$bloodInventory.B-' },
                    'AB+': { $sum: '$bloodInventory.AB+' },
                    'AB-': { $sum: '$bloodInventory.AB-' },
                    'O+': { $sum: '$bloodInventory.O+' },
                    'O-': { $sum: '$bloodInventory.O-' }
                }
            }
        ]);

        res.json({
            success: true,
            summary: summary[0] || {
                totalBanks: 0,
                'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0,
                'AB+': 0, 'AB-': 0, 'O+': 0, 'O-': 0
            }
        });

    } catch (error) {
        console.error('Get blood availability summary error:', error);
        return errorHandler(error, req, res);
    }
};