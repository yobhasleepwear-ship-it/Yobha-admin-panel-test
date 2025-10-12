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

      navigate("/home"); // Redirect to home/dashboard
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#fdf6f0] via-[#faf4f0] to-[#f8eee8] px-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleLogin}
          className="bg-white backdrop-blur-md bg-opacity-80 shadow-xl rounded-2xl p-8 sm:p-10 space-y-6"
        >
          <h2 className="text-3xl font-serif font-bold text-gray-800 text-center mb-4">
            Welcome Back
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Log in to access your Yobha Admin account
          </p>

          {error && (
            <p className="text-red-500 text-center font-medium">{error}</p>
          )}

          <div className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#ea5430] focus:outline-none transition"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#ea5430] focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ea5430] hover:bg-[#d14320] text-white font-semibold py-3 rounded-lg shadow-md transition-all"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          <p className="text-center text-gray-500 mt-4 text-sm">
            Don't have an account?{" "}
            <span
              className="text-[#ea5430] font-semibold cursor-pointer hover:underline"
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
