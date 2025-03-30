import axios from 'axios';
import { serverUrl } from '../helpers/Constant';

const api = axios.create({
  baseURL: serverUrl
});

// Request interceptor to add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('organizer_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized, clear token and redirect
      localStorage.removeItem('organizer_token');
      window.location.href = '/organizer/login';
    }
    return Promise.reject(error);
  }
);

export default api;