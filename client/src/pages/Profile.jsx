import React, { useEffect, useState, useRef } from 'react'
import { FaFacebookF, FaInstagram, FaWhatsapp, FaEdit, FaSpinner, FaTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export const Profile = () => {
  const navigate = useNavigate();
  const { user, fetchProfile, token, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const hasLoadedProfile = useRef(false);

  useEffect(() => {
    console.log('Profile: useEffect triggered with:', { authLoading, user: !!user, token: !!token, hasLoaded: hasLoadedProfile.current });
    
    const loadProfileData = async () => {
      try {
        console.log('Profile: Starting loadProfile...');
        setLoading(true);
        const result = await fetchProfile();
        console.log('Profile: fetchProfile result:', result);
        if (result.success) {
          setProfileData(result.data);
          setError(null);
          console.log('Profile: Profile data set successfully');
        } else {
          setError(result.error);
          console.log('Profile: Error from fetchProfile:', result.error);
        }
      } catch (err) {
        console.log('Profile: Exception in loadProfile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
        console.log('Profile: Loading set to false');
      }
    };

    if (!authLoading) {
      if (!user || !token) {
        console.log('Profile: No user/token, redirecting to login');
        navigate('/login');
        return;
      }
      // Only load profile once when user is authenticated and we haven't loaded it yet
      if (user && token && !hasLoadedProfile.current) {
        console.log('Profile: User authenticated, calling loadProfile');
        hasLoadedProfile.current = true;
        loadProfileData();
      }
    }
  }, [authLoading, user, token, navigate, fetchProfile]);

  const handleRequestBlood = () => {
    navigate('/request-blood');
  };

  const handleEditProfile = () => {
    navigate('/profile-verification');
  };

  const handleRetry = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchProfile();
      if (result.success) {
        setProfileData(result.data);
      } else {
        setError(result.error);
      }
    } catch {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const getSocialMediaIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return <FaFacebookF size={28} />;
      case 'instagram': return <FaInstagram size={28} />;
      case 'whatsapp': return <FaWhatsapp size={28} />;
      case 'twitter': return <FaTwitter size={28} />;
      case 'linkedin': return <FaLinkedin size={28} />;
      case 'youtube': return <FaYoutube size={28} />;
      default: return <FaFacebookF size={28} />;
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 flex justify-center items-center min-h-64">
        <FaSpinner className="animate-spin text-4xl text-[#46052D]" />
        <span className="ml-3 text-lg">Loading profile...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error: {error}</p>
          <button 
            onClick={handleRetry}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const userData = profileData || user;

  // Debug: Check if profile picture data is available
  console.log('Profile: userData.profilePicture:', userData?.profilePicture ? 'Has data' : 'No data');
  console.log('Profile: profilePicture length:', userData?.profilePicture?.length || 0);

  if (!userData) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-600">No profile data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-sm text-gray-600 mb-3">Profile</h2>
      <div className="bg-white rounded-2xl shadow-md ring-1 ring-black/5 p-8">
        <div className="flex gap-8 items-start">
          <div className="flex-shrink-0 w-full md:w-1/3">
            <div className="w-full aspect-square rounded-full overflow-hidden border-2 border-gray-200">
              <img 
                src={userData.profilePicture && userData.profilePicture.trim() !== '' 
                  ? userData.profilePicture 
                  : "/profile.jpg"
                } 
                alt="Profile picture" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.log('Profile image failed to load, using fallback');
                  e.target.src = "/profile.jpg";
                }}
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-3xl font-bold">{userData.fullName || 'User Name'}</h3>
                <div className="mt-2 text-gray-600 flex flex-wrap gap-x-10 gap-y-1 text-sm">
                  <span>{userData.email || 'No email'}</span>
                  <span>{userData.phone || 'No phone'}</span>
                  <span>Blood Type: {userData.bloodType || 'Not specified'}</span>
                </div>
                {userData.isDonor && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active Donor
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={handleEditProfile}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#46052D] border border-[#46052D] rounded-lg hover:bg-[#46052D] hover:text-white transition duration-200"
              >
                <FaEdit size={16} />
                Edit Profile
              </button>
            </div>

            <hr className="my-6 border-gray-200" />
            
            {/* Description */}
            {userData.description && (
              <div className="mb-6">
                <p className="text-gray-700">{userData.description}</p>
              </div>
            )}

            {/* Social Media */}
            <p className="text-lg font-semibold mb-4">My social Media</p>
            <div className="flex gap-6 mb-6">
              {userData.socialMedia && Object.entries(userData.socialMedia).map(([platform, url]) => {
                if (!url) return null;
                return (
                  <a
                    key={platform}
                    href={url.startsWith('http') ? url : `https://${url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 p-3 border rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-1 transition duration-200"
                  >
                    {getSocialMediaIcon(platform)}
                    <span className="text-sm text-gray-600 capitalize">{platform}</span>
                  </a>
                );
              })}
              {(!userData.socialMedia || Object.values(userData.socialMedia).every(url => !url)) && (
                <p className="text-gray-500 text-sm">No social media links added</p>
              )}
            </div>
            
            {/* Communities */}
            <div className="border-t pt-4 text-gray-700">
              {userData.communities && userData.communities.length > 0 ? (
                <div>
                  <span>Member of </span>
                  {userData.communities.map((community, index) => (
                    <span key={index}>
                      {community.name}
                      {index < userData.communities.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              ) : (
                <span>Not a member of any communities yet</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold mt-10 mb-4">Statistics</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Member of community</h4>
          {userData.communities && userData.communities.length > 0 ? (
            <ul className="text-xs text-gray-600 space-y-2">
              {userData.communities.map((community, index) => (
                <li key={index} className="flex justify-between">
                  <span>{community.name}</span>
                  <span>{formatDate(community.joinedDate)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-500">No communities joined yet</p>
          )}
        </div>
        
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Contribution</h4>
          <div className="grid grid-cols-2 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold">
                {userData.donationStats?.totalDonations || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">Blood donated</p>
              <p className="text-[10px] text-gray-400">
                {userData.donationStats?.lastDonationDate 
                  ? `Last: ${formatDate(userData.donationStats.lastDonationDate)}`
                  : 'Ready to help save lives'
                }
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold">
                {userData.donationStats?.volunteerHours || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">Volunteer hours</p>
              <p className="text-[10px] text-gray-400">Always there to help the one in need</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Contact me</h4>
          <dl className="text-xs text-gray-600 space-y-2">
            <div className="flex justify-between">
              <dt>Email</dt>
              <dd>{userData.email || 'Not provided'}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Phone no</dt>
              <dd>{userData.phone || 'Not provided'}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Address</dt>
              <dd>{userData.address || 'Not provided'}</dd>
            </div>
            {userData.district && (
              <div className="flex justify-between">
                <dt>District</dt>
                <dd>{userData.district}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-4 mt-6 flex items-center gap-3 justify-end">
        <button 
          onClick={handleRequestBlood}
          className="px-5 py-2 rounded-md border text-sm hover:bg-gray-50 transition duration-200"
        >
          Request Blood
        </button>
        <button className="px-5 py-2 rounded-md text-white text-sm" style={{background:'#46052D'}}>Call Now</button>
        <span className="text-[10px] text-gray-400 ml-2">Use in case of emergency</span>
      </div>
    </div>
  )
}


