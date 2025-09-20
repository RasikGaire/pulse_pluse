const Hospital = require("../model/Hospital.js");
const {errorHandler} = require("../auth.js");

// [SECTION] Get All Hospitals
module.exports.getAllHospitals = async (req, res) => {
    try {
        const { page = 1, limit = 10, city, state, hasBloodBank, emergencyServices } = req.query;
        
        // Build filter object
        let filter = {};
        if (city) filter['address.city'] = new RegExp(city, 'i');
        if (state) filter['address.state'] = new RegExp(state, 'i');
        if (hasBloodBank) filter.hasBloodBank = hasBloodBank === 'true';
        if (emergencyServices) filter.emergencyServices = emergencyServices === 'true';

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Get hospitals with pagination
        const hospitals = await Hospital.find(filter)
            .sort({ name: 1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const total = await Hospital.countDocuments(filter);

        res.json({
            success: true,
            hospitals,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalHospitals: total,
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.error('Get hospitals error:', error);
        return errorHandler(error, req, res);
    }
};

// [SECTION] Get Hospital by ID
module.exports.getHospitalById = async (req, res) => {
    try {
        const { id } = req.params;

        const hospital = await Hospital.findById(id);

        if (!hospital) {
            return res.status(404).json({
                success: false,
                message: 'Hospital not found'
            });
        }

        res.json({
            success: true,
            hospital
        });

    } catch (error) {
        console.error('Get hospital error:', error);
        return errorHandler(error, req, res);
    }
};

// [SECTION] Search Hospitals by Location
module.exports.searchHospitalsByLocation = async (req, res) => {
    try {
        const { latitude, longitude, radius = 10, hasBloodBank, emergencyServices } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: 'Latitude and longitude are required'
            });
        }

        // Build filter object
        let filter = {
            location: {
                $geoWithin: {
                    $centerSphere: [
                        [parseFloat(longitude), parseFloat(latitude)],
                        radius / 6378.1 // Convert km to radians
                    ]
                }
            }
        };

        if (hasBloodBank) filter.hasBloodBank = hasBloodBank === 'true';
        if (emergencyServices) filter.emergencyServices = emergencyServices === 'true';

        const hospitals = await Hospital.find(filter)
            .sort({ name: 1 });

        // Calculate distance for each hospital
        const hospitalsWithDistance = hospitals.map(hospital => {
            const distance = calculateDistance(
                parseFloat(latitude),
                parseFloat(longitude),
                hospital.location.coordinates[1],
                hospital.location.coordinates[0]
            );

            return {
                ...hospital.toObject(),
                distance: Math.round(distance * 100) / 100 // Round to 2 decimal places
            };
        });

        // Sort by distance
        hospitalsWithDistance.sort((a, b) => a.distance - b.distance);

        res.json({
            success: true,
            hospitals: hospitalsWithDistance,
            searchRadius: radius,
            totalFound: hospitalsWithDistance.length
        });

    } catch (error) {
        console.error('Search hospitals by location error:', error);
        return errorHandler(error, req, res);
    }
};

// [SECTION] Create Hospital (Admin only)
module.exports.createHospital = async (req, res) => {
    try {
        const {
            name,
            address,
            phone,
            email,
            website,
            hasBloodBank,
            emergencyServices,
            specialties,
            operatingHours,
            latitude,
            longitude
        } = req.body;

        // Validation
        if (!name || !address || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Name, address, and phone are required'
            });
        }

        // Check if hospital already exists
        const existingHospital = await Hospital.findOne({
            $or: [
                { name: name },
                { phone: phone },
                { email: email }
            ]
        });

        if (existingHospital) {
            return res.status(400).json({
                success: false,
                message: 'Hospital with this name, phone, or email already exists'
            });
        }

        // Create new hospital
        const newHospital = new Hospital({
            name,
            address,
            phone,
            email,
            website,
            hasBloodBank: hasBloodBank || false,
            emergencyServices: emergencyServices || false,
            specialties: specialties || [],
            operatingHours: operatingHours || {},
            location: {
                type: 'Point',
                coordinates: [parseFloat(longitude) || 0, parseFloat(latitude) || 0]
            }
        });

        await newHospital.save();

        res.status(201).json({
            success: true,
            message: 'Hospital created successfully',
            hospital: newHospital
        });

    } catch (error) {
        console.error('Create hospital error:', error);
        
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

// [SECTION] Update Hospital (Admin only)
module.exports.updateHospital = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Remove sensitive fields that shouldn't be updated directly
        delete updates._id;
        delete updates.__v;

        // If location coordinates are provided, update location object
        if (updates.latitude && updates.longitude) {
            updates.location = {
                type: 'Point',
                coordinates: [parseFloat(updates.longitude), parseFloat(updates.latitude)]
            };
            delete updates.latitude;
            delete updates.longitude;
        }

        const hospital = await Hospital.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!hospital) {
            return res.status(404).json({
                success: false,
                message: 'Hospital not found'
            });
        }

        res.json({
            success: true,
            message: 'Hospital updated successfully',
            hospital
        });

    } catch (error) {
        console.error('Update hospital error:', error);
        
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

// [SECTION] Delete Hospital (Admin only)
module.exports.deleteHospital = async (req, res) => {
    try {
        const { id } = req.params;

        const hospital = await Hospital.findByIdAndDelete(id);

        if (!hospital) {
            return res.status(404).json({
                success: false,
                message: 'Hospital not found'
            });
        }

        res.json({
            success: true,
            message: 'Hospital deleted successfully'
        });

    } catch (error) {
        console.error('Delete hospital error:', error);
        return errorHandler(error, req, res);
    }
};

// [SECTION] Get Hospital Statistics (Admin only)
module.exports.getHospitalStatistics = async (req, res) => {
    try {
        const totalHospitals = await Hospital.countDocuments({});
        const hospitalsByBloodBank = await Hospital.countDocuments({ hasBloodBank: true });
        const hospitalsByEmergency = await Hospital.countDocuments({ emergencyServices: true });

        // Group by state
        const hospitalsByState = await Hospital.aggregate([
            {
                $group: {
                    _id: '$address.state',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Group by city
        const hospitalsByCity = await Hospital.aggregate([
            {
                $group: {
                    _id: '$address.city',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 } // Top 10 cities
        ]);

        res.json({
            success: true,
            statistics: {
                total: totalHospitals,
                withBloodBank: hospitalsByBloodBank,
                withEmergencyServices: hospitalsByEmergency,
                byState: hospitalsByState,
                topCities: hospitalsByCity
            }
        });

    } catch (error) {
        console.error('Get hospital statistics error:', error);
        return errorHandler(error, req, res);
    }
};

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