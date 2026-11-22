// app/tasks/[id].jsx
// Task Details Screen.
// Displays detailed view of a specific student assignment, exam, or project.
// Offers actions to toggle completion, edit fields, and delete with confirmation.

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import taskService from '../../services/taskService';
import PriorityBadge from '../../components/PriorityBadge';
import CategoryBadge from '../../components/CategoryBadge';
import CustomButton from '../../components/CustomButton';
import LoadingScreen from '../../components/LoadingScreen';
import colors from '../../constants/colors';

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Load task on screen focus
  const loadTask = async () => {
    try {
      const data = await taskService.getTaskById(id);
      setTask(data);
    } catch (error) {
      console.error('Error fetching task details:', error);
      Alert.alert('Task Not Found', 'The requested task could not be loaded.', [
        { text: 'Back', onPress: () => router.back() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTask();
    }, [id])
  );

  // Toggle completion
  const handleToggleStatus = async () => {
    if (!task) return;
    setActionLoading(true);
    try {
      const updated = await taskService.toggleTaskStatus(task.id);
      setTask(updated);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete with confirmation
  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to permanently delete "${task.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setActionLoading(true);
            try {
              await taskService.deleteTask(task.id);
              Alert.alert('Deleted', 'Task has been removed.');
              router.back();
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to delete task');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  if (loading || !task) {
    return <LoadingScreen message="Loading task details..." />;
  }

  const isCompleted = task.status === 'Completed';
  const today = new Date().toISOString().split('T')[0];
  const isOverdue = !isCompleted && task.dueDate && task.dueDate < today;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Status Banner */}
      <View
        style={[
          styles.statusBanner,
          isCompleted ? styles.completedBanner : isOverdue ? styles.overdueBanner : styles.pendingBanner,
        ]}
      >
        <Ionicons
          name={isCompleted ? 'checkmark-circle' : isOverdue ? 'alert-circle' : 'time'}
          size={20}
          color={isCompleted ? colors.success : isOverdue ? colors.danger : colors.warning}
        />
        <Text
          style={[
            styles.statusBannerText,
            { color: isCompleted ? colors.success : isOverdue ? colors.danger : colors.warning },
          ]}
        >
          {isCompleted ? 'Completed Task' : isOverdue ? 'Overdue - Immediate Attention Needed' : 'Pending Task'}
        </Text>
      </View>

      {/* Main Task Card */}
      <View style={styles.card}>
        {/* Badges */}
        <View style={styles.badgesRow}>
          <CategoryBadge category={task.category} />
          <PriorityBadge priority={task.priority} />
        </View>

        {/* Title */}
        <Text style={[styles.title, isCompleted && styles.completedTitle]}>{task.title}</Text>

        {/* Description */}
        <Text style={styles.sectionHeading}>Description</Text>
        <Text style={styles.description}>
          {task.description ? task.description : 'No additional description provided.'}
        </Text>

        {/* Metadata Grid */}
        <View style={styles.metaGrid}>
          <View style={styles.metaItem}>
            <View style={styles.metaIcon}>
              <Ionicons name="calendar-outline" size={18} color={isOverdue ? colors.danger : colors.primary} />
            </View>
            <View>
              <Text style={styles.metaLabel}>Due Date</Text>
              <Text style={[styles.metaVal, isOverdue && styles.overdueVal]}>
                {task.dueDate || 'None'}
              </Text>
            </View>
          </View>

          <View style={styles.metaItem}>
            <View style={styles.metaIcon}>
              <Ionicons name="time-outline" size={18} color={colors.textSecondary} />
            </View>
            <View>
              <Text style={styles.metaLabel}>Created Date</Text>
              <Text style={styles.metaVal}>{task.createdAt || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Action: Toggle Status Button */}
        <CustomButton
          title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
          onPress={handleToggleStatus}
          loading={actionLoading}
          variant={isCompleted ? 'outline' : 'primary'}
          icon={isCompleted ? 'arrow-undo-outline' : 'checkmark-done-outline'}
          style={styles.toggleBtn}
        />

        {/* Actions: Edit and Delete Row */}
        <View style={styles.actionRow}>
          <CustomButton
            title="Edit Task"
            onPress={() => router.push({ pathname: '/tasks/edit', params: { id: task.id } })}
            variant="secondary"
            icon="create-outline"
            style={styles.editBtn}
          />

          <CustomButton
            title="Delete"
            onPress={handleDelete}
            variant="danger"
            icon="trash-outline"
            style={styles.deleteBtn}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  pendingBanner: {
    backgroundColor: colors.warningLight,
  },
  completedBanner: {
    backgroundColor: colors.successLight,
  },
  overdueBanner: {
    backgroundColor: colors.dangerLight,
  },
  statusBannerText: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 8,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 28,
    marginBottom: 16,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  description: {
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 22,
    marginBottom: 20,
  },
  metaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  metaIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metaLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  metaVal: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  overdueVal: {
    color: colors.danger,
  },
  toggleBtn: {
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editBtn: {
    flex: 1,
    marginRight: 8,
  },
  deleteBtn: {
    flex: 1,
    marginLeft: 8,
  },
});
