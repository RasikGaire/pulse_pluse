import React from 'react'
import { FaFacebookF, FaInstagram, FaWhatsapp, FaEdit } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

export const Profile = () => {
  const navigate = useNavigate();

  const handleRequestBlood = () => {
    navigate('/request-blood');
  };

  const handleEditProfile = () => {
    navigate('/profile-verification');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-sm text-gray-600 mb-3">Profile</h2>
      <div className="bg-white rounded-2xl shadow-md ring-1 ring-black/5 p-8">
        <div className="flex gap-8 items-start">
          <div className="flex-shrink-0 w-full md:w-1/3">
            <div className="w-full aspect-square rounded-full overflow-hidden border-2 border-gray-200">
              <img src="/profile.jpg" alt="Profile picture" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-3xl font-bold">Sandesh Thapa magar </h3>
                <div className="mt-2 text-gray-600 flex flex-wrap gap-x-10 gap-y-1 text-sm">
                  <span>sandesh@gmail.com</span>
                  <span>9863173393</span>
                  <span>Blood Type: A negative</span>
                </div>
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
            <p className="text-lg font-semibold mb-4">My social Media</p>
            <div className="flex gap-6 mb-6">
              <button type="button" aria-label="Facebook" className="flex flex-col items-center gap-2 p-3 border rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-1">
                <FaFacebookF size={28} />
                <span className="text-sm text-gray-600">Facebook</span>
              </button>
              <button type="button" aria-label="Instagram" className="flex flex-col items-center gap-2 p-3 border rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-1">
                <FaInstagram size={28} />
                <span className="text-sm text-gray-600">Instagram</span>
              </button>
              <button type="button" aria-label="WhatsApp" className="flex flex-col items-center gap-2 p-3 border rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-1">
                <FaWhatsapp size={28} />
                <span className="text-sm text-gray-600">WhatsApp</span>
              </button>
            </div>
            <div className="border-t pt-4 text-gray-700">Member of Red Cross Society,</div>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold mt-10 mb-4">Statistics</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Member of community</h4>
          <ul className="text-xs text-gray-600 space-y-2">
            <li className="flex justify-between"><span>Red Cross society</span><span>Jan, 2025</span></li>
            <li className="flex justify-between"><span>Youth Shine club</span><span>Feb, 2024</span></li>
            <li className="flex justify-between"><span>Women Club</span><span>May, 2025</span></li>
            <li className="flex justify-between"><span>Gamer Girl</span><span>Dec, 2025</span></li>
          </ul>
        </div>
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Contribution</h4>
          <div className="grid grid-cols-2 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold">06</div>
              <p className="text-xs text-gray-500 mt-1">Blood donated</p>
              <p className="text-[10px] text-gray-400">Always there to help the one in need</p>
            </div>
            <div>
              <div className="text-4xl font-bold">32</div>
              <p className="text-xs text-gray-500 mt-1">Volunteer</p>
              <p className="text-[10px] text-gray-400">Always there to help the one in need</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Contact me</h4>
          <dl className="text-xs text-gray-600 space-y-2">
            <div className="flex justify-between"><dt>Email</dt><dd>sunflower@gmail.com</dd></div>
            <div className="flex justify-between"><dt>Phone no</dt><dd>+911 9828732942</dd></div>
            <div className="flex justify-between"><dt>Address</dt><dd>Nawalparasi, Kawasoti</dd></div>
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


