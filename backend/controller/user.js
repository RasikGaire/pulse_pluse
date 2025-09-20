const User = require("../model/User.js");
const auth = require("../auth.js");
const {errorHandler} = require("../auth.js");   

// [SECTION] Register User
module.exports.registerUser = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // Validation
        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Full name, email, and password are required'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Create new user
        const newUser = new User({
            fullName,
            email,
            password
        });

        // Save user to MongoDB
        await newUser.save();

        // Generate JWT token
        const token = auth.createAccessToken(newUser);

        // Return user data (password is automatically excluded by toJSON method)
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: newUser.toJSON(),
            token
        });

    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle MongoDB validation errors
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



// [User Authentication]
module.exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user in MongoDB
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Verify password using the model method
        const isValidPassword = await user.comparePassword(password);
        
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = auth.createAccessToken(user);

        // Return user data (password is automatically excluded by toJSON method)
        res.json({
            success: true,
            message: 'Login successful',
            user: user.toJSON(),
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        return errorHandler(error, req, res);
    }
};

// [SECTION] Get User Profile
module.exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Find user by ID and exclude password
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'Profile retrieved successfully',
            user: user.toJSON()
        });

    } catch (error) {
        console.error('Get profile error:', error);
        return errorHandler(error, req, res);
    }
};

// [SECTION] Update User Profile
module.exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { 
            fullName, 
            email, 
            phone, 
            address, 
            district,
            bloodType, 
            dateOfBirth,
            isDonor,
            description,
            socialMedia,
            availability,
            latitude,
            longitude
        } = req.body;

        // Find user by ID
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Validate email if it's being changed
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: 'Email is already in use'
                });
            }
        }

        // Update basic fields only if they are provided
        if (fullName !== undefined) user.fullName = fullName;
        if (email !== undefined) user.email = email;
        if (phone !== undefined) user.phone = phone;
        if (address !== undefined) user.address = address;
        if (district !== undefined) user.district = district;
        if (bloodType !== undefined) user.bloodType = bloodType;
        if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
        if (isDonor !== undefined) user.isDonor = isDonor;
        if (description !== undefined) user.description = description;

        // Update social media links if provided
        if (socialMedia && typeof socialMedia === 'object') {
            if (!user.socialMedia) user.socialMedia = {};
            Object.keys(socialMedia).forEach(platform => {
                if (socialMedia[platform] !== undefined) {
                    user.socialMedia[platform] = socialMedia[platform];
                }
            });
        }

        // Update availability if provided
        if (availability && typeof availability === 'object') {
            if (!user.availability) user.availability = {};
            if (availability.isAvailable !== undefined) user.availability.isAvailable = availability.isAvailable;
            if (availability.availableDate !== undefined) user.availability.availableDate = availability.availableDate;
            if (availability.notes !== undefined) user.availability.notes = availability.notes;
        }

        // Update location coordinates if provided
        if (latitude !== undefined && longitude !== undefined) {
            if (!user.location) user.location = { type: 'Point', coordinates: [0, 0] };
            user.location.coordinates = [parseFloat(longitude), parseFloat(latitude)];
        }

        // Save updated user
        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: user.toJSON()
        });

    } catch (error) {
        console.error('Update profile error:', error);
        
        // Handle MongoDB validation errors
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

// [SECTION] Change Password
module.exports.changePassword = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { currentPassword, newPassword } = req.body;

        // Validation
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters long'
            });
        }

        // Find user by ID
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify current password
        const isValidPassword = await user.comparePassword(currentPassword);
        
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password (will be hashed automatically by pre-save middleware)
        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Password changed successfully'
        });

    } catch (error) {
        console.error('Change password error:', error);
        return errorHandler(error, req, res);
    }
};

