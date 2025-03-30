import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from './axiosConfig';

interface OrganizerAuthGuardProps {
  children: React.ReactNode;
}

const OrganizerAuthGuard: React.FC<OrganizerAuthGuardProps> = ({ children }) => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('organizer_token');
      
      if (!token) {
        setIsVerifying(false);
        return;
      }
      
      try {
        // Verify token validity
        const response = await api.get('/organizer/current');
        
        if (response.data) {
          setIsAuthenticated(true);
        } else {
          toast.error('Authentication failed');
          localStorage.removeItem('organizer_token');
        }
      } catch (error) {
        console.error("Auth verification error:", error);
        toast.error('Authentication failed. Please login again.');
        localStorage.removeItem('organizer_token');
      } finally {
        setIsVerifying(false);
      }
    };
    
    verifyAuth();
  }, []);
  
  if (isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1d2132]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d7ff42]"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/organizer/login" state={{ from: location.pathname }} replace />;
  }
  
  return <>{children}</>;
};

export default OrganizerAuthGuard;