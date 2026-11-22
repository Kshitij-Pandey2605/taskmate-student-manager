// app/_layout.jsx
// Root layout for TaskMate using Expo Router.
// Wraps the application with SafeAreaProvider and AuthProvider so authentication state is available everywhere.

import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../context/AuthContext';
import colors from '../constants/colors';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" backgroundColor={colors.background} />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.card,
            },
            headerTintColor: colors.primary,
            headerTitleStyle: {
              fontWeight: '700',
              color: colors.textPrimary,
              fontSize: 18,
            },
            headerShadowVisible: false,
            contentStyle: {
              backgroundColor: colors.background,
            },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="tasks/create"
            options={{
              headerShown: true,
              title: 'Create New Task',
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="tasks/[id]"
            options={{
              headerShown: true,
              title: 'Task Details',
            }}
          />
          <Stack.Screen
            name="tasks/edit"
            options={{
              headerShown: true,
              title: 'Edit Task',
            }}
          />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
