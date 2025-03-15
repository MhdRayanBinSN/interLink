import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Calendar, Phone, BookOpen, AlertCircle, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { serverUrl } from '../../helpers/Constant';
import { CustomToast } from '../../components/Toast';
import toast, { Toaster } from 'react-hot-toast'; // Add this import

// Update interface to include form errors
interface RegisterForm {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  dob: string;
  attendeeType: 'student' | 'educator' | 'professional';
  phone: string;
  acceptTerms: boolean;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  dob?: string;
  attendeeType?: string;
  phone?: string;
  acceptTerms?: string;
  general?: string;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
  label: string;
  error?: string;
}

// Updated Input component with error display
const Input: React.FC<InputProps> = ({ icon, label, error, ...props }) => (
  <div className="relative">
    <label className="text-sm font-medium text-gray-300 ml-1 mb-1 block">
      {label} {props.required && '*'}
    </label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        {icon}
      </div>
      <input
        {...props}
        className={`pl-10 pr-4 py-2.5 w-full bg-[#1d2132] text-white placeholder-gray-400 border ${
          error ? 'border-red-500' : 'border-gray-700/50'
        } rounded-lg focus:outline-none focus:border-[#7557e1] focus:ring-1 focus:ring-[#7557e1] transition-all hover:border-gray-600`}
      />
      {error && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <AlertCircle className="w-5 h-5 text-red-500" />
        </div>
      )}
    </div>
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

const Register: React.FC = () => {
  const navigate = useNavigate();
  
  // Add visibility states for passwords
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState<RegisterForm>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '',
    attendeeType: 'student',
    phone: '',
    acceptTerms: false
  });
  
  // Updated to use FormErrors type
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Validate phone format (10 digits)
  const validatePhone = (phone: string): boolean => {
    return /^[0-9]{10}$/.test(phone);
  };

  // Validate age (must be at least 13 years old)
  const validateAge = (dob: string): boolean => {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 13;
    }
    
    return age >= 13;
  };

  // Validate password strength
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
    
    // Validate full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Full name must be at least 3 characters';
      isValid = false;
    }
    
    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else {
      const passwordCheck = validatePassword(formData.password);
      if (!passwordCheck.valid) {
        newErrors.password = passwordCheck.message;
        isValid = false;
      }
    }
    
    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    // Validate date of birth
    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
      isValid = false;
    } else if (!validateAge(formData.dob)) {
      newErrors.dob = 'You must be at least 13 years old to register';
      isValid = false;
    }
    
    // Validate phone
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
      isValid = false;
    }
    
    // Validate terms acceptance
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare data for API
      const userData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        dob: formData.dob,
        attendeeType: formData.attendeeType
      };
      
      // Send registration request
      const response = await axios.post(`${serverUrl}/user/register`, userData);
      
      if (response.data.success) {
        toast.custom((t: { id: any; }) => (
          <CustomToast
            type="success"
            message="Registration successful! Redirecting to login..."
            onClose={() => toast.dismiss(t.id)}
          />
        ), {
          duration: 5000,
        });
        
        // Navigate after a short delay
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Registration successful! Please login to continue.' 
            } 
          });
        }, 2000);
      } else {
        setErrors({ general: response.data.error || 'Registration failed' });
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setErrors({ general: err.response?.data?.error || 'An error occurred during registration' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-[#1d2132] py-8 px-4">
      {/* Add the Toaster component */}
      <Toaster position="top-center" />
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-[#222839] rounded-xl p-8 border border-gray-700/50 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white">Create Account</h2>
            <p className="mt-2 text-gray-400">Join our community and start exploring events</p>
          </div>

          {errors.general && (
            <div className="mb-6 p-4 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                icon={<User className="w-5 h-5" />}
                label="Full Name"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                required
                error={errors.fullName}
              />

              <Input
                icon={<Mail className="w-5 h-5" />}
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                error={errors.email}
              />

              {/* Password field with toggle */}
              <div className="relative">
                <label className="text-sm font-medium text-gray-300 ml-1 mb-1 block">
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-10 pr-12 py-2.5 w-full bg-[#1d2132] text-white placeholder-gray-400 border ${
                      errors.password ? 'border-red-500' : 'border-gray-700/50'
                    } rounded-lg focus:outline-none focus:border-[#7557e1] focus:ring-1 focus:ring-[#7557e1] transition-all hover:border-gray-600`}
                    required
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none"
                    onClick={() => setShowPassword(prev => !prev)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                  )}
                </div>
              </div>

              {/* Confirm Password field with toggle */}
              <div className="relative">
                <label className="text-sm font-medium text-gray-300 ml-1 mb-1 block">
                  Confirm Password *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`pl-10 pr-12 py-2.5 w-full bg-[#1d2132] text-white placeholder-gray-400 border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-700/50'
                    } rounded-lg focus:outline-none focus:border-[#7557e1] focus:ring-1 focus:ring-[#7557e1] transition-all hover:border-gray-600`}
                    required
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none"
                    onClick={() => setShowConfirmPassword(prev => !prev)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <Input
                icon={<Calendar className="w-5 h-5" />}
                label="Date of Birth"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                required
                error={errors.dob}
              />

              {/* Update the select field styling with less rounded corners */}
              <div className="relative">
                <label className="text-sm font-medium text-gray-300 ml-1 mb-1 block">
                  Attendee Type *
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    name="attendeeType"
                    value={formData.attendeeType}
                    onChange={handleChange}
                    className="pl-10 pr-4 py-2.5 w-full bg-[#1d2132] text-white border border-gray-700/50 rounded-lg focus:outline-none focus:border-[#7557e1] focus:ring-1 focus:ring-[#7557e1] transition-all hover:border-gray-600 appearance-none"
                    required
                  >
                    <option value="student">Student</option>
                    <option value="educator">Educator</option>
                    <option value="professional">Professional</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <Input
                icon={<Phone className="w-5 h-5" />}
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                error={errors.phone}
              />
            </div>

            {/* Update the checkbox container styling */}
            <div className="flex items-center ml-1">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="h-4 w-4 bg-[#1d2132] border-gray-700 rounded-full text-[#7557e1] focus:ring-2 focus:ring-[#7557e1]/20 transition-all"
              />
              <label className="ml-2 text-sm text-gray-300">
                I accept the{' '}
                <a href="#" className="text-[#7557e1] hover:text-[#d7ff42]">
                  Terms and Conditions
                </a>
              </label>
            </div>

            {/* Update the submit button styling */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 bg-[#7557e1] text-white rounded-full font-medium hover:opacity-90 transition-all shadow-lg shadow-[#7557e1]/20"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </motion.button>

            <p className="text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-[#7557e1] hover:text-[#d7ff42] font-medium">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
