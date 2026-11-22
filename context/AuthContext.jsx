// context/AuthContext.jsx
// Global Authentication Context for TaskMate.
// Manages real JWT token persistence, student session verification, login, registration, and logout.

import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if student was previously logged in with a valid JWT
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedUser = await AsyncStorage.getItem('userData');

        if (storedToken && storedUser) {
          setUserToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Verify token validity with backend in background
          try {
            const profile = await authService.getProfile();
            if (profile?.user) {
              setUser(profile.user);
              await AsyncStorage.setItem('userData', JSON.stringify(profile.user));
            }
          } catch (verifyError) {
            console.warn('Session verification failed, logging out:', verifyError.message);
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userData');
            setUser(null);
            setUserToken(null);
          }
        }
      } catch (error) {
        console.error('Error loading stored auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      setUserToken(response.token);
      await AsyncStorage.setItem('userToken', response.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.user));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Registration handler
  const register = async (userData) => {
    setIsLoading(true);
    try {
      const response = await authService.register(userData);
      setUser(response.user);
      setUserToken(response.token);
      await AsyncStorage.setItem('userToken', response.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.user));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout handler
  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setUserToken(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userToken,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
