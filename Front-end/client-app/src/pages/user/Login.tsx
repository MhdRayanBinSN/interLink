import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, UserCircle, AlertCircle, Loader } from 'lucide-react';
import { useStore } from "../../store.tsx";
import axios from 'axios';
import { serverUrl } from '../../helpers/Constant';
import toast, { Toaster } from 'react-hot-toast';
import { CustomToast } from '../../components/Toast';
import { logUserStatus } from '../../utils/authUtils';

interface InputGroupProps {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const InputGroup: React.FC<InputGroupProps> = ({ icon, error, ...props }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
      {icon}
    </div>
    <input
      {...props}
      className={`w-full px-10 py-2.5 bg-[#1d2132] text-white placeholder-gray-400 border ${
        error ? 'border-red-500' : 'border-gray-700/50'
      } rounded-lg focus:outline-none focus:border-[#7557e1] focus:ring-1 focus:ring-[#7557e1] transition-colors`}
      required
    />
    {error && (
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
        <AlertCircle className="w-5 h-5 text-red-500" />
      </div>
    )}
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{email?: string; password?: string; general?: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useStore();

  // Check if there's a message from registration success
  React.useEffect(() => {
    if (location.state?.message) {
      toast.custom((t) => (
        <CustomToast
          type="success"
          message={location.state.message}
          onClose={() => toast.dismiss(t.id)}
        />
      ), {
        duration: 5000,
      });
      
      // Clear the message after showing toast
      navigate(location.pathname, { replace: true });
    }
  }, [location]);

  useEffect(() => {
    logUserStatus();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: {email?: string; password?: string} = {};
    let isValid = true;

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      const response = await axios.post(`${serverUrl}/user/login`, data);
      
      if (response.data.success) {
        // Store the token and update the user data in the store
        const userData = response.data.data; // User data from API
        const token = response.data.token; // JWT token
        
        login(userData, token);
        
        toast.success('Login successful!');
        
        // Redirect to appropriate page
        const from = location.state?.from || '/events';
        navigate(from);
      } else {
        toast.error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await handleLogin({ email, password });
      
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add to any component temporarily to debug
  console.log('Current token:', localStorage.getItem('token'));
  console.log('Current user:', useStore.getState().user);

  return (
    <div className="min-h-screen bg-[#1d2132] flex items-center justify-center p-4">
      <Toaster />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#222839] rounded-xl p-8 border border-gray-700/50 shadow-xl">
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 rounded-full bg-[#7557e1]/10 flex items-center justify-center"
            >
              <UserCircle className="w-10 h-10 text-[#7557e1]" />
            </motion.div>
          </div>

          <h2 className="text-3xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#7557e1] to-[#d7ff42]">
            Welcome Back
          </h2>
          <p className="text-center text-gray-400 mb-8">
            Sign in to continue your journey
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputGroup
              icon={<Mail className="w-5 h-5" />}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />

            <InputGroup
              icon={<Lock className="w-5 h-5" />}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />

            {errors.general && (
              <p className="text-sm text-red-500 text-center">{errors.general}</p>
            )}

            <div className="flex items-center justify-end">
              <Link 
                to="/forgot-password"
                className="text-sm text-[#7557e1] hover:text-[#d7ff42] transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-2.5 bg-[#7557e1] text-white rounded-lg font-medium hover:opacity-90 transition-all flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader className="w-5 h-5 mr-2 animate-spin" />}
              Sign in
            </motion.button>

            <p className="text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <Link 
                to="/register"
                className="text-[#7557e1] hover:text-[#d7ff42] font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;