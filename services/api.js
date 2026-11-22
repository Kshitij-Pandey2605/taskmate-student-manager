// services/api.js
// Central Axios configuration for TaskMate.
// Automatically detects host IP address for physical Android devices, emulators, and web.

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Determine the best API URL dynamically
const getBaseUrl = () => {
  // When running via Expo Go on physical device, hostUri provides computer's local Wi-Fi IP
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    return `http://${ip}:5000/api`;
  }

  // Android Studio Emulator standard loopback
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  }

  // Fallback for Web and local development
  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatically attaches the stored JWT token to every outgoing request
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

// Response Interceptor: Formats error responses into user-friendly messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Unable to connect to TaskMate server. Please check your network and make sure the backend is running.';
    return Promise.reject(new Error(message));
  }
);

export default api;
