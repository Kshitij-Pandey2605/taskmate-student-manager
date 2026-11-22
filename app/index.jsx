// app/index.jsx
// Entry point / Auth Gate for TaskMate.
// Automatically routes authenticated students to the Dashboard (tabs) and guests to the Login screen.

import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/login');
      }
    }
  }, [isLoading, isAuthenticated, router]);

  return <LoadingScreen message="Starting TaskMate..." />;
}
