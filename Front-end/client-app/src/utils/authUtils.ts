import { useStore } from "../store.tsx";

export const logUserStatus = () => {
  const currentUser = useStore.getState().user;
  const token = localStorage.getItem('token');
  
  if (currentUser) {
    console.log('✅ ACTIVE USER:', currentUser.fullName || currentUser.email);
    return true;
  } else {
    console.log('❌ NO ACTIVE USER');
    
    if (token) {
      console.log('⚠️ Token exists but no user data:', token);
    } else {
      console.log('No authentication token found');
    }
    return false;
  }
};