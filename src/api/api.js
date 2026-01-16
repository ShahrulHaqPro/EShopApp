import axios from 'axios';

// Base configuration
const API_BASE_URL = 'https://fakestoreapi.com';
const TIMEOUT = 10000; // 10 seconds

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // Get token from AsyncStorage (we'll handle this in a moment)
    // For now, return config as is
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    if (!response) {
      // Network error
      console.error('Network Error:', error.message);
      throw new Error('Network error. Please check your connection.');
    }

    const { status, data } = response;
    
    switch (status) {
      case 400:
        throw new Error(data?.message || 'Bad request');
      case 401:
        throw new Error('Unauthorized access. Please login again.');
      case 403:
        throw new Error('Forbidden. You do not have permission.');
      case 404:
        throw new Error('Resource not found.');
      case 500:
        throw new Error('Server error. Please try again later.');
      default:
        throw new Error(data?.message || 'Something went wrong');
    }
  }
);

export default api;