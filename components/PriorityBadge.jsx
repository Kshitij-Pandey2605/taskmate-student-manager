// components/PriorityBadge.jsx
// Displays a colored pill badge representing the priority of a task (High, Medium, Low).

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../constants/colors';

const PriorityBadge = ({ priority = 'Medium' }) => {
  const currentPriority = colors.priority[priority] || colors.priority.Medium;

  return (
    <View style={[styles.badge, { backgroundColor: currentPriority.bg, borderColor: currentPriority.border }]}>
      <View style={[styles.dot, { backgroundColor: currentPriority.text }]} />
      <Text style={[styles.text, { color: currentPriority.text }]}>{priority}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default PriorityBadge;
