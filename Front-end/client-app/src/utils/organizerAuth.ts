import axios from "axios";
import { serverUrl } from "../helpers/Constant";

export const refreshOrganizerToken = async (): Promise<boolean> => {
  try {
    const token = localStorage.getItem('organizer_token');
    if (!token) return false;
    
    // Call your refresh endpoint (you'll need to implement this)
    const response = await axios.post(`${serverUrl}/organizer/refresh-token`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success && response.data.accessToken) {
      localStorage.setItem('organizer_token', response.data.accessToken);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Failed to refresh token:', error);
    return false;
  }
};

// Add tokenExpiration check
export const isOrganizerTokenValid = (): boolean => {
  const token = localStorage.getItem('organizer_token');
  if (!token) return false;
  
  // Check expiration (if token has expiration info embedded)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch (e) {
    return false;
  }
};