// components/LoadingScreen.jsx
// Displays a friendly loading screen when fetching data or verifying authentication.

import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import colors from '../constants/colors';

const LoadingScreen = ({ message = 'Loading TaskMate...' }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
  },
  message: {
    marginTop: 16,
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});

export default LoadingScreen;
