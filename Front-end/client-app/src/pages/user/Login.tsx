import * as React from 'react';
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useStore } from "../../store"
import { Mail, Lock, UserCircle } from 'lucide-react'
import styles from "../../styles/Login.module.css" 


const Login: React.FunctionComponent = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const { login } = useStore()
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      const user = {
        id: Math.random().toString(36).substring(2, 9),
        name: email.split("@")[0],
        email: email,
        role: "user" // Default role
      }
      localStorage.setItem('token', 'your-auth-token'); // Set token
      login(user)
      navigate("/dashboard/profile")
    }
  
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={styles.loginContainer}
      >
        <div className={styles.formCard}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={styles.logoContainer}
          >
            <UserCircle className="w-12 h-12 text-white" />
          </motion.div>

          <h2 className={`text-3xl text-center mb-2 ${styles.gradientText}`}>
            Welcome Back
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Sign in to continue your journey
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className={styles.inputGroup}>
              <Mail className={styles.icon} />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <Lock className={styles.icon} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <Link 
                to="/forgot-password"
                className="text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className={styles.submitButton}
            >
              Sign in
            </motion.button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Don't have an account?{' '}
              <Link 
                to="/register"
                className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    )
};

export default Login;