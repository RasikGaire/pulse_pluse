import React, { useState } from 'react';
import { FaCamera, FaPhone, FaEnvelope, FaTint, FaMapMarkerAlt, FaFileAlt, FaLink, FaFacebookF, FaInstagram, FaTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const ProfileVerification = () => {
    const navigate = useNavigate();
    
    // State variables for form fields
    const [formData, setFormData] = useState({
        photo: null,
        phone: '',
        email: '',
        bloodGroup: '',
        address: '',
        description: '',
        socialMedia: {
            facebook: '',
            instagram: '',
            twitter: '',
            linkedin: '',
            youtube: ''
        }
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle social media input changes
    const handleSocialMediaChange = (platform, value) => {
        setFormData(prev => ({
            ...prev,
            socialMedia: {
                ...prev.socialMedia,
                [platform]: value
            }
        }));
    };

    // Handle photo upload
    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                photo: file
            }));
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Basic validation
        if (!formData.phone.trim()) {
            setError('Phone number is required');
            return;
        }
        if (!formData.email.trim()) {
            setError('Email is required');
            return;
        }
        if (!formData.bloodGroup) {
            setError('Blood group is required');
            return;
        }
        if (!formData.address.trim()) {
            setError('Address is required');
            return;
        }

        setLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            setSuccess('Profile verification submitted successfully! We will review your information and get back to you soon.');
            
            // Reset form after successful submission
            setTimeout(() => {
                setFormData({
                    photo: null,
                    phone: '',
                    email: '',
                    bloodGroup: '',
                    address: '',
                    description: '',
                    socialMedia: {
                        facebook: '',
                        instagram: '',
                        twitter: '',
                        linkedin: '',
                        youtube: ''
                    }
                });
                setSuccess('');
            }, 3000);
            
        } catch (err) {
            setError('Submission failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="font-sans antialiased text-gray-800 bg-gray-50 min-h-screen">
            <div className="flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 md:p-10">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-[#46052D] mb-2">
                                Profile Verification
                            </h1>
                            <p className="text-gray-600">
                                Complete your profile verification to help others find you and connect for blood donation.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            
                            {/* Photo Upload */}
                            <div className="text-center">
                                <label className="block text-sm font-medium text-gray-700 mb-4">
                                    Profile Photo
                                </label>
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-300">
                                        {formData.photo ? (
                                            <img 
                                                src={URL.createObjectURL(formData.photo)} 
                                                alt="Profile preview" 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FaCamera className="text-gray-400 text-3xl" />
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoUpload}
                                            className="hidden"
                                            id="photo-upload"
                                        />
                                        <label
                                            htmlFor="photo-upload"
                                            className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition duration-200"
                                        >
                                            <FaCamera className="mr-2" />
                                            Upload Photo
                                        </label>
                                        <p className="text-xs text-gray-500 mt-2">JPG, PNG up to 5MB</p>
                                    </div>
                                </div>
                            </div>

                            {/* Personal Information Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone">
                                        <FaPhone className="inline mr-2" />
                                        Phone Number
                                    </label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#46052D]"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                                        <FaEnvelope className="inline mr-2" />
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#46052D]"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bloodGroup">
                                        <FaTint className="inline mr-2" />
                                        Blood Group
                                    </label>
                                    <select
                                        id="bloodGroup"
                                        name="bloodGroup"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#46052D]"
                                        value={formData.bloodGroup}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                    >
                                        <option value="">Select your blood group</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </select>
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="address">
                                    <FaMapMarkerAlt className="inline mr-2" />
                                    Address
                                </label>
                                <textarea
                                    id="address"
                                    name="address"
                                    rows={3}
                                    placeholder="Enter your complete address"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#46052D] resize-none"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
                                    <FaFileAlt className="inline mr-2" />
                                    About You
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={4}
                                    placeholder="Tell us about yourself, your availability for blood donation, and any relevant information..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#46052D] resize-none"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                            </div>

                            {/* Social Media Links */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-4">
                                    <FaLink className="inline mr-2" />
                                    Social Media Links (Optional)
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-3">
                                        <FaFacebookF className="text-blue-600 text-lg w-5 flex-shrink-0" />
                                        <input
                                            type="url"
                                            placeholder="Facebook profile URL"
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#46052D]"
                                            value={formData.socialMedia.facebook}
                                            onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <FaInstagram className="text-pink-600 text-lg w-5 flex-shrink-0" />
                                        <input
                                            type="url"
                                            placeholder="Instagram profile URL"
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#46052D]"
                                            value={formData.socialMedia.instagram}
                                            onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <FaTwitter className="text-blue-400 text-lg w-5 flex-shrink-0" />
                                        <input
                                            type="url"
                                            placeholder="Twitter profile URL"
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#46052D]"
                                            value={formData.socialMedia.twitter}
                                            onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <FaLinkedin className="text-blue-700 text-lg w-5 flex-shrink-0" />
                                        <input
                                            type="url"
                                            placeholder="LinkedIn profile URL"
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#46052D]"
                                            value={formData.socialMedia.linkedin}
                                            onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="flex items-center space-x-3 md:col-span-2">
                                        <FaYoutube className="text-red-600 text-lg w-5 flex-shrink-0" />
                                        <input
                                            type="url"
                                            placeholder="YouTube channel URL"
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#46052D]"
                                            value={formData.socialMedia.youtube}
                                            onChange={(e) => handleSocialMediaChange('youtube', e.target.value)}
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Error / Success Messages */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                    <p className="text-red-600 text-sm">{error}</p>
                                </div>
                            )}
                            {success && (
                                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                    <p className="text-green-600 text-sm">{success}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition duration-300"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`flex-1 py-3 px-6 text-white font-semibold rounded-xl transition duration-300 transform hover:scale-105 ${
                                        loading ? "opacity-80 cursor-not-allowed" : "hover:opacity-95"
                                    }`}
                                    style={{ backgroundColor: "#46052D" }}
                                    disabled={loading}
                                >
                                    {loading ? "Submitting..." : "Submit for Verification"}
                                </button>
                            </div>
                        </form>
                </div>
            </div>
        </div>
    );
};