// [SECTION] Get All Donors
module.exports.getAllDonors = async (req, res) => {
    try {
        // Find all users who are donors and select only necessary fields
        const donors = await User.find({ 
            isDonor: true 
        }).select('fullName email phone bloodType address district dateOfBirth isDonor socialMedia availability location profilePicture description createdAt');

        // Transform the data to match the frontend expectations
        const formattedDonors = donors.map(donor => ({
            id: donor._id,
            name: donor.fullName,
            email: donor.email,
            contact: donor.phone || 'N/A',
            blood_type: donor.bloodType || 'N/A',
            location: donor.address && donor.district ? `${donor.address}, ${donor.district}` : donor.address || donor.district || 'Location not specified',
            last_donated: donor.availability?.availableDate ? new Date(donor.availability.availableDate).toLocaleDateString() : 'Not specified',
            profileImage: donor.profilePicture || '/profile.jpg',
            social: {
                facebook: donor.socialMedia?.facebook || '#',
                instagram: donor.socialMedia?.instagram || '#',
                whatsapp: donor.socialMedia?.whatsapp || '#'
            },
            communities: [
                { name: "Red Cross Society", joined: "Jan, 2025" },
                { name: "Blood Donation Club", joined: "Feb, 2024" }
            ],
            contributions: {
                bloodDonated: Math.floor(Math.random() * 10) + 1,
                volunteer: Math.floor(Math.random() * 50) + 5
            },
            description: donor.description || 'Dedicated blood donor committed to saving lives.',
            isAvailable: donor.availability?.isAvailable !== false
        }));

        res.json({
            success: true,
            message: 'Donors retrieved successfully',
            donors: formattedDonors,
            count: formattedDonors.length
        });

    } catch (error) {
        console.error('Get donors error:', error);
        return errorHandler(error, req, res);
    }
};

// [SECTION] Search Donors
module.exports.searchDonors = async (req, res) => {
    try {
        const { bloodType, district, isAvailable } = req.query;
        
        // Build search criteria
        let searchCriteria = { isDonor: true };
        
        if (bloodType && bloodType !== 'all') {
            searchCriteria.bloodType = bloodType;
        }
        
        if (district && district !== 'all') {
            searchCriteria.district = district;
        }
        
        if (isAvailable === 'true') {
            searchCriteria['availability.isAvailable'] = true;
        }

        // Find donors based on criteria
        const donors = await User.find(searchCriteria).select('fullName email phone bloodType address district dateOfBirth isDonor socialMedia availability location profilePicture description createdAt');

        // Transform the data
        const formattedDonors = donors.map(donor => ({
            id: donor._id,
            name: donor.fullName,
            email: donor.email,
            contact: donor.phone || 'N/A',
            blood_type: donor.bloodType || 'N/A',
            location: donor.address && donor.district ? `${donor.address}, ${donor.district}` : donor.address || donor.district || 'Location not specified',
            last_donated: donor.availability?.availableDate ? new Date(donor.availability.availableDate).toLocaleDateString() : 'Not specified',
            profileImage: donor.profilePicture || '/profile.jpg',
            social: {
                facebook: donor.socialMedia?.facebook || '#',
                instagram: donor.socialMedia?.instagram || '#',
                whatsapp: donor.socialMedia?.whatsapp || '#'
            },
            communities: [
                { name: "Red Cross Society", joined: "Jan, 2025" },
                { name: "Blood Donation Club", joined: "Feb, 2024" }
            ],
            contributions: {
                bloodDonated: Math.floor(Math.random() * 10) + 1,
                volunteer: Math.floor(Math.random() * 50) + 5
            },
            description: donor.description || 'Dedicated blood donor committed to saving lives.',
            isAvailable: donor.availability?.isAvailable !== false
        }));

        res.json({
            success: true,
            message: `Found ${formattedDonors.length} donors matching criteria`,
            donors: formattedDonors,
            count: formattedDonors.length,
            searchCriteria
        });

    } catch (error) {
        console.error('Search donors error:', error);
        return errorHandler(error, req, res);
    }
};