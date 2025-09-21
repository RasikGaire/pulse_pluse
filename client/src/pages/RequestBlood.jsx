import React, { useState } from 'react';
import { FaTint, FaCalendarAlt, FaPhone, FaHospital, FaMapMarkerAlt, FaFileAlt, FaSpinner, FaCheckCircle, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';

export const RequestBlood = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, getAuthHeaders } = useAuth();
    const { addBloodRequestNotification } = useNotifications();
    
    // API base URL
    const API_BASE_URL = 'http://localhost:5000/api';
    
    // State variables for form fields
    const [formData, setFormData] = useState({
        bloodGroup: '',
        appointmentDate: '',
        phoneNumber: user?.phone || '',
        bloodUnits: '',
        district: user?.district || '',
        hospitalName: '',
        description: '',
        urgency: 'normal' // normal, urgent, critical
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle modal close and navigation
    const handleModalClose = () => {
        setShowSuccessModal(false);
        navigate('/blood-requests', { 
            state: { refreshRequests: true },
            replace: true 
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Check if user is authenticated
        if (!isAuthenticated()) {
            setError('Please login to submit a blood request');
            setTimeout(() => navigate('/login'), 2000);
            return;
        }

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

        // Validate required fields
        const requiredFields = {
            bloodGroup: 'Blood Group',
            bloodUnits: 'Blood Units', 
            appointmentDate: 'Appointment Date',
            phoneNumber: 'Phone Number',
            district: 'District',
            hospitalName: 'Hospital Name',
            description: 'Description'
        };

        const missingFields = [];
        Object.entries(requiredFields).forEach(([field, label]) => {
            if (!formData[field] || formData[field].trim() === '') {
                missingFields.push(label);
            }
        });

        if (missingFields.length > 0) {
            setError(`Please fill in the following required fields: ${missingFields.join(', ')}`);
            return;
        }

        // Validate blood units
        const bloodUnits = parseInt(formData.bloodUnits);
        if (isNaN(bloodUnits) || bloodUnits < 1 || bloodUnits > 10) {
            setError('Blood units must be a number between 1 and 10');
            return;
        }

        // Validate phone number format
        const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(formData.phoneNumber)) {
            setError('Please enter a valid phone number (e.g., +9779800662455)');
            return;
        }

        // Check if appointment date is not in the past
        const appointmentDate = new Date(formData.appointmentDate);
        const today = new Date();
        if (appointmentDate < today) {
            setError('Appointment date cannot be in the past');
            return;
        }

        setLoading(true);

        try {
            // Map frontend urgency values to backend enum values
            const getUrgencyLevel = (urgency) => {
                switch (urgency) {
                    case 'normal': return 'Low';
                    case 'urgent': return 'High';
                    case 'critical': return 'Critical';
                    default: return 'Medium';
                }
            };

            const mappedUrgencyLevel = getUrgencyLevel(formData.urgency);
            console.log('Urgency mapping:', formData.urgency, '->', mappedUrgencyLevel);

            const requestData = {
                bloodGroup: formData.bloodGroup,
                bloodUnits: parseInt(formData.bloodUnits), // Convert to number
                appointmentDate: formData.appointmentDate,
                phoneNumber: formData.phoneNumber,
                district: formData.district,
                hospitalName: formData.hospitalName,
                description: formData.description,
                urgencyLevel: mappedUrgencyLevel, // Map urgency to backend enum
                isEmergency: formData.urgency === 'critical' // Only critical is emergency
            };

            console.log('Sending request data:', requestData);
            console.log('Auth headers:', getAuthHeaders());

            const response = await fetch(`${API_BASE_URL}/blood-requests/create`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(requestData)
            });

            // Check if response is actually JSON before parsing
            const contentType = response.headers.get('content-type');
            let data = {};
            
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                // If it's not JSON, it's likely an HTML error page
                const text = await response.text();
                console.error('Server returned non-JSON response:', text);
                throw new Error('Server returned an error page instead of JSON');
            }

            if (!response.ok) {
                console.error('Server response error:', {
                    status: response.status,
                    statusText: response.statusText,
                    data: data
                });
                
                // Log the specific validation errors
                if (data.errors && Array.isArray(data.errors)) {
                    console.error('Specific validation errors:', data.errors);
                    throw new Error(`Validation errors: ${data.errors.join(', ')}`);
                } else if (data.message) {
                    throw new Error(data.message);
                } else {
                    throw new Error(`Server error: ${response.status} ${response.statusText}`);
                }
            }
            
            // Add notification to navbar
            addBloodRequestNotification({
                bloodType: formData.bloodGroup,
                urgencyLevel: formData.urgency,
                patientName: formData.description ? 'Patient' : 'Anonymous',
                hospitalName: formData.hospitalName
            });
            
            // Show success modal instead of text message
            setShowSuccessModal(true);
            
            // Reset form
            setFormData({
                bloodGroup: '',
                appointmentDate: '',
                phoneNumber: user?.phone || '',
                bloodUnits: '',
                district: user?.district || '',
                hospitalName: '',
                description: '',
                urgency: 'normal'
            });
            
        } catch (error) {
            setError(error.message || 'Request failed. Please try again.');
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
                                        max="10"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#46052D] bg-gray-50"
                                        value={formData.bloodUnits}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                    />
                                </div>

                                {/* Urgency */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="urgency">
                                        <FaFileAlt className="inline mr-2 text-yellow-500" />
                                        Urgency Level
                                    </label>
                                    <select
                                        id="urgency"
                                        name="urgency"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#46052D] bg-gray-50"
                                        value={formData.urgency}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                    >
                                        <option value="normal">Normal (3-7 days)</option>
                                        <option value="urgent">Urgent (1-2 days)</option>
                                        <option value="critical">Critical (Immediate)</option>
                                    </select>
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
                                className={`flex-1 py-3 px-6 text-white font-semibold rounded-xl transition duration-300 transform hover:scale-105 flex items-center justify-center gap-2 ${
                                    loading ? "opacity-80 cursor-not-allowed" : "hover:opacity-95"
                                }`}
                                style={{ backgroundColor: "#46052D" }}
                                disabled={loading}
                            >
                                {loading && <FaSpinner className="animate-spin" />}
                                {loading ? "Sending Request..." : "Send Request"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-pulse">
                    <div className="bg-white rounded-2xl p-8 max-w-md mx-4 relative transform transition-all duration-300 scale-100 opacity-100">
                        {/* Close button */}
                        <button
                            onClick={handleModalClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <FaTimes size={20} />
                        </button>
                        
                        {/* Success content */}
                        <div className="text-center">
                            <div className="mb-4">
                                <div className="inline-block p-4 rounded-full bg-green-100 mb-4">
                                    <FaCheckCircle size={48} className="text-green-500" />
                                </div>
                            </div>
                            
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Request Submitted Successfully!
                            </h3>
                            
                            <p className="text-gray-600 mb-6">
                                Your blood request has been submitted successfully. We will contact you soon with available donors in your area.
                            </p>
                            
                            <div className="space-y-3">
                                <button
                                    onClick={handleModalClose}
                                    className="w-full py-3 px-6 bg-[#46052D] text-white font-semibold rounded-xl hover:bg-[#670A37] transition duration-300 transform hover:scale-105"
                                >
                                    View My Requests
                                </button>
                                
                                <button
                                    onClick={() => setShowSuccessModal(false)}
                                    className="w-full py-3 px-6 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition duration-300"
                                >
                                    Submit Another Request
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
