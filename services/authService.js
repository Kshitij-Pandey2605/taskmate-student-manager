// services/authService.js
// Authentication Service connecting to Node.js / Express backend REST APIs.

import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authService = {
  // Register a new student account
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login existing student
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Get current logged-in user profile from backend
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Logout by removing stored token and cached user data
  logout: async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
  },
};

export default authService;
