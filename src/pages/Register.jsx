// Register.jsx
import { useState } from "react";
import { FaApple, FaEye, FaEyeSlash } from "react-icons/fa";
// If using React Router for redirect
// import { useNavigate } from "react-router-dom";

export const Register = () => {
  // const navigate = useNavigate(); // for redirecting after success

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // ✅ Basic validations
    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill out all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // 🔹 Replace this with your backend API endpoint
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // 🔹 Payload expected by backend (adjust if needed)
        body: JSON.stringify({ 
          name: fullName, 
          email, 
          password 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      setSuccess("Registration successful! Redirecting...");
      console.log("✅ Registered:", data);

      // 🔹 Redirect to login after successful signup
      // setTimeout(() => navigate("/login"), 1500);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans antialiased text-gray-800 bg-gray-50">
      <div className="flex flex-col md:flex-row min-h-screen">
        
        {/* Left Section (Register Form) */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 md:p-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#46052D] mb-2 text-center">
              Create Your Account
            </h1>
            <p className="text-gray-600 mb-8 text-center">
              Sign up to get started and explore your personalized dashboard.
            </p>

            <form onSubmit={handleRegister} className="space-y-6">
              
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="fullName">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#46052D]"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#46052D]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#46052D] pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#46052D]"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Error / Success Messages */}
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}

              {/* Submit */}
              <button
                type="submit"
                className={`w-full py-3 px-6 text-white font-semibold rounded-xl transition duration-300 transform hover:scale-105 ${
                  loading ? "opacity-80 cursor-not-allowed" : "hover:opacity-95"
                }`}
                style={{ backgroundColor: "#46052D" }}
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>

              {/* Divider */}
              <div className="flex items-center space-x-2">
                <hr className="flex-grow border-gray-300" />
                <span className="text-gray-500 text-sm">OR</span>
                <hr className="flex-grow border-gray-300" />
              </div>

              {/* Social Buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 border border-gray-300 rounded-xl hover:bg-gray-50"
                  disabled={loading}
                >
                  <img
                    src="https://www.svgrepo.com/show/355037/google.svg"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  Continue with Google
                </button>
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 border border-gray-300 rounded-xl bg-gray-900 text-white hover:bg-gray-800"
                  disabled={loading}
                >
                  <FaApple size={18} />
                  Continue with Apple
                </button>
              </div>
            </form>

            {/* Redirect to Login */}
            <p className="text-sm mt-6 text-center text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="text-[#46052D] hover:underline font-medium">
                Sign In
              </a>
            </p>
          </div>
        </div>

        {/* Right Section (Image & Branding) */}
        <div
          className="hidden md:flex flex-1 items-center justify-center p-16 bg-cover bg-center rounded-l-3xl shadow-lg relative overflow-hidden"
          style={{ backgroundImage: "url(/Register.png)" }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
      </div>
    </div>
  );
};
