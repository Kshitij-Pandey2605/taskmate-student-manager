// services/authService.js
// Authentication service handling user registration, login, and fetching user profile.
// In Phase 2, this will send requests to /api/auth endpoints on the Express backend.

import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Temporary mock user profile used strictly for Phase 1 frontend preview
export const PREVIEW_USER = {
  id: 'usr_preview_01',
  name: 'Alex Johnson',
  email: 'alex.student@college.edu',
  department: 'Computer Science & Engineering',
  semester: '6th Semester',
  joinedDate: 'Jan 2026',
};

const authService = {
  // Register a new student account
  register: async (userData) => {
    // Phase 2 will execute: const response = await api.post('/auth/register', userData); return response.data;
    return {
      success: true,
      user: {
        id: 'usr_' + Date.now(),
        name: userData.name,
        email: userData.email,
        department: userData.department || 'Engineering',
        semester: userData.semester || 'Current',
      },
      token: 'sample_jwt_token_for_phase1',
    };
  },

  // Login existing student
  login: async (credentials) => {
    // Phase 2 will execute: const response = await api.post('/auth/login', credentials); return response.data;
    return {
      success: true,
      user: PREVIEW_USER,
      token: 'sample_jwt_token_for_phase1',
    };
  },

  // Get current logged-in user details
  getProfile: async () => {
    // Phase 2 will execute: const response = await api.get('/auth/me'); return response.data;
    return {
      success: true,
      user: PREVIEW_USER,
    };
  },

  // Logout by removing stored token
  logout: async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
  },
};

export default authService;
