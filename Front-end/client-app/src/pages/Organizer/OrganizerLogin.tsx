import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { serverUrl } from '../../helpers/Constant';
import { toast } from 'react-toastify';

interface IOrganizerLoginProps {}

const OrganizerLogin: React.FunctionComponent<IOrganizerLoginProps> = () => {
  const [formData, setFormData] = useState({
    userId: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      console.log("Attempting login...");
      const response = await axios.post(`${serverUrl}/organizer/login`, {
        userId: formData.userId,
        password: formData.password
      });

      console.log("Login response:", response.data);

      if (response.data.success && response.data.accessToken) {
        // Store token and ID
        localStorage.setItem('organizer_token', response.data.accessToken);
        localStorage.setItem('organizerId', response.data.organizerId);
        
        toast.success('Login successful!');
        
        // Use a timeout to ensure localStorage is set before navigation
        setTimeout(() => {
          console.log("Navigating to dashboard...");
          navigate('/organizer/dashboard', { replace: true });
        }, 300);
      } else {
        setError('Invalid response from server');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1d2132] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Welcome Back
          </h2>
          <p className="text-xl text-gray-300">
            Sign in to manage your events
          </p>
        </div>

        {/* Login Form */}
        <motion.div
          className="bg-[#222839] rounded-xl shadow-xl p-8 border border-gray-700"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}
            
            {loading && (
              <div className="text-center text-gray-300">
                Logging in...
              </div>
            )}

            {/* User ID Field */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                User ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-[10px] shadow-sm placeholder-gray-400 bg-[#1d2132] text-white focus:outline-none focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                  required
                  placeholder="Enter your user ID"
                />
                <FaUser className="absolute right-3 top-2.5 text-[#7557e1]" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-[10px] shadow-sm placeholder-gray-400 bg-[#1d2132] text-white focus:outline-none focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                  required
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[#7557e1] hover:text-[#d7ff42] focus:outline-none"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 bg-[#1d2132] border-gray-700 rounded focus:ring-[#d7ff42]"
                  id="remember-me"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-200">
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-[#7557e1] hover:text-[#d7ff42]"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 bg-[#d7ff42] text-[#1d2132] rounded-[10px] font-semibold 
                ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90 transform hover:scale-[1.02]'} 
                transition-all duration-200`}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </motion.div>

        {/* Register Link */}
        <p className="text-center text-gray-300">
          Don't have an account?{' '}
          <Link
            to="/organizer/register"
            className="text-[#7557e1] hover:text-[#d7ff42] font-medium"
          >
            Register now
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default OrganizerLogin;
