import React, { useState, useEffect } from 'react';
import { FaCamera, FaPhone, FaEnvelope, FaTint, FaMapMarkerAlt, FaFileAlt, FaLink, FaFacebookF, FaInstagram, FaTwitter, FaLinkedin, FaYoutube, FaSpinner, FaSave, FaArrowLeft, FaPlus, FaTrash, FaWhatsapp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProfileVerification = () => {
    const navigate = useNavigate();
    const { user, updateProfile, isAuthenticated, loading: authLoading } = useAuth();
    
    // State variables for form fields
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        bloodType: '',
        address: '',
        district: '',
        dateOfBirth: '',
        isDonor: false,
        description: '',
        socialMedia: {
            facebook: '',
            instagram: '',
            twitter: '',
            linkedin: '',
            youtube: '',
            whatsapp: ''
        },
        availability: {
            isAvailable: true,
            notes: ''
        }
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Profile picture state
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState('');
    
    // New community form
    const [newCommunity, setNewCommunity] = useState({ name: '', role: 'Member' });
    const [communities, setCommunities] = useState([]);

    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated()) {
                navigate('/login');
                return;
            }
            
            // Pre-fill form with existing user data
            if (user) {
                setFormData({
                    fullName: user.fullName || '',
                    phone: user.phone || '',
                    email: user.email || '',
                    bloodType: user.bloodType || '',
                    address: user.address || '',
                    district: user.district || '',
                    dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
                    isDonor: user.isDonor || false,
                    description: user.description || '',
                    socialMedia: {
                        facebook: user.socialMedia?.facebook || '',
                        instagram: user.socialMedia?.instagram || '',
                        twitter: user.socialMedia?.twitter || '',
                        linkedin: user.socialMedia?.linkedin || '',
                        youtube: user.socialMedia?.youtube || '',
                        whatsapp: user.socialMedia?.whatsapp || ''
                    },
                    availability: {
                        isAvailable: user.availability?.isAvailable ?? true,
                        notes: user.availability?.notes || ''
                    }
                });
                setCommunities(user.communities || []);
                
                // Set profile picture preview if exists
                if (user.profilePicture) {
                    setProfilePicturePreview(user.profilePicture);
                }
            }
        }
    }, [user, authLoading, isAuthenticated, navigate]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleAddCommunity = () => {
        if (newCommunity.name.trim()) {
            setCommunities(prev => [...prev, { 
                ...newCommunity, 
                joinedDate: new Date().toISOString() 
            }]);
            setNewCommunity({ name: '', role: 'Member' });
        }
    };

    const handleRemoveCommunity = (index) => {
        setCommunities(prev => prev.filter((_, i) => i !== index));
    };

    // Handle profile picture upload
    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError('Please select a valid image file');
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size should be less than 5MB');
                return;
            }
            
            setProfilePicture(file);
            
            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfilePicturePreview(e.target.result);
            };
            reader.readAsDataURL(file);
            
            // Clear any previous errors
            setError('');
        }
    };

    // Remove profile picture
    const removeProfilePicture = () => {
        setProfilePicture(null);
        setProfilePicturePreview('');
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Basic validation
        if (!formData.fullName.trim()) {
            setError('Full name is required');
            return;
        }
        if (!formData.phone.trim()) {
            setError('Phone number is required');
            return;
        }
        if (!formData.email.trim()) {
            setError('Email is required');
            return;
        }
        if (!formData.bloodType) {
            setError('Blood type is required');
            return;
        }

        setLoading(true);

        try {
            // Prepare data for submission
            const submitData = {
                ...formData,
                communities
            };

            // If profile picture is selected, convert to base64
            if (profilePicture) {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    submitData.profilePicture = e.target.result;
                    
                    const result = await updateProfile(submitData);
                    
                    if (result.success) {
                        setSuccess('Profile updated successfully! Redirecting to profile...');
                        setTimeout(() => {
                            navigate('/profile');
                        }, 2000);
                    } else {
                        setError(result.error || 'Failed to update profile');
                    }
                    setLoading(false);
                };
                reader.readAsDataURL(profilePicture);
            } else {
                // No new profile picture, proceed normally
                const result = await updateProfile(submitData);
                
                if (result.success) {
                    setSuccess('Profile updated successfully! Redirecting to profile...');
                    setTimeout(() => {
                        navigate('/profile');
                    }, 2000);
                } else {
                    setError(result.error || 'Failed to update profile');
                }
                setLoading(false);
            }
        } catch {
            setError('Failed to update profile. Please try again.');
            setLoading(false);
        }
    };

    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-64 p-6">
                <FaSpinner className="animate-spin text-4xl text-[#46052D]" />
                <span className="ml-3 text-lg">Loading...</span>
            </div>
        );
    }

    return (
        <div className="font-sans antialiased text-gray-800 bg-gray-50 min-h-screen">
            <div className="flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 md:p-10">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => navigate('/profile')}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                        >
                            <FaArrowLeft />
                            Back to Profile
                        </button>
                        <h1 className="text-2xl font-bold">Edit Profile</h1>
                    </div>

                    {/* Success Message */}
                    {success && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-600">{success}</p>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600">Error: {error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Profile Picture Section */}
                        <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-6">
                            <h2 className="text-lg font-semibold mb-6">Profile Picture</h2>
                            <div className="flex flex-col items-center space-y-4">
                                {/* Profile Picture Preview */}
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 bg-gray-100">
                                        {profilePicturePreview ? (
                                            <img 
                                                src={profilePicturePreview} 
                                                alt="Profile Preview" 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <FaCamera size={40} />
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Camera Button Overlay */}
                                    <label 
                                        htmlFor="profilePictureInput"
                                        className="absolute bottom-0 right-0 bg-[#46052D] text-white p-2 rounded-full cursor-pointer hover:bg-[#5a0636] transition-colors"
                                    >
                                        <FaCamera size={16} />
                                        <input
                                            id="profilePictureInput"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleProfilePictureChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="flex space-x-3">
                                    <label 
                                        htmlFor="profilePictureInput"
                                        className="px-4 py-2 bg-[#46052D] text-white rounded-lg cursor-pointer hover:bg-[#5a0636] transition-colors text-sm"
                                    >
                                        Choose Photo
                                    </label>
                                    {profilePicturePreview && (
                                        <button
                                            type="button"
                                            onClick={removeProfilePicture}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                                
                                <p className="text-sm text-gray-500 text-center">
                                    Upload a square image. Max size: 5MB<br />
                                    Supported formats: JPG, PNG, GIF
                                </p>
                            </div>
                        </div>

                        {/* Basic Information */}
                        <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-6">
                            <h2 className="text-lg font-semibold mb-6">Basic Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaPhone className="inline mr-2" />
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#46052D] focus:border-[#46052D]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaEnvelope className="inline mr-2" />
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#46052D] focus:border-[#46052D]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaPhone className="inline mr-2" />
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#46052D] focus:border-[#46052D]"
                                        placeholder="+977-9800000000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Date of Birth
                                    </label>
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#46052D] focus:border-[#46052D]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaMapMarkerAlt className="inline mr-2" />
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#46052D] focus:border-[#46052D]"
                                        placeholder="Street, City"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        District
                                    </label>
                                    <input
                                        type="text"
                                        name="district"
                                        value={formData.district}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#46052D] focus:border-[#46052D]"
                                        placeholder="Kathmandu"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Blood Donation Information */}
                        <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-6">
                            <h2 className="text-lg font-semibold mb-6">Blood Donation Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaTint className="inline mr-2" />
                                        Blood Type *
                                    </label>
                                    <select
                                        name="bloodType"
                                        value={formData.bloodType}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#46052D] focus:border-[#46052D]"
                                    >
                                        <option value="">Select Blood Type</option>
                                        {bloodTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        name="isDonor"
                                        checked={formData.isDonor}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-[#46052D] focus:ring-[#46052D] border-gray-300 rounded"
                                    />
                                    <label className="text-sm font-medium text-gray-700">
                                        I am available for blood donation
                                    </label>
                                </div>
                            </div>
                            {formData.isDonor && (
                                <div className="mt-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <input
                                            type="checkbox"
                                            name="availability.isAvailable"
                                            checked={formData.availability.isAvailable}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-[#46052D] focus:ring-[#46052D] border-gray-300 rounded"
                                        />
                                        <label className="text-sm font-medium text-gray-700">
                                            Currently available for donation
                                        </label>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Availability Notes
                                        </label>
                                        <textarea
                                            name="availability.notes"
                                            value={formData.availability.notes}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#46052D] focus:border-[#46052D]"
                                            placeholder="Available on weekends, contact via phone..."
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-6">
                            <h2 className="text-lg font-semibold mb-6">About Me</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <FaFileAlt className="inline mr-2" />
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#46052D] focus:border-[#46052D]"
                                    placeholder="Tell others about yourself, your motivation for donating blood..."
                                />
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-6">
                            <h2 className="text-lg font-semibold mb-6">
                                <FaLink className="inline mr-2" />
                                Social Media Links
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center space-x-3">
                                    <FaFacebookF className="text-blue-600 text-lg w-5 flex-shrink-0" />
                                    <input
                                        type="url"
                                        name="socialMedia.facebook"
                                        value={formData.socialMedia.facebook}
                                        onChange={handleInputChange}
                                        placeholder="Facebook profile URL"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#46052D] focus:border-[#46052D]"
                                    />
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FaInstagram className="text-pink-600 text-lg w-5 flex-shrink-0" />
                                    <input
                                        type="url"
                                        name="socialMedia.instagram"
                                        value={formData.socialMedia.instagram}
                                        onChange={handleInputChange}
                                        placeholder="Instagram profile URL"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#46052D] focus:border-[#46052D]"
                                    />
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FaTwitter className="text-blue-400 text-lg w-5 flex-shrink-0" />
                                    <input
                                        type="url"
                                        name="socialMedia.twitter"
                                        value={formData.socialMedia.twitter}
                                        onChange={handleInputChange}
                                        placeholder="Twitter profile URL"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#46052D] focus:border-[#46052D]"
                                    />
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FaLinkedin className="text-blue-700 text-lg w-5 flex-shrink-0" />
                                    <input
                                        type="url"
                                        name="socialMedia.linkedin"
                                        value={formData.socialMedia.linkedin}
                                        onChange={handleInputChange}
                                        placeholder="LinkedIn profile URL"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#46052D] focus:border-[#46052D]"
                                    />
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FaYoutube className="text-red-600 text-lg w-5 flex-shrink-0" />
                                    <input
                                        type="url"
                                        name="socialMedia.youtube"
                                        value={formData.socialMedia.youtube}
                                        onChange={handleInputChange}
                                        placeholder="YouTube channel URL"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#46052D] focus:border-[#46052D]"
                                    />
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FaWhatsapp className="text-green-600 text-lg w-5 flex-shrink-0" />
                                    <input
                                        type="tel"
                                        name="socialMedia.whatsapp"
                                        value={formData.socialMedia.whatsapp}
                                        onChange={handleInputChange}
                                        placeholder="+977-9800000000"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#46052D] focus:border-[#46052D]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Communities */}
                        <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-6">
                            <h2 className="text-lg font-semibold mb-6">Communities</h2>
                            
                            {/* Add New Community */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                                <input
                                    type="text"
                                    value={newCommunity.name}
                                    onChange={(e) => setNewCommunity(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Community name"
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#46052D] focus:border-[#46052D]"
                                />
                                <input
                                    type="text"
                                    value={newCommunity.role}
                                    onChange={(e) => setNewCommunity(prev => ({ ...prev, role: e.target.value }))}
                                    placeholder="Your role"
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#46052D] focus:border-[#46052D]"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddCommunity}
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-[#46052D] text-white rounded-lg hover:bg-[#5a0636]"
                                >
                                    <FaPlus /> Add
                                </button>
                            </div>

                            {/* Community List */}
                            <div className="space-y-2">
                                {communities.map((community, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <span className="font-medium">{community.name}</span>
                                            <span className="text-gray-500 ml-2">({community.role})</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveCommunity(index)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                ))}
                                {communities.length === 0 && (
                                    <p className="text-gray-500 text-center py-4">No communities added yet</p>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/profile')}
                                className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition duration-300"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`flex-1 py-3 px-6 text-white font-semibold rounded-xl transition duration-300 transform hover:scale-105 flex items-center justify-center gap-2 ${
                                    loading ? "opacity-80 cursor-not-allowed" : "hover:opacity-95"
                                }`}
                                style={{ backgroundColor: "#46052D" }}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <FaSpinner className="animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <FaSave />
                                        Save Profile
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
