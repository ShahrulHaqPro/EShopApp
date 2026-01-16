import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Test credentials for Fake Store API
export const TEST_CREDENTIALS = [
  { username: 'johnd', password: 'm38rmF$', name: 'John Doe' },
  { username: 'mor_2314', password: '83r5^_', name: 'Moriah Stanton' },
  { username: 'kevinryan', password: 'kev02937@', name: 'Kevin Ryan' },
  { username: 'donero', password: 'ewedon', name: 'Donero' },
  { username: 'derek', password: 'jklg*_56', name: 'Derek' },
  { username: 'david_r', password: '3478*#54', name: 'David' },
  { username: 'snyder', password: 'f238&@*$', name: 'Snyder' },
  { username: 'hopkins', password: 'William56$hj', name: 'Hopkins' },
  { username: 'kate_h', password: 'kfejk@*_', name: 'Kate' },
  { username: 'jimmie_k', password: 'klein*#%*', name: 'Jimmie' },
];

export const authApi = {
  // Login user
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login', {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get current user's profile
  getCurrentUser: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete user account
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all users (for admin or verification)
  getAllUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Validate token (Fake Store API doesn't have this, so we simulate)
  validateToken: async (token) => {
    try {
      // Since Fake Store API doesn't have token validation,
      // we'll just check if we can fetch users with the token in header
      const response = await api.get('/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { valid: true, data: response.data };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  },

  // Store auth data locally
  storeAuthData: async (user, token) => {
    try {
      await AsyncStorage.setItem('@auth_user', JSON.stringify(user));
      await AsyncStorage.setItem('@auth_token', token);
      return true;
    } catch (error) {
      console.error('Error storing auth data:', error);
      return false;
    }
  },

  // Get stored auth data
  getStoredAuthData: async () => {
    try {
      const user = await AsyncStorage.getItem('@auth_user');
      const token = await AsyncStorage.getItem('@auth_token');
      return {
        user: user ? JSON.parse(user) : null,
        token: token || null,
      };
    } catch (error) {
      console.error('Error getting auth data:', error);
      return { user: null, token: null };
    }
  },

  // Clear auth data (logout)
  clearAuthData: async () => {
    try {
      await AsyncStorage.multiRemove(['@auth_user', '@auth_token']);
      return true;
    } catch (error) {
      console.error('Error clearing auth data:', error);
      return false;
    }
  },

  // Check if username is available
  checkUsernameAvailability: async (username) => {
    try {
      const users = await api.get('/users');
      const exists = users.data.some(user => user.username === username);
      return { available: !exists };
    } catch (error) {
      throw error;
    }
  },

  // Check if email is available
  checkEmailAvailability: async (email) => {
    try {
      const users = await api.get('/users');
      const exists = users.data.some(user => user.email === email);
      return { available: !exists };
    } catch (error) {
      throw error;
    }
  },
};