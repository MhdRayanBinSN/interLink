import axios from 'axios';
import { serverUrl } from '../helpers/Constant';

export const isAuthenticated = async (): Promise<boolean> => {
  const token = localStorage.getItem('token');
  if (!token) {
    return false;
  }

  try {
    const response = await axios.get(`${serverUrl}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data.success;
  } catch (error) {
    console.error('Auth check failed:', error);
    localStorage.removeItem('token'); // Clear invalid token
    return false;
  }
};

export const requireAuth = (navigate: any, currentPath: string): void => {
  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/login', { state: { from: currentPath } });
  }
};

export const getUserData = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }

  try {
    const response = await axios.get(`${serverUrl}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error('Failed to get user data:', error);
    return null;
  }
};