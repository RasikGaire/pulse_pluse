import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaSpinner, FaSearch } from "react-icons/fa";

export const FindDonor = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tabFromUrl = searchParams.get('tab');
  
  const [activeTab, setActiveTab] = useState(tabFromUrl === 'donors' ? "donors" : "banks");
  const [bloodDonors, setBloodDonors] = useState([]);
  const [bloodBanks, setBloodBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);
  
  // Search filters
  const [searchFilters, setSearchFilters] = useState({
    bloodType: 'all',
    district: 'all',
    isAvailable: false
  });

  // API base URL
  const API_BASE_URL = 'http://localhost:5000/api';

  // Fetch blood donors from backend
  const fetchBloodDonors = async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.bloodType && filters.bloodType !== 'all') params.append('bloodType', filters.bloodType);
      if (filters.district && filters.district !== 'all') params.append('district', filters.district);
      if (filters.isAvailable) params.append('isAvailable', 'true');

      const endpoint = Object.keys(filters).length > 0 && Object.values(filters).some(v => v && v !== 'all') 
        ? `/users/donors/search?${params.toString()}`
        : '/users/donors';

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch donors: ${response.status}`);
      }

      const data = await response.json();
      return data.donors || [];
    } catch (error) {
      console.error('Error fetching donors:', error);
      throw error;
    }
  };

  // Fetch blood banks from backend
  const fetchBloodBanks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/blood-banks`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch blood banks: ${response.status}`);
      }

      const data = await response.json();
      return data.bloodBanks || [];
    } catch (error) {
      console.error('Error fetching blood banks:', error);
      throw error;
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [donorsData, banksData] = await Promise.all([
          fetchBloodDonors(),
          fetchBloodBanks()
        ]);
        
        setBloodDonors(donorsData);
        setBloodBanks(banksData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle URL parameter changes
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl === 'donors') {
      setActiveTab('donors');
    } else if (tabFromUrl === 'banks') {
      setActiveTab('banks');
    }
  }, [searchParams]);

  // Handle search filter changes
  const handleFilterChange = async (filterType, value) => {
    const newFilters = { ...searchFilters, [filterType]: value };
    setSearchFilters(newFilters);

    if (activeTab === "donors") {
      setLoading(true);
      try {
        const filteredDonors = await fetchBloodDonors(newFilters);
        setBloodDonors(filteredDonors);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Reset filters
  const resetFilters = async () => {
    const resetFilters = { bloodType: 'all', district: 'all', isAvailable: false };
    setSearchFilters(resetFilters);
    
    if (activeTab === "donors") {
      setLoading(true);
      try {
        const allDonors = await fetchBloodDonors();
        setBloodDonors(allDonors);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64 mt-10">
        <FaSpinner className="animate-spin text-4xl text-[#46052D]" />
        <span className="ml-3 text-lg">Loading data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ---------- Donor Profile ----------
  if (selectedDonor) {
    const donor = selectedDonor;
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <button onClick={() => setSelectedDonor(null)}className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-[#670A37] bg-white border border-[#670A37] rounded-lg shadow-sm hover:bg-[#670A37] hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-1 
        focus:ring-[#670A37]"> &larr; Back to list </button>

        <div className="bg-white rounded-2xl shadow-md ring-1 ring-black/5 p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0 w-full md:w-1/3">
              <div className="w-full aspect-square rounded-full overflow-hidden border-2 border-gray-200">
                <img src={donor.profileImage} alt={donor.name} className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-3xl font-bold">{donor.name}</h3>
              <div className="mt-2 text-gray-600 flex flex-wrap gap-x-10 gap-y-1 text-sm">
                <span>Email: {donor.email}</span>
                <span>Phone: {donor.contact}</span>
                <span>Blood Type: {donor.blood_type}</span>
                <span>Location: {donor.location}</span>
                <span>Last Donated: {donor.last_donated}</span>
              </div>
              <hr className="my-6 border-gray-200" />
              <p className="text-lg font-semibold mb-4">Social Media</p>
              <div className="flex gap-6 mb-6">
                {Object.entries(donor.social).map(([key, link], i) => {
                  const Icon = key === "facebook" ? FaFacebookF : key === "instagram" ? FaInstagram : FaWhatsapp;
                  return (
                    <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 p-3 border rounded-lg shadow-sm hover:shadow-md">
                      <Icon size={28} />
                      <span className="text-sm text-gray-600">{key}</span>
                    </a>
                  );
                })}
              </div>
              <h4 className="text-lg font-semibold mb-2">Communities</h4>
              <ul className="text-sm text-gray-600 mb-6 space-y-1">
                {donor.communities.map((c, i) => (
                  <li key={i} className="flex justify-between"><span>{c.name}</span><span>{c.joined}</span></li>
                ))}
              </ul>
              <h4 className="text-lg font-semibold mb-2">Contributions</h4>
              <div className="grid grid-cols-2 gap-6 text-center mb-6">
                <div>
                  <div className="text-4xl font-bold">{donor.contributions.bloodDonated}</div>
                  <p className="text-xs text-gray-500 mt-1">Blood Donated</p>
                </div>
                <div>
                  <div className="text-4xl font-bold">{donor.contributions.volunteer}</div>
                  <p className="text-xs text-gray-500 mt-1">Volunteer Hours</p>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-start">
                <button 
                  onClick={() => navigate('/request-blood')}
                  className="px-5 py-2 rounded-md border text-sm hover:bg-gray-100 transition-colors"
                >
                  Request Blood
                </button>
                <button className="px-5 py-2 rounded-md text-white text-sm bg-[#46052D] hover:bg-[#670A37]">Call Now</button>
                <span className="text-[10px] text-gray-400 ml-2">Use in case of emergency</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Blood Bank Profile ----------
  if (selectedBank) {
    const bank = selectedBank;
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <button onClick={() => setSelectedBank(null)}
          className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-[#670A37] bg-white border border-[#670A37] rounded-lg shadow-sm hover:bg-[#670A37] hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#670A37]" >
          &larr; Back to list
        </button>

        <div className="bg-white rounded-2xl shadow-md ring-1 ring-black/5 p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-3xl font-bold mb-2">{bank.name}</h3>
              <p className="text-lg text-gray-600 mb-1">{bank.address}</p>
              <p className="text-sm text-gray-500">District: {bank.district}</p>
            </div>
            {bank.isActive && (
              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                Active
              </span>
            )}
          </div>
          
          {/* Contact Information */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3 text-gray-800">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Phone</p>
                <p className="text-base text-gray-900">{bank.contact?.phone || 'N/A'}</p>
              </div>
              {bank.contact?.email && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-base text-gray-900">{bank.contact.email}</p>
                </div>
              )}
              {bank.contact?.emergencyContact && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">Emergency Contact</p>
                  <p className="text-base text-gray-900">{bank.contact.emergencyContact}</p>
                </div>
              )}
            </div>
          </div>

          {/* Blood Inventory */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3 text-gray-800">Blood Inventory</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(bank.bloodInventory || {}).map(([type, units]) => (
                <div key={type} className={`p-4 rounded-lg text-center shadow-sm ${
                  units > 0 ? 'bg-red-50 text-red-800' : 'bg-gray-50 text-gray-500'
                }`}>
                  <div className="text-2xl font-bold">{units}</div>
                  <div className="text-sm font-medium">{type}</div>
                  <div className="text-xs">
                    {units > 0 ? 'Available' : 'Out of Stock'}
                  </div>
                </div>
              ))}
            </div>
            {bank.lastInventoryUpdate && (
              <p className="text-xs text-gray-500 mt-2">
                Last updated: {new Date(bank.lastInventoryUpdate).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Operating Hours */}
          {bank.operatingHours && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3 text-gray-800">Operating Hours</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(bank.operatingHours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between items-center py-2 px-4 bg-gray-50 rounded">
                    <span className="font-medium capitalize">{day}</span>
                    <span className="text-sm">
                      {hours.isOpen ? `${hours.open || '9:00 AM'} - ${hours.close || '5:00 PM'}` : 'Closed'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Facilities */}
          {bank.facilities && bank.facilities.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3 text-gray-800">Facilities</h4>
              <div className="flex flex-wrap gap-2">
                {bank.facilities.map((facility, index) => (
                  <span key={index} className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {facility}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certification */}
          {bank.certification && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3 text-gray-800">Certification</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-block w-3 h-3 rounded-full ${
                    bank.certification.isGovernmentApproved ? 'bg-green-500' : 'bg-gray-400'
                  }`}></span>
                  <span className="text-sm font-medium">
                    {bank.certification.isGovernmentApproved ? 'Government Approved' : 'Pending Approval'}
                  </span>
                </div>
                {bank.certification.license && (
                  <p className="text-sm text-gray-600">License: {bank.certification.license}</p>
                )}
                {bank.certification.expiryDate && (
                  <p className="text-sm text-gray-600">
                    Expires: {new Date(bank.certification.expiryDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 justify-start">
            <button 
              onClick={() => navigate('/request-blood')}
              className="px-6 py-3 rounded-md border border-[#670A37] text-[#670A37] text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Request Blood
            </button>
            <button className="px-6 py-3 rounded-md text-white text-sm font-medium bg-[#46052D] hover:bg-[#670A37] transition-colors">
              Call Now
            </button>
            <span className="text-xs text-gray-400 ml-2">Emergency Contact Available</span>
          </div>
        </div>
      </div>
    );
  }

  // ---------- List View ----------
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab("donors")}
            className={`px-6 py-2 rounded-full border transition-all duration-200 ${activeTab === "donors" ? "bg-[#670A37] text-white shadow-md" : "bg-white text-gray-800"}`}
          >
            Blood Donors
          </button>
          <button
            onClick={() => setActiveTab("banks")}
            className={`px-6 py-2 rounded-full border transition-all duration-200 ${activeTab === "banks" ? "bg-[#670A37] text-white shadow-md" : "bg-white text-gray-800"}`}
          >
            Blood Banks
          </button>
          <button
            onClick={() => navigate('/request-blood')}
            className="px-6 py-2 rounded-full bg-[#46052D] text-white border border-[#46052D] hover:bg-[#670A37] transition-all duration-200 shadow-md"
          >
            Request Blood
          </button>
        </div>

        {/* Search Filters for Donors */}
        {activeTab === "donors" && (
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <FaSearch className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
              </div>
              
              <select
                value={searchFilters.bloodType}
                onChange={(e) => handleFilterChange('bloodType', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#670A37]"
              >
                <option value="all">All Blood Types</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>

              <select
                value={searchFilters.district}
                onChange={(e) => handleFilterChange('district', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#670A37]"
              >
                <option value="all">All Districts</option>
                <option value="Kathmandu">Kathmandu</option>
                <option value="Lalitpur">Lalitpur</option>
                <option value="Bhaktapur">Bhaktapur</option>
                <option value="Pokhara">Pokhara</option>
                <option value="Chitwan">Chitwan</option>
              </select>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={searchFilters.isAvailable}
                  onChange={(e) => handleFilterChange('isAvailable', e.target.checked)}
                  className="rounded border-gray-300 text-[#670A37] focus:ring-[#670A37]"
                />
                Available Only
              </label>

              <button
                onClick={resetFilters}
                className="px-4 py-2 text-sm text-[#670A37] border border-[#670A37] rounded-md hover:bg-[#670A37] hover:text-white transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        <h2 className="text-2xl text-center font-bold mb-6 text-left">
          {activeTab === "banks" ? "Available Blood Banks" : "Available Blood Donors"}
          {activeTab === "donors" && (
            <span className="text-lg font-normal text-gray-600 ml-2">
              ({bloodDonors.length} found)
            </span>
          )}
        </h2>

        <div className="flex flex-col space-y-6">
          {loading && (
            <div className="flex justify-center items-center py-8">
              <FaSpinner className="animate-spin text-2xl text-[#46052D]" />
              <span className="ml-2">Searching...</span>
            </div>
          )}

          {!loading && activeTab === "banks" &&
            bloodBanks.map((bank, index) => (
              <div key={bank._id || bank.id || index} className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between hover:shadow-lg transition-shadow duration-300">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{bank.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{bank.address}</p>
                  <p className="text-sm text-gray-500 mb-1">District: {bank.district}</p>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Phone:</span> {bank.contact?.phone || 'N/A'}
                    {bank.contact?.email && (
                      <>
                        <br />
                        <span className="font-medium">Email:</span> {bank.contact.email}
                      </>
                    )}
                    {bank.contact?.emergencyContact && (
                      <>
                        <br />
                        <span className="font-medium">Emergency:</span> {bank.contact.emergencyContact}
                      </>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {Object.entries(bank.bloodInventory || {}).map(([type, units]) => {
                      if (units > 0) {
                        return (
                          <span key={type} className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                            {type}: {units} units
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedBank(bank)}
                  className="bg-[#670A37] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-900 transition-colors duration-200"
                >
                  View details
                </button>
              </div>
            ))}

          {!loading && activeTab === "donors" && bloodDonors.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No donors found matching your criteria.</p>
              <button
                onClick={resetFilters}
                className="mt-2 px-4 py-2 text-[#670A37] border border-[#670A37] rounded-md hover:bg-[#670A37] hover:text-white transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}

          {!loading && activeTab === "donors" &&
            bloodDonors.map((donor) => (
              <div key={donor.id} className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between hover:shadow-lg transition-shadow duration-300">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{donor.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">Blood Type : <span className="font-semibold">{donor.blood_type}</span></p>
                  <p className="text-sm text-gray-600">Location : {donor.location}</p>
                  <p className="text-sm text-gray-600 mt-1">Last Donated : {donor.last_donated}</p>
                  {donor.isAvailable && (
                    <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Available
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedDonor(donor)}
                  className="bg-[#670A37] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-900 transition-colors duration-200"
                >
                  View details
                </button>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};
