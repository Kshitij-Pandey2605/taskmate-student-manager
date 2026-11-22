// components/TaskCard.jsx
// Displays a single task item inside the task list and dashboard recent tasks.
// Supports quick status toggle (checkbox), badges, due date alert, edit, and deletion with confirmation.

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import PriorityBadge from './PriorityBadge';
import CategoryBadge from './CategoryBadge';

const TaskCard = ({
  task,
  onPress,
  onToggleStatus,
  onEdit,
  onDelete,
}) => {
  const isCompleted = task.status === 'Completed';

  // Check if task is overdue (due date is in the past and status is Pending)
  const isOverdue = React.useMemo(() => {
    if (isCompleted || !task.dueDate) return false;
    const today = new Date().toISOString().split('T')[0];
    return task.dueDate < today;
  }, [task.dueDate, isCompleted]);

  // Format due date for friendly display (e.g. "Nov 25, 2026")
  const formattedDueDate = React.useMemo(() => {
    if (!task.dueDate) return 'No due date';
    try {
      const parts = task.dueDate.split('-');
      if (parts.length === 3) {
        const date = new Date(parts[0], parts[1] - 1, parts[2]);
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      }
      return task.dueDate;
    } catch {
      return task.dueDate;
    }
  }, [task.dueDate]);

  // Confirm before deleting task
  const handleDeletePress = () => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete && onDelete(task.id),
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.card,
        isCompleted && styles.completedCard,
        isOverdue && styles.overdueCardBorder,
      ]}
    >
      {/* Top Header: Category & Priority Badges */}
      <View style={styles.badgeRow}>
        <CategoryBadge category={task.category} />
        <PriorityBadge priority={task.priority} />
      </View>

      {/* Main Row: Checkbox Toggle + Task Title & Description */}
      <View style={styles.mainRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onToggleStatus && onToggleStatus(task.id)}
          style={[styles.checkbox, isCompleted && styles.checkedBox]}
        >
          {isCompleted && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
        </TouchableOpacity>

        <View style={styles.textContainer}>
          <Text
            style={[styles.title, isCompleted && styles.completedTitle]}
            numberOfLines={2}
          >
            {task.title}
          </Text>

          {task.description ? (
            <Text
              style={[styles.description, isCompleted && styles.completedDescription]}
              numberOfLines={2}
            >
              {task.description}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Bottom Footer: Due Date + Quick Action Buttons (Edit & Delete) */}
      <View style={styles.footerRow}>
        <View style={styles.dateContainer}>
          <Ionicons
            name={isOverdue ? 'alert-circle' : 'calendar-outline'}
            size={14}
            color={isOverdue ? colors.danger : colors.textSecondary}
          />
          <Text
            style={[
              styles.dateText,
              isOverdue && styles.overdueDateText,
              isCompleted && styles.completedDateText,
            ]}
          >
            {isOverdue ? `Overdue: ${formattedDueDate}` : `Due: ${formattedDueDate}`}
          </Text>
        </View>

        <View style={styles.actionsRow}>
          {onEdit && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onEdit(task)}
              style={styles.actionBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="create-outline" size={18} color={colors.primary} />
            </TouchableOpacity>
          )}

          {onDelete && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleDeletePress}
              style={[styles.actionBtn, styles.deleteBtn]}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="trash-outline" size={18} color={colors.danger} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  completedCard: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    opacity: 0.85,
  },
  overdueCardBorder: {
    borderColor: '#FCA5A5',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
    backgroundColor: '#FFFFFF',
  },
  checkedBox: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 20,
    marginBottom: 4,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  completedDescription: {
    color: colors.textMuted,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 5,
    fontWeight: '500',
  },
  overdueDateText: {
    color: colors.danger,
    fontWeight: '700',
  },
  completedDateText: {
    color: colors.textMuted,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    padding: 4,
    marginLeft: 10,
  },
  deleteBtn: {
    marginLeft: 14,
  },
});

export default TaskCard;
