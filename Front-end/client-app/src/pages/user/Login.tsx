import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, UserCircle } from 'lucide-react';
import { useStore } from "../../store";

interface InputGroupProps {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputGroup: React.FC<InputGroupProps> = ({ icon, ...props }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
      {icon}
    </div>
    <input
      {...props}
      className="w-full px-10 py-2.5 bg-[#1d2132] text-white placeholder-gray-400 border border-gray-700/50 rounded-lg focus:outline-none focus:border-[#7557e1] focus:ring-1 focus:ring-[#7557e1] transition-colors"
      required
    />
  </div>
);

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = {
      id: Math.random().toString(36).substring(2, 9),
      name: email.split("@")[0],
      email,
      role: "user"
    };
    localStorage.setItem('token', 'your-auth-token');
    login(user);
    navigate("/dashboard/profile");
  };

  return (
    <div className="min-h-screen bg-[#1d2132] flex items-center justify-center p-4">
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
            />

            <InputGroup
              icon={<Lock className="w-5 h-5" />}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

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
              className="w-full py-2.5 bg-[#7557e1] text-white rounded-lg font-medium hover:opacity-90 transition-all"
            >
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