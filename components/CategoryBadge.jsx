// components/CategoryBadge.jsx
// Displays a colored chip badge for the task's academic/personal category.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

// Map each category to an appropriate Ionicons symbol
const CATEGORY_ICONS = {
  Assignment: 'document-text-outline',
  Exam: 'school-outline',
  Project: 'code-slash-outline',
  Personal: 'person-outline',
  Other: 'bookmark-outline',
};

const CategoryBadge = ({ category = 'Assignment' }) => {
  const currentCategory = colors.category[category] || colors.category.Other;
  const iconName = CATEGORY_ICONS[category] || 'bookmark-outline';

  return (
    <View style={[styles.badge, { backgroundColor: currentCategory.bg, borderColor: currentCategory.border }]}>
      <Ionicons name={iconName} size={13} color={currentCategory.text} style={styles.icon} />
      <Text style={[styles.text, { color: currentCategory.text }]}>{category}</Text>
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
  icon: {
    marginRight: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default CategoryBadge;
