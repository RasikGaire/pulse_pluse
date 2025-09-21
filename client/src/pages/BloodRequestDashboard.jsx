import React, { useState, useEffect, useCallback } from 'react';
import { FaSpinner, FaClock, FaCheckCircle, FaTimesCircle, FaHourglass, FaEye, FaPhone, FaMapMarkerAlt, FaHospital, FaTint, FaCalendarAlt, FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const BloodRequestDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, getAuthHeaders } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // all, pending, approved, completed, cancelled

  // API base URL
  const API_BASE_URL = 'http://localhost:5000/api';

  // Mock data for when backend is not available
  const getMockRequests = () => [
    {
      _id: 'mock-1',
      bloodGroup: 'O+',
      appointmentDate: '2025-09-25',
      phoneNumber: '+977-9851234567',
      bloodUnits: '2',
      district: 'Kathmandu',
      hospitalName: 'Tribhuvan University Teaching Hospital',
      description: 'Urgent blood needed for emergency surgery. Patient is in critical condition.',
      urgency: 'critical',
      status: 'pending',
      createdAt: '2025-09-21T10:30:00Z',
      requesterName: 'John Doe',
      requesterEmail: 'john.doe@example.com'
    },
    {
      _id: 'mock-2',
      bloodGroup: 'A+',
      appointmentDate: '2025-09-23',
      phoneNumber: '+977-9861234567',
      bloodUnits: '1',
      district: 'Lalitpur',
      hospitalName: 'Patan Hospital',
      description: 'Regular blood transfusion needed for ongoing treatment.',
      urgency: 'normal',
      status: 'approved',
      createdAt: '2025-09-20T14:15:00Z',
      requesterName: 'Jane Smith',
      requesterEmail: 'jane.smith@example.com'
    },
    {
      _id: 'mock-3',
      bloodGroup: 'B-',
      appointmentDate: '2025-09-22',
      phoneNumber: '+977-9871234567',
      bloodUnits: '3',
      district: 'Bhaktapur',
      hospitalName: 'Bhaktapur Hospital',
      description: 'Blood needed for cancer patient undergoing chemotherapy.',
      urgency: 'urgent',
      status: 'in-progress',
      createdAt: '2025-09-19T09:45:00Z',
      requesterName: 'Mike Johnson',
      requesterEmail: 'mike.johnson@example.com'
    }
  ];

  // Fetch blood requests
  const fetchBloodRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Dashboard: Fetching blood requests...');
      console.log('Dashboard: API URL:', `${API_BASE_URL}/blood-requests/my-requests`);
      console.log('Dashboard: Auth headers:', getAuthHeaders());
      
      const response = await fetch(`${API_BASE_URL}/blood-requests/my-requests`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      console.log('Dashboard: Response status:', response.status);
      console.log('Dashboard: Response ok:', response.ok);

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();
      console.log('Dashboard: Response data:', data);
      console.log('Dashboard: Blood requests array:', data.bloodRequests);
      
      setRequests(data.bloodRequests || []);
    } catch (err) {
      console.error('Error fetching requests:', err);
      
      // Use mock data when backend is not available
      console.log('Using mock data for blood requests');
      setRequests(getMockRequests());
      
      if (err.message.includes('DOCTYPE') || err.message.includes('non-JSON')) {
        setError('Backend server returned HTML instead of JSON - Using demo data');
      } else {
        setError('Backend server not available - Using demo data');
      }
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchBloodRequests();
    
    // Check if we came from a successful request submission
    if (location.state?.refreshRequests) {
      console.log('Dashboard: Triggered by successful request submission - refreshing...');
      // Clear the state to prevent unnecessary refreshes
      navigate(location.pathname, { replace: true });
    }
  }, [isAuthenticated, navigate, fetchBloodRequests, location]);

  // Filter requests based on active tab
  const filteredRequests = requests.filter(request => {
    if (activeTab === 'all') return true;
    
    // Convert status to lowercase for comparison
    const requestStatus = request.status ? request.status.toLowerCase() : '';
    return requestStatus === activeTab;
  });

  // Get status icon and color
  const getStatusDisplay = (status) => {
    const normalizedStatus = status ? status.toLowerCase() : '';
    switch (normalizedStatus) {
      case 'pending':
        return { icon: <FaClock />, color: 'text-yellow-600', bg: 'bg-yellow-100', text: 'Pending' };
      case 'approved':
        return { icon: <FaCheckCircle />, color: 'text-green-600', bg: 'bg-green-100', text: 'Approved' };
      case 'in-progress':
      case 'fulfilled':
        return { icon: <FaHourglass />, color: 'text-blue-600', bg: 'bg-blue-100', text: 'In Progress' };
      case 'completed':
        return { icon: <FaCheckCircle />, color: 'text-green-700', bg: 'bg-green-200', text: 'Completed' };
      case 'cancelled':
      case 'expired':
        return { icon: <FaTimesCircle />, color: 'text-red-600', bg: 'bg-red-100', text: 'Cancelled' };
      default:
        return { icon: <FaClock />, color: 'text-gray-600', bg: 'bg-gray-100', text: 'Unknown' };
    }
  };

  // Get urgency display
  const getUrgencyDisplay = (urgency) => {
    const normalizedUrgency = urgency ? urgency.toLowerCase() : '';
    switch (normalizedUrgency) {
      case 'critical':
      case 'high':
        return { color: 'text-red-600', bg: 'bg-red-100', text: 'Critical', icon: <FaExclamationTriangle /> };
      case 'urgent':
      case 'medium':
        return { color: 'text-orange-600', bg: 'bg-orange-100', text: 'Urgent', icon: <FaExclamationTriangle /> };
      case 'normal':
      case 'low':
      default:
        return { color: 'text-green-600', bg: 'bg-green-100', text: 'Normal', icon: <FaClock /> };
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 flex justify-center items-center min-h-64">
        <FaSpinner className="animate-spin text-4xl text-[#46052D]" />
        <span className="ml-3 text-lg">Loading requests...</span>
      </div>
    );
  }

  // Request Detail Modal
  if (selectedRequest) {
    const statusDisplay = getStatusDisplay(selectedRequest.status);
    const urgencyDisplay = getUrgencyDisplay(selectedRequest.urgency);

    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <button 
          onClick={() => setSelectedRequest(null)}
          className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-[#670A37] bg-white border border-[#670A37] rounded-lg shadow-sm hover:bg-[#670A37] hover:text-white transition-colors duration-300"
        >
          ← Back to requests
        </button>

        <div className="bg-white rounded-2xl shadow-md ring-1 ring-black/5 p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-3xl font-bold mb-2">Blood Request Details</h3>
              <p className="text-gray-600">Request ID: {selectedRequest._id}</p>
            </div>
            <div className="flex gap-2">
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusDisplay.bg} ${statusDisplay.color}`}>
                {statusDisplay.icon}
                {statusDisplay.text}
              </span>
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${urgencyDisplay.bg} ${urgencyDisplay.color}`}>
                {urgencyDisplay.icon}
                {urgencyDisplay.text}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Request Information</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FaTint className="text-red-500" />
                  <span className="font-medium">Blood Type:</span>
                  <span className="text-lg font-bold text-red-600">{selectedRequest.bloodGroup}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaTint className="text-red-500" />
                  <span className="font-medium">Units Needed:</span>
                  <span>{selectedRequest.bloodUnits}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-blue-500" />
                  <span className="font-medium">Appointment Date:</span>
                  <span>{formatDate(selectedRequest.appointmentDate)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-gray-500" />
                  <span className="font-medium">Request Date:</span>
                  <span>{formatDate(selectedRequest.createdAt)}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact & Location</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FaPhone className="text-green-500" />
                  <span className="font-medium">Phone:</span>
                  <span>{selectedRequest.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-orange-500" />
                  <span className="font-medium">District:</span>
                  <span>{selectedRequest.district}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaHospital className="text-purple-500" />
                  <span className="font-medium">Hospital:</span>
                  <span>{selectedRequest.hospitalName}</span>
                </div>
              </div>
            </div>
          </div>

          {selectedRequest.description && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-3">Additional Details</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{selectedRequest.description}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Blood Request Dashboard</h2>
          <p className="text-gray-600 mt-1">Manage and track your blood requests</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchBloodRequests}
            className="px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            disabled={loading}
          >
            <FaSpinner className={loading ? "animate-spin" : ""} />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
          <button
            onClick={() => navigate('/request-blood')}
            className="px-6 py-3 bg-[#46052D] text-white font-medium rounded-lg hover:bg-[#670A37] transition-colors"
          >
            + New Request
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: 'all', label: 'All Requests', count: requests.length },
          { key: 'pending', label: 'Pending', count: requests.filter(r => r.status === 'pending').length },
          { key: 'approved', label: 'Approved', count: requests.filter(r => r.status === 'approved').length },
          { key: 'in-progress', label: 'In Progress', count: requests.filter(r => r.status === 'in-progress').length },
          { key: 'completed', label: 'Completed', count: requests.filter(r => r.status === 'completed').length },
          { key: 'cancelled', label: 'Cancelled', count: requests.filter(r => r.status === 'cancelled').length }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full border transition-colors flex items-center gap-2 ${
              activeTab === tab.key
                ? 'bg-[#46052D] text-white border-[#46052D]'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {tab.label}
            <span className={`px-2 py-1 rounded-full text-xs ${
              activeTab === tab.key ? 'bg-white text-[#46052D]' : 'bg-gray-200 text-gray-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchBloodRequests}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {filteredRequests.length === 0 ? (
        <div className="text-center py-12">
          <FaTint className="mx-auto text-gray-400 text-4xl mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {activeTab === 'all' ? 'No blood requests yet' : `No ${activeTab} requests`}
          </h3>
          <p className="text-gray-600 mb-4">
            {activeTab === 'all' 
              ? 'Create your first blood request to get started'
              : `You don't have any ${activeTab} requests at the moment`
            }
          </p>
          {activeTab === 'all' && (
            <button
              onClick={() => navigate('/request-blood')}
              className="px-6 py-3 bg-[#46052D] text-white font-medium rounded-lg hover:bg-[#670A37] transition-colors"
            >
              Create Request
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => {
            const statusDisplay = getStatusDisplay(request.status);
            const urgencyDisplay = getUrgencyDisplay(request.urgency);

            return (
              <div key={request._id} className="bg-white rounded-lg shadow-md border p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.bloodGroup} Blood Request
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusDisplay.bg} ${statusDisplay.color}`}>
                        {statusDisplay.icon}
                        {statusDisplay.text}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${urgencyDisplay.bg} ${urgencyDisplay.color}`}>
                        {urgencyDisplay.icon}
                        {urgencyDisplay.text}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Units:</span> {request.bloodUnits}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {formatDate(request.appointmentDate)}
                      </div>
                      <div>
                        <span className="font-medium">Hospital:</span> {request.hospitalName}
                      </div>
                      <div>
                        <span className="font-medium">District:</span> {request.district}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#46052D] text-white rounded-lg hover:bg-[#670A37] transition-colors text-sm"
                  >
                    <FaEye />
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};