import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Calendar, Phone, BookOpen } from 'lucide-react';

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

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
  label: string;
}

// Update the Input component with less rounded styling
const Input: React.FC<InputProps> = ({ icon, label, ...props }) => (
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
        className="pl-10 pr-4 py-2.5 w-full bg-[#1d2132] text-white placeholder-gray-400 border border-gray-700/50 rounded-lg focus:outline-none focus:border-[#7557e1] focus:ring-1 focus:ring-[#7557e1] transition-all hover:border-gray-600"
      />
    </div>
  </div>
);

const Register: React.FC = () => {
  const navigate = useNavigate();
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
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.acceptTerms) {
      setError('Please accept the terms and conditions');
      return;
    }
    navigate('/login');
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
      <div className="max-w-2xl mx-auto">
        <div className="bg-[#222839] rounded-xl p-8 border border-gray-700/50 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white">Create Account</h2>
            <p className="mt-2 text-gray-400">Join our community and start exploring events</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20">
              {error}
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
              />

              <Input
                icon={<Mail className="w-5 h-5" />}
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <Input
                icon={<Lock className="w-5 h-5" />}
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <Input
                icon={<Lock className="w-5 h-5" />}
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

              <Input
                icon={<Calendar className="w-5 h-5" />}
                label="Date of Birth"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                required
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
            >
              Create Account
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
