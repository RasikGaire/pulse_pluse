import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHandHoldingDroplet, FaWarehouse, FaTruckMedical } from "react-icons/fa6";
import '../style/Home.css';

export const Home = () => {
  const navigate = useNavigate();
  
  // Static data for demonstration
  const districts = [
    { id: 1, name: "Kathmandu" },
    { id: 2, name: "Lalitpur" },
    { id: 3, name: "Bhaktapur" },
    { id: 4, name: "Pokhara" },
    { id: 5, name: "Chitwan" }
  ];

  const bloodGroups = [
    "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
  ];

  const [hospitals, setHospitals] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedHospital, setSelectedHospital] = useState("");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("");
  const [date, setDate] = useState("");

  // Mock hospitals data based on selected district
  const getHospitalsForDistrict = (districtId) => {
    const hospitalData = {
      1: [
        { id: 1, name: "Tribhuvan University Teaching Hospital" },
        { id: 2, name: "Bir Hospital" },
        { id: 3, name: "Nepal Medical College" },
        { id: 12, name: "Grande International Hospital" },
        { id: 13, name: "Om Hospital & Research Center" }
      ],
      2: [
        { id: 4, name: "Patan Hospital" },
        { id: 5, name: "Lalitpur Hospital" },
        { id: 14, name: "Alka Hospital" },
        { id: 15, name: "Sumeru Hospital" },
        { id: 16, name: "Norvic International Hospital" }
      ],
      3: [
        { id: 6, name: "Bhaktapur Hospital" },
        { id: 7, name: "Bhaktapur Medical College" },
        { id: 17, name: "Khwopa Hospital" },
        { id: 18, name: "Madhyapur Hospital" },
        { id: 19, name: "Siddhi Memorial Hospital" }
      ],
      4: [
        { id: 8, name: "Pokhara Hospital" },
        { id: 9, name: "Manipal Teaching Hospital" },
        { id: 20, name: "Western Regional Hospital" },
        { id: 21, name: "Gandaki Medical College" },
        { id: 22, name: "Fishtail Hospital" }
      ],
      5: [
        { id: 10, name: "Chitwan Medical College" },
        { id: 11, name: "Bharatpur Hospital" },
        { id: 23, name: "College of Medical Sciences" },
        { id: 24, name: "Narayani Hospital" },
        { id: 25, name: "Chitwan Valley Medical College" }
      ]
    };
    return hospitalData[districtId] || [];
  };

  // Handle district change
  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    setSelectedDistrict(districtId);
    setSelectedHospital("");
    setHospitals(getHospitalsForDistrict(parseInt(districtId)));
  };

  // Handle button clicks to navigate to FindDonor page
  const handleBeADonor = () => {
    navigate('/find-donor?tab=donors');
  };

  const handleFindDonor = () => {
    navigate('/find-donor?tab=banks');
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-background">
          <img src="/Adobe Express - file (2) 1.png" alt="Heart" className="heart-overlay" />
        </div>
        <div className="hero-content">
          <h1>Save Life, Donate Blood</h1>
          <p>
            With just a single donation, you can give someone a second chance at life.
            Sign up today and be the hero someone desperately needs.
          </p>

          <div className="filters">
            <select
              value={selectedDistrict}
              onChange={handleDistrictChange}
            >
              <option value="">Select District</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            <select
              value={selectedHospital}
              onChange={(e) => setSelectedHospital(e.target.value)}
              disabled={!selectedDistrict}
            >
              <option value="">Select Hospital</option>
              {hospitals.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>

            <select
              value={selectedBloodGroup}
              onChange={(e) => setSelectedBloodGroup(e.target.value)}
            >
              <option value="">Select Blood Type</option>
              {bloodGroups.map((bg, idx) => (
                <option key={idx} value={bg}>
                  {bg}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="hero-buttons">
            <button className="btn-primary" onClick={handleBeADonor}>Be a Donor</button>
            <button className="btn-secondary" onClick={handleFindDonor}>Find Donor</button>
          </div>
        </div>
      </section>
      
      {/* We saves Life gallery (placed before footer) */}


      {/* Mission + How to get Blood */}
      <section className="mx-auto max-w-6xl px-4 py-10 py-5">
        {/* Our Mission */}
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-6 md:p-8 mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Our Mission</h2>
          <p className="text-sm leading-6 text-gray-600">
            Our mission is to save lives by creating a reliable, accessible, and efficient blood donation
            system that connects voluntary donors with patients in need. We aim to ensure timely
            availability of safe blood, promote awareness about the importance of regular donation,
            and build a strong network of compassionate individuals and organizations working together
            for a healthier society.
          </p>
        </div>

        {/* How to get Blood */}
        <h3 className="text-3xl font-semibold text-gray-900 mb-8 pb-5">How to get Blood?</h3>

         <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2    items-end gap-y-6 md:gap-y-8">
          {/* Step 1 - top center */}
          <div className="relative flex flex-col items-center text-center md:col-start-2 md:row-start-1 md:justify-self-center -mt-6 fade-in-up anim-delay-100">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white ring-2 ring-gray-300 shadow-sm flex items-center justify-center font-semibold">1</div>
            <div className="w-56 h-56 md:w-72 md:h-72 rounded-full bg-white ring-1 ring-black/5 shadow-md flex items-center justify-center transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="px-6">
                <FaHandHoldingDroplet className="mx-auto mb-3 text-[#46052D]" size={44} />
                <h4 className="font-semibold text-gray-800">Blood Collection</h4>
                <p className="text-xs text-gray-500 mt-2">
                  People register and donate blood. The system stores donors details.
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 - bottom left */}
          <div className="relative flex flex-col items-center text-center md:col-start-1 md:row-start-2 md:-mt-14 fade-in-up anim-delay-200">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white ring-2 ring-gray-300 shadow-sm flex items-center justify-center font-semibold">2</div>
            <div className="w-56 h-56 md:w-72 md:h-72 rounded-full bg-white ring-1 ring-black/5 shadow-md flex items-center justify-center transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="px-6">
                <FaWarehouse className="mx-auto mb-3 text-[#46052D]" size={48} />
                <h4 className="font-semibold text-gray-800">Blood Storage</h4>
                <p className="text-xs text-gray-500 mt-2">
                  Blood is categorized by group. The system tracks quality and expiry of each unit.
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 - bottom right */}
          <div className="relative flex flex-col items-center text-center md:col-start-3 md:row-start-2 md:-mt-14 fade-in-up anim-delay-300">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white ring-2 ring-gray-300 shadow-sm flex items-center justify-center font-semibold">3</div>
            <div className="w-56 h-56 md:w-64 md:h-64 rounded-full bg-white ring-1 ring-black/5 shadow-md flex items-center justify-center transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="px-6">
                <FaTruckMedical className="mx-auto mb-3 text-[#46052D]" size={44} />
                <h4 className="font-semibold text-gray-800">Blood Distribution and access</h4>
                <p className="text-xs text-gray-500 mt-2">
                  Requests are matched with the right donor blood and delivered to patients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h3 className="text-3xl md:text-2xl font-semibold text-[#46052D] mb-4">We saves Life</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left tall image */}
          <div className="md:col-span-1">
            <img src="/we_saves_lifes/luann-hunt-X20g2GQsVdA-unsplash 1.png" alt="Donation in action" className="w-full h-[260px] md:h-[300px] object-cover rounded-md shadow-sm fade-in-up anim-delay-100 transition-transform duration-300 hover:scale-[1.01]" />
          </div>
          {/* Right collage */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <img src="/we_saves_lifes/jason-leung-BXAnnFhEs4o-unsplash 1.png" alt="Community support" className="w-full h-[120px] md:h-[140px] object-cover rounded-md shadow-sm fade-in-up anim-delay-200 transition-transform duration-300 hover:scale-[1.01]" />
            </div>
            <div>
              <img src="/we_saves_lifes/faezeh-eslami-Btja3lr5ldk-unsplash 1.png" alt="Blood bags" className="w-full h-[120px] md:h-[140px] object-cover rounded-md shadow-sm fade-in-up anim-delay-300 transition-transform duration-300 hover:scale-[1.01]" />
            </div>
            <div>
              <img src="/we_saves_lifes/joshua-onadipe-hhGKRVQIMSM-unsplash 1.png" alt="Donor details" className="w-full h-[120px] md:h-[140px] object-cover rounded-md shadow-sm fade-in-up anim-delay-400 transition-transform duration-300 hover:scale-[1.01]" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
