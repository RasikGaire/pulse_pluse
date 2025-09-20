import React, { useState } from 'react';
import { FaTint, FaCalendarAlt, FaPhone, FaHospital, FaMapMarkerAlt, FaFileAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const RequestBlood = () => {
    const navigate = useNavigate();
    
    // State variables for form fields
    const [formData, setFormData] = useState({
        bloodGroup: '',
        appointmentDate: '',
        phoneNumber: '',
        bloodUnits: '',
        district: '',
        hospitalName: '',
        description: ''
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

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Basic validation
        if (!formData.bloodGroup) {
            setError('Please select a blood group');
            return;
        }
        if (!formData.appointmentDate) {
            setError('Please select a date for appointment');
            return;
        }
        if (!formData.phoneNumber.trim()) {
            setError('Phone number is required');
            return;
        }
        if (!formData.bloodUnits.trim()) {
            setError('Blood units is required');
            return;
        }
        if (!formData.district.trim()) {
            setError('District is required');
            return;
        }
        if (!formData.hospitalName.trim()) {
            setError('Hospital name is required');
            return;
        }

        setLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            setSuccess('Blood request submitted successfully! We will contact you soon.');
            
            // Reset form after successful submission
            setTimeout(() => {
                setFormData({
                    bloodGroup: '',
                    appointmentDate: '',
                    phoneNumber: '',
                    bloodUnits: '',
                    district: '',
                    hospitalName: '',
                    description: ''
                });
                setSuccess('');
            }, 3000);
            
        } catch (err) {
            setError('Request failed. Please try again.');
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
                            Request a Blood
                        </h1>
                        <p className="text-gray-600">
                            Fill out the form below to request blood donation. We'll help you find donors in your area.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        
                        {/* Main Form Fields - Two Columns */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-6">
                                {/* Blood Group */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="bloodGroup">
                                        <FaTint className="inline mr-2 text-red-500" />
                                        Select a Blood Group
                                    </label>
                                    <select
                                        id="bloodGroup"
                                        name="bloodGroup"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#46052D] bg-gray-50"
                                        value={formData.bloodGroup}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                    >
                                        <option value="">Select blood group</option>
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

                                {/* Date for Appointment */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="appointmentDate">
                                        <FaCalendarAlt className="inline mr-2 text-blue-500" />
                                        Date for Appointment
                                    </label>
                                    <input
                                        id="appointmentDate"
                                        name="appointmentDate"
                                        type="date"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#46052D] bg-gray-50"
                                        value={formData.appointmentDate}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                    />
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="phoneNumber">
                                        <FaPhone className="inline mr-2 text-green-500" />
                                        Phone Number
                                    </label>
                                    <input
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#46052D] bg-gray-50"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                {/* Blood Units */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="bloodUnits">
                                        <FaTint className="inline mr-2 text-red-500" />
                                        Blood Units
                                    </label>
                                    <input
                                        id="bloodUnits"
                                        name="bloodUnits"
                                        type="number"
                                        placeholder="Enter number of units needed"
                                        min="1"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#46052D] bg-gray-50"
                                        value={formData.bloodUnits}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                    />
                                </div>

                                {/* District */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="district">
                                        <FaMapMarkerAlt className="inline mr-2 text-orange-500" />
                                        District
                                    </label>
                                    <input
                                        id="district"
                                        name="district"
                                        type="text"
                                        placeholder="Enter your district"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#46052D] bg-gray-50"
                                        value={formData.district}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                    />
                                </div>

                                {/* Hospital Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="hospitalName">
                                        <FaHospital className="inline mr-2 text-purple-500" />
                                        Hospital Name
                                    </label>
                                    <input
                                        id="hospitalName"
                                        name="hospitalName"
                                        type="text"
                                        placeholder="Enter hospital name"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#46052D] bg-gray-50"
                                        value={formData.hospitalName}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="description">
                                <FaFileAlt className="inline mr-2 text-gray-500" />
                                Input Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={6}
                                placeholder="Please provide additional details about the blood request, patient condition, urgency, or any special requirements..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#46052D] bg-gray-50 resize-none"
                                value={formData.description}
                                onChange={handleInputChange}
                                disabled={loading}
                            />
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
                                {loading ? "Sending Request..." : "Send Request"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
