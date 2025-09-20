
import React, { useState, useEffect } from 'react';

export const Contact = () => {
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success"); // "success" or "error"

  // Auto-close popup after 5 seconds
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Validate inputs
  const validate = () => {
    let tempErrors = {};

    if (!formData.firstName.trim()) tempErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) tempErrors.lastName = "Last name is required";
    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is invalid";
    }
    if (formData.phone && !/^\+?\d{7,15}$/.test(formData.phone)) {
      tempErrors.phone = "Enter a valid phone number";
    }
    if (!formData.message.trim()) tempErrors.message = "Message is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await fetch('http://localhost:5000/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (data.success) {
          setPopupMessage("Thank you for contacting us! We will get back to you soon.");
          setPopupType("success");
          setShowPopup(true);
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            message: "",
          });
          setErrors({});
        } else {
          setPopupMessage(data.message || "Failed to submit your message. Please try again.");
          setPopupType("error");
          setShowPopup(true);
        }
      } catch (error) {
        console.error('Error submitting contact form:', error);
        setPopupMessage("Failed to submit your message. Please check your connection and try again.");
        setPopupType("error");
        setShowPopup(true);
      }
    }
  };

  return (
      <div className="bg-white-50 min-h-screen px-6 py-16 flex items-center justify-center">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Side - Form */}
        <div className="lg:col-span-7 bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Contact Us</h2>
          <p className="text-gray-600 mb-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua.
          </p>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
              {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName}</span>}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
              {errors.lastName && <span className="text-red-500 text-sm">{errors.lastName}</span>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
              {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
              {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
            </div>

            {/* Message */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What do you have in mind?
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                placeholder="Please enter query..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              ></textarea>
              {errors.message && <span className="text-red-500 text-sm">{errors.message}</span>}
            </div>

            {/* Submit Button */}
           <div className="md:col-span-2">
              <button type="submit"
              className="w-full bg-[#670A37] text-white py-3 rounded-xl hover:bg-[#52082B] transition">
                Submit
              </button>

            </div>
          </form>
        </div>

        {/* Right Side - Contact Info */}
        <div className="lg:col-span-5 bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua.
          </p>

          <div className="space-y-6">
            <div className="flex items-center">
              <img
                src="https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/ET21.jpg"
                alt="phone"
                className="w-6 h-6 mr-3"
              />
              <span className="text-gray-700">+1258 3258 5679</span>
            </div>

            <div className="flex items-center">
              <img
                src="https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/ET22.jpg"
                alt="email"
                className="w-6 h-6 mr-3"
              />
              <span className="text-gray-700">hello@workik.com</span>
            </div>

            <div className="flex items-center">
              <img
                src="https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/ET23.jpg"
                alt="address"
                className="w-6 h-6 mr-3"
              />
              <span className="text-gray-700">102 street, y cross 485656</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex space-x-4 mt-8">
            <a href="#">
              <img
                src="https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/gray-mail.svg"
                alt="mail"
                className="w-6 h-6"
              />
            </a>
            <a href="#">
              <img
                src="https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/gray-twitter.svg"
                alt="twitter"
                className="w-6 h-6"
              />
            </a>
            <a href="#">
              <img
                src="https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/gray-insta.svg"
                alt="instagram"
                className="w-6 h-6"
              />
            </a>
            <a href="#">
              <img
                src="https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/gray-fb.svg"
                alt="facebook"
                className="w-6 h-6"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="text-center">
              {popupType === "success" ? (
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              ) : (
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
              )}
              
              <h3 className={`text-lg font-semibold mb-2 ${popupType === "success" ? "text-green-800" : "text-red-800"}`}>
                {popupType === "success" ? "Message Sent!" : "Error"}
              </h3>
              
              <p className="text-gray-600 mb-4">
                {popupMessage}
              </p>
              
              <button
                onClick={() => setShowPopup(false)}
                className={`px-6 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 ${
                  popupType === "success" 
                    ? "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500" 
                    : "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
