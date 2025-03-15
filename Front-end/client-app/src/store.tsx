import { create } from 'zustand';
import axios from 'axios';
import { serverUrl } from './helpers/Constant';

interface UserProfile {
  id: string;
  fullName: string;
  name?: string; // For backward compatibility
  email: string;
  phone?: string;
  profileImage?: string;
}

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  login: (userData: UserProfile, token?: string) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

export const useStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  
  login: (userData, token) => {
    // If token is provided, store it
    if (token) {
      localStorage.setItem('token', token);
    }
    
    // Make sure both name and fullName are available
    if (userData.fullName && !userData.name) {
      userData.name = userData.fullName;
    } else if (userData.name && !userData.fullName) {
      userData.fullName = userData.name;
    }
    
    set({ user: userData, isLoading: false });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, isLoading: false });
  },
  
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      set({ user: null, isLoading: false });
      return false;
    }
    
    try {
      const response = await axios.get(`${serverUrl}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const userData = response.data.data;
        
        // Ensure we have name for the navbar
        if (userData.fullName && !userData.name) {
          userData.name = userData.fullName;
        } else if (userData.name && !userData.fullName) {
          userData.fullName = userData.name;
        }
        
        set({ user: userData, isLoading: false });
        return true;
      } else {
        localStorage.removeItem('token');
        set({ user: null, isLoading: false });
        return false;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      set({ user: null, isLoading: false });
      return false;
    }
  }
}));