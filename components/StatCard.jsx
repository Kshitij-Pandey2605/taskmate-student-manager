// components/StatCard.jsx
// Metric card for the student dashboard.
// Displays key task summaries like Total Tasks, Completed, Pending, and Overdue.

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

const StatCard = ({
  title,
  count = 0,
  icon,
  accentColor = colors.primary,
  bgColor = colors.primaryLight,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.8 : 1}
      onPress={onPress}
      disabled={!onPress}
      style={styles.card}
    >
      <View style={styles.topRow}>
        <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
          <Ionicons name={icon} size={22} color={accentColor} />
        </View>
        <Text style={[styles.countText, { color: accentColor }]}>{count}</Text>
      </View>
      <Text style={styles.titleText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    margin: 5,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: 24,
    fontWeight: '800',
  },
  titleText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});

export default StatCard;
