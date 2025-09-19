import { useState, useEffect } from "react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { fetchBloodDonors, fetchBloodBanks } from "../api/mockData";

export const FindDonor = () => {
  const [activeTab, setActiveTab] = useState("banks");
  const [bloodDonors, setBloodDonors] = useState([]);
  const [bloodBanks, setBloodBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);

  useEffect(() => {
    setLoading(true);

    // Fetch mock data
    Promise.all([fetchBloodDonors(), fetchBloodBanks()])
      .then(([donorsData, banksData]) => {
        const enrichedDonors = donorsData.map((donor) => ({
          ...donor,
          email: `${donor.name.split(" ").join("").toLowerCase()}@example.com`,
          communities: [
            { name: "Red Cross Society", joined: "Jan, 2025" },
            { name: "Youth Shine Club", joined: "Feb, 2024" },
          ],
          contributions: { bloodDonated: Math.floor(Math.random() * 10), volunteer: Math.floor(Math.random() * 50) },
          profileImage: "/profile.jpg",
          social: { facebook: "#", instagram: "#", whatsapp: "#" },
        }));
        setBloodDonors(enrichedDonors);
        setBloodBanks(banksData);
      })
      .finally(() => setLoading(false));

    // REAL API Integration example:
    // fetch("https://yourapi.com/blood-donors")
    //   .then(res => res.json())
    //   .then(data => setBloodDonors(data))
    //   .catch(err => console.error(err));
    //
    // fetch("https://yourapi.com/blood-banks")
    //   .then(res => res.json())
    //   .then(data => setBloodBanks(data))
    //   .catch(err => console.error(err));

  }, []);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading data...</p>;

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
                <button className="px-5 py-2 rounded-md border text-sm hover:bg-gray-100">Request Blood</button>
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
          <h3 className="text-3xl font-bold mb-4">{bank.name}</h3>
          <p className="text-sm text-gray-600 mb-2">Address: {bank.address}</p>
          <p className="text-sm text-gray-600 mb-4">Contact: {bank.contact}</p>
          <h4 className="text-lg font-semibold mb-2">Blood Availability</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {Object.entries(bank.availability).map(([type, units], i) => (
              <div key={i} className="bg-red-50 text-red-800 p-4 rounded-lg text-center shadow-sm">
                <div className="text-lg font-bold">{units}</div>
                <div className="text-xs">{type}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 justify-start">
            <button className="px-5 py-2 rounded-md border text-sm hover:bg-gray-100">Request Blood</button>
            <button className="px-5 py-2 rounded-md text-white text-sm bg-[#46052D] hover:bg-[#670A37]">Call Now</button>
            <span className="text-[10px] text-gray-400 ml-2">Emergency Contact</span>
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
        </div>

        <h2 className="text-2xl text-center font-bold mb-6 text-left">
          {activeTab === "banks" ? "Available Blood Banks" : "Available Blood Donors"}
        </h2>

        <div className="flex flex-col space-y-6">
          {activeTab === "banks" &&
            bloodBanks.map((bank) => (
              <div key={bank.id} className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between hover:shadow-lg transition-shadow duration-300">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{bank.name}</h3>
                  <p className="text-sm text-gray-600">{bank.address}</p>
                  <p className="text-sm text-gray-600 mt-1">Contact Number : {bank.contact}</p>
                </div>
                <button
                  onClick={() => setSelectedBank(bank)}
                  className="bg-[#670A37] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-900 transition-colors duration-200"
                >
                  View details
                </button>
              </div>
            ))}

          {activeTab === "donors" &&
            bloodDonors.map((donor) => (
              <div key={donor.id} className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between hover:shadow-lg transition-shadow duration-300">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{donor.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">Blood Type : <span className="font-semibold">{donor.blood_type}</span></p>
                  <p className="text-sm text-gray-600">Location : {donor.location}</p>
                  <p className="text-sm text-gray-600 mt-1">Last Donated : {donor.last_donated}</p>
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
