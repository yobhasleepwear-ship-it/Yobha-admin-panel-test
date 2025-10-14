import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginUser } from "../../service/login";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loginResponse = await LoginUser(formData);

      localStorage.setItem("token", loginResponse.token);
      localStorage.setItem("refreshToken", loginResponse.refreshToken);

      navigate("/products"); // Redirect to products page
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-premium-cream px-4 py-8"
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      <div className="w-full max-w-md mx-auto">
        <form
          onSubmit={handleLogin}
          className="bg-premium-white border border-text-light/20 shadow-lg p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6"
        >
          <div className="flex justify-center items-center mb-6 sm:mb-8">
            <img
              src={require("../../assets/YOBHA_logo_final.png")}
              alt="YOBHA Admin Logo"
              className="h-6 sm:h-8 md:h-10"
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-black text-center mb-3 sm:mb-4 uppercase tracking-wider">
            Admin Login
          </h2>
          <p className="text-center text-text-medium mb-4 sm:mb-6 text-xs sm:text-sm">
            Access the YOBHA Admin Panel
          </p>

          {error && (
            <p className="text-red-500 text-center font-medium text-xs sm:text-sm">{error}</p>
          )}

          <div className="space-y-3 sm:space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-text-light/30 focus:border-black focus:outline-none text-black bg-white placeholder:text-text-light text-sm rounded-md"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-text-light/30 focus:border-black focus:outline-none text-black bg-white placeholder:text-text-light text-sm rounded-md"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 sm:py-4 bg-black text-white font-semibold hover:bg-text-dark transition-colors uppercase tracking-wider text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <p className="text-center text-text-medium mt-3 sm:mt-4 text-xs sm:text-sm">
            Don't have an account?{" "}
            <span
              className="text-black font-semibold cursor-pointer hover:text-luxury-gold transition-colors underline"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
