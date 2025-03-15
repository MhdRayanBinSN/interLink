import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Key, Eye, EyeOff, Loader, Check, AlertCircle, X } from 'lucide-react';
import axios from 'axios';
import { serverUrl } from '../../../helpers/Constant';
import toast, { Toaster } from 'react-hot-toast';

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  general?: string;
}

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Password visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  const validatePassword = (password: string): { valid: boolean; message?: string } => {
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters long' };
    }
    
    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }
    
    // Check for at least one number
    if (!/[0-9]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one number' };
    }
    
    return { valid: true };
  };
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;
    
    // Validate current password
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
      isValid = false;
    }
    
    // Validate new password
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
      isValid = false;
    } else {
      const passwordCheck = validatePassword(formData.newPassword);
      if (!passwordCheck.valid) {
        newErrors.newPassword = passwordCheck.message;
        isValid = false;
      }
    }
    
    // Validate confirm password
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await axios.put(
        `${serverUrl}/user/change-password`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        // Show success message
        toast.custom((t) => (
          <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#1d2132] to-[#222839] border border-green-500/20 shadow-lg rounded-lg">
            <div className="rounded-full bg-green-500/10 p-1">
              <Check className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-white font-medium">Password changed successfully!</p>
            <button 
              onClick={() => toast.dismiss(t.id)}
              className="ml-auto text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ), { duration: 5000 });
        
        // Redirect to profile after a short delay
        setTimeout(() => {
          navigate('/dashboard/profile');
        }, 2000);
      } else {
        setErrors({
          general: response.data.error || 'Failed to change password'
        });
      }
    } catch (err: any) {
      console.error('Error changing password:', err);
      
      if (err.response?.status === 401) {
        setErrors({
          currentPassword: 'Current password is incorrect'
        });
      } else {
        setErrors({
          general: err.response?.data?.error || 'An error occurred while changing your password'
        });
      }
      
      toast.error(err.response?.data?.error || 'Failed to change password');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#1d2132] py-8">
      <Toaster position="top-center" />
      <div className="max-w-md mx-auto px-4">
        <button 
          onClick={() => navigate('/dashboard/profile')}
          className="mb-6 flex items-center text-[#7557e1] hover:text-[#d7ff42] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Profile
        </button>
        
        <div className="bg-[#222839] rounded-xl p-8 border border-gray-700/50 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-[#7557e1]/10 flex items-center justify-center">
              <Key className="w-6 h-6 text-[#7557e1]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Change Password</h1>
              <p className="text-gray-400">Update your account password</p>
            </div>
          </div>
          
          {errors.general && (
            <div className="mb-6 p-4 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20 flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <p>{errors.general}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 ml-1 mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-[#1d2132] text-white border ${
                    errors.currentPassword ? 'border-red-500' : 'border-gray-700/50'
                  } rounded-lg focus:outline-none focus:border-[#7557e1] focus:ring-1 focus:ring-[#7557e1] transition-colors`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.currentPassword}</p>
              )}
            </div>
            
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 ml-1 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-[#1d2132] text-white border ${
                    errors.newPassword ? 'border-red-500' : 'border-gray-700/50'
                  } rounded-lg focus:outline-none focus:border-[#7557e1] focus:ring-1 focus:ring-[#7557e1] transition-colors`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>
              )}
              <p className="mt-2 text-sm text-gray-400">
                Password must be at least 8 characters long, include one uppercase letter and one number.
              </p>
            </div>
            
            {/* Confirm New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 ml-1 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-[#1d2132] text-white border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-700/50'
                  } rounded-lg focus:outline-none focus:border-[#7557e1] focus:ring-1 focus:ring-[#7557e1] transition-colors`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
            
            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 mt-4 bg-[#7557e1] text-white rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-70"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Updating Password...
                </div>
              ) : (
                'Update Password'
              )}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;