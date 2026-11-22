// services/api.js
// Central Axios configuration for TaskMate.
// In Phase 1, we set up the client structure with clear comments.
// In Phase 2, this client connects to our Express/MongoDB backend APIs.

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// For Android emulator, localhost is 10.0.2.2; for iOS simulator / web it is localhost:5000.
// On physical devices, it will use your computer's local Wi-Fi IP address or deployed backend URL.
const DEV_API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: DEV_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatically attaches the JWT bearer token to every outgoing request
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error retrieving auth token for request', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Standardized error logging and handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Collect human-readable error messages from server response
    const message = error.response?.data?.message || error.message || 'Something went wrong. Please check your network.';
    return Promise.reject(new Error(message));
  }
);

export default api;
