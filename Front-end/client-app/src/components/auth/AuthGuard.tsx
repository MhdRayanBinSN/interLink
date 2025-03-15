import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { useStore } from '../../store';
import axios from 'axios';
import { serverUrl } from '../../helpers/Constant';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const location = useLocation();
  const { user, login, logout } = useStore();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsChecking(false);
        logout();
        return;
      }
      
      try {
        // Verify token is valid by making a request to the backend
        const response = await axios.get(`${serverUrl}/user/verify-token`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          // Token is valid, update user state if needed
          if (!user) {
            login(response.data.data);
          }
        } else {
          // Invalid token
          localStorage.removeItem('token');
          logout();
        }
      } catch (error) {
        console.error('Auth verification error:', error);
        localStorage.removeItem('token');
        logout();
      } finally {
        setIsChecking(false);
      }
    };
    
    verifyAuth();
  }, [login, logout, user]);
  
  // Show loading spinner while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#1d2132] flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-10 w-10 border-4 border-[#7557e1] border-t-transparent rounded-full mb-4"></div>
          <p className="text-white">Verifying authentication...</p>
        </div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // If authenticated, render children
  return <>{children}</>;
};

export default AuthGuard;