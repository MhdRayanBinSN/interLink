import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaBuilding, FaPhone, FaEye, FaEyeSlash, FaLink } from 'react-icons/fa';
import axios from 'axios';
import { serverUrl } from '../../helpers/Constant';

const OrganizerRegister: React.FC = () => {
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: 'educational',
    contactPerson: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    website: '',
    userId: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation
    if (!formData.organizationName || !formData.email || !formData.password || !formData.userId) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
    
      const response = await axios.post(`${serverUrl}/organizer/register`, {
        organizationName: formData.organizationName,
        organizationType: formData.organizationType,
        contactPerson: formData.contactPerson,
        email: formData.email.toLowerCase(),
        phone: formData.phone,
        password: formData.password,
        userId: formData.userId,
        website: formData.website || undefined
      });

      if (response.data.success) {
        setSuccess(true);
        console.log('Registration successful:', response.data);
        setTimeout(() => {
          window.location.href = '/organizer/login';
        }, 2000);
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(
        err.response?.data?.message || 
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-[#1d2132] py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Register as Event Organizer
          </h2>
          <p className="text-xl text-gray-300">
            Create and manage technical events, workshops, and competitions
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Organization Details Card */}
          <motion.div 
            className="bg-[#222839] rounded-xl shadow-xl p-6 overflow-hidden border border-gray-700"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center mb-6">
              <FaBuilding className="text-2xl text-[#7557e1] mr-3" />
              <h3 className="text-xl font-semibold text-white">Organization Details</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Organization Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-[10px] shadow-sm placeholder-gray-400 bg-[#1d2132] text-white focus:outline-none focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                    required
                  />
                  <FaBuilding className="absolute right-3 top-3.5 text-[#7557e1]" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Organization Type
                </label>
                <select
                  name="organizationType"
                  value={formData.organizationType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-700 rounded-[10px] bg-[#1d2132] text-white focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent transition-all"
                  required
                >
                 
                  <option value="educational">Educational Institution</option>
                  <option value="tech-company">Tech Company</option>
                  <option value="non-profit">Non-Profit Organization</option>
                  <option value="community">Tech Community</option>
                  <option value="individual">Individual</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Website
                </label>
                <div className="relative">
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-[10px] shadow-sm placeholder-gray-400 bg-[#1d2132] text-white focus:outline-none focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                    placeholder="https://"
                  />
                  <FaLink className="absolute right-3 top-2.5 text-[#7557e1]" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Person Details Card */}
          <motion.div 
            className="bg-[#222839] rounded-xl shadow-xl p-6 overflow-hidden border border-gray-700"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center mb-6">
              <FaUser className="text-2xl text-[#7557e1] mr-3" />
              <h3 className="text-xl font-semibold text-white">Contact Person Details</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Contact Person Name
                </label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-[10px] shadow-sm placeholder-gray-400 bg-[#1d2132] text-white focus:outline-none focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                    required
                  />
                  <FaUser className="absolute right-3 top-2.5 text-[#7557e1]" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-[10px] shadow-sm placeholder-gray-400 bg-[#1d2132] text-white focus:outline-none focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                    required
                  />
                  <FaEnvelope className="absolute right-3 top-2.5 text-[#7557e1]" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Phone Number
                </label>
                <div className="mt-1 relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-[10px] shadow-sm placeholder-gray-400 bg-[#1d2132] text-white focus:outline-none focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                    required
                  />
                  <FaPhone className="absolute right-3 top-2.5 text-[#7557e1]" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Account Details Card */}
          <motion.div 
            className="bg-[#222839] rounded-xl shadow-xl p-6 overflow-hidden border border-gray-700"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center mb-6">
              <FaLock className="text-2xl text-[#7557e1] mr-3" />
              <h3 className="text-xl font-semibold text-white">Account Details</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {/* User ID Field */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-200">
                  User ID
                </label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-[10px] shadow-sm placeholder-gray-400 bg-[#1d2132] text-white focus:outline-none focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                    required
                    placeholder="Choose a unique username"
                  />
                  <FaUser className="absolute right-3 top-2.5 text-[#7557e1]" />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  This will be your login username
                </p>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-[10px] shadow-sm placeholder-gray-400 bg-[#1d2132] text-white focus:outline-none focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-[10px] shadow-sm placeholder-gray-400 bg-[#1d2132] text-white focus:outline-none focus:ring-2 focus:ring-[#d7ff42] focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button
              type="submit"
              className="w-full py-4 px-6 bg-[#d7ff42] text-[#1d2132] rounded-[10px] font-semibold text-lg hover:bg-opacity-90 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
            >
              Create Account
            </button>
          </motion.div>
        </form>

        {error && (
          <div className="text-red-500 text-center mt-4">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-white text-center mt-4">
            Processing registration...
          </div>
        )}

        {/* Sign In Link */}
        <div className="text-center">
          <Link
            to="/organizer/login"
            className="text-white hover:text-gray-300 transition-colors"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default OrganizerRegister;
