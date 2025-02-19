import * as React from 'react';
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useStore } from "../store"
import { Mail, Lock, UserCircle } from 'lucide-react'
import styles from '../styles/Login.module.css'

const Login: React.FunctionComponent = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("user")
    const navigate = useNavigate()
    const { login } = useStore()
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      const user = {
        id: Math.random().toString(36).substring(2, 9),
        name: email.split("@")[0],
        role: role as "user" | "organizer",
      }
      login(user)
      navigate(role === "organizer" ? "/dashboard/organizer" : "/dashboard/user")
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

            <div className={styles.inputGroup}>
              <UserCircle className={styles.icon} />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={styles.input}
              >
                <option value="user">User</option>
                <option value="organizer">Organizer</option>
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className={styles.submitButton}
            >
              Sign in
            </motion.button>
          </form>
        </div>
      </motion.div>
    )
};

export default Login;