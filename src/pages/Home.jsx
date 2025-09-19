import { useEffect, useState } from "react";
import { FaHandHoldingDroplet, FaWarehouse, FaTruckMedical } from "react-icons/fa6";
import '../style/Home.css';

export const Home = () => {
  const [districts, setDistricts] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [bloodGroups, setBloodGroups] = useState([]);

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedHospital, setSelectedHospital] = useState("");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("");
  const [date, setDate] = useState("");

  // Fetch districts
  useEffect(() => {
    fetch("http://localhost:5000/districts")
      .then((res) => res.json())
      .then((data) => setDistricts(data))
      .catch((err) => console.error("Error fetching districts:", err));
  }, []);

  // Fetch blood groups
  useEffect(() => {
    fetch("http://localhost:5000/bloodGroups")
      .then((res) => res.json())
      .then((data) => setBloodGroups(data))
      .catch((err) => console.error("Error fetching blood groups:", err));
  }, []);

  // Fetch hospitals when district changes
  useEffect(() => {
    if (selectedDistrict) {
      fetch(`http://localhost:5000/hospitals?districtId=${selectedDistrict}`)
        .then((res) => res.json())
        .then((data) => setHospitals(data))
        .catch((err) => console.error("Error fetching hospitals:", err));
    }
  }, [selectedDistrict]);

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
              onChange={(e) => setSelectedDistrict(e.target.value)}
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
            <button className="btn-primary">Be a Donor</button>
            <button className="btn-secondary">Find Donor</button>
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
