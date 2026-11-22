// app/(tabs)/index.jsx
// Student Dashboard Screen.
// Displays greeting, real-time calculated statistics (Total, Pending, Completed, Overdue),
// priority breakdown, recent tasks preview, and quick access to task creation.

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import taskService from '../../services/taskService';
import StatCard from '../../components/StatCard';
import TaskCard from '../../components/TaskCard';
import CustomButton from '../../components/CustomButton';
import LoadingScreen from '../../components/LoadingScreen';
import colors from '../../constants/colors';

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load tasks whenever the dashboard screen is focused
  const fetchTasks = async () => {
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Failed to load dashboard tasks:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchTasks();
  };

  // Calculate statistics from the user's actual tasks list
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'Completed').length;
    const pending = tasks.filter((t) => t.status === 'Pending').length;
    const overdue = tasks.filter((t) => t.status === 'Pending' && t.dueDate && t.dueDate < today).length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, overdue, completionRate };
  }, [tasks]);

  // Handle toggling task status directly from Dashboard
  const handleToggleStatus = async (id) => {
    try {
      await taskService.toggleTaskStatus(id);
      fetchTasks();
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  // Format today's date (e.g. "Sunday, Nov 22, 2026")
  const currentDateString = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, []);

  // Show up to 4 most recent pending or urgent tasks
  const recentTasks = useMemo(() => {
    return [...tasks]
      .sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''))
      .slice(0, 4);
  }, [tasks]);

  if (loading && !refreshing) {
    return <LoadingScreen message="Loading your dashboard..." />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Header */}
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeTextGroup}>
            <Text style={styles.greetingText}>
              Hello, {user?.name ? user.name.split(' ')[0] : 'Student'}! 👋
            </Text>
            <Text style={styles.dateText}>{currentDateString}</Text>
          </View>
          <TouchableOpacity
            style={styles.quickAddBtn}
            onPress={() => router.push('/tasks/create')}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Completion Progress Banner */}
        <View style={styles.progressCard}>
          <View style={styles.progressTextRow}>
            <View>
              <Text style={styles.progressTitle}>Semester Productivity</Text>
              <Text style={styles.progressSubtitle}>
                {stats.completed} of {stats.total} tasks completed
              </Text>
            </View>
            <View style={styles.percentageBadge}>
              <Text style={styles.percentageText}>{stats.completionRate}%</Text>
            </View>
          </View>

          {/* Progress Bar Track */}
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${stats.completionRate}%` }]} />
          </View>
        </View>

        {/* 2x2 Grid of Dashboard Statistics Cards */}
        <Text style={styles.sectionHeader}>Task Overview</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatCard
              title="Total Tasks"
              count={stats.total}
              icon="layers-outline"
              accentColor={colors.primary}
              bgColor={colors.primaryLight}
              onPress={() => router.push('/(tabs)/tasks')}
            />
            <StatCard
              title="Pending"
              count={stats.pending}
              icon="time-outline"
              accentColor={colors.warning}
              bgColor={colors.warningLight}
              onPress={() => router.push('/(tabs)/tasks')}
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              title="Completed"
              count={stats.completed}
              icon="checkmark-done-circle-outline"
              accentColor={colors.success}
              bgColor={colors.successLight}
              onPress={() => router.push('/(tabs)/tasks')}
            />
            <StatCard
              title="Overdue"
              count={stats.overdue}
              icon="alert-circle-outline"
              accentColor={colors.danger}
              bgColor={colors.dangerLight}
              onPress={() => router.push('/(tabs)/tasks')}
            />
          </View>
        </View>

        {/* Recent / Upcoming Tasks Section */}
        <View style={styles.recentHeaderRow}>
          <Text style={styles.sectionHeader}>Upcoming Deadlines</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/tasks')} activeOpacity={0.7}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {recentTasks.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="sparkles-outline" size={32} color={colors.primary} />
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptySubtitle}>No pending tasks found. Enjoy your free time or add a new one.</Text>
            <CustomButton
              title="+ Add Task"
              onPress={() => router.push('/tasks/create')}
              variant="outline"
              style={styles.emptyAddBtn}
            />
          </View>
        ) : (
          recentTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onPress={() => router.push({ pathname: '/tasks/[id]', params: { id: task.id } })}
              onToggleStatus={handleToggleStatus}
              onEdit={() => router.push({ pathname: '/tasks/edit', params: { id: task.id } })}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeTextGroup: {
    flex: 1,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  dateText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  quickAddBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  progressCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  progressSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  percentageBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  progressBarTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  statsGrid: {
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  recentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 6,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  emptyCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 14,
  },
  emptyAddBtn: {
    height: 40,
    paddingHorizontal: 20,
  },
});
