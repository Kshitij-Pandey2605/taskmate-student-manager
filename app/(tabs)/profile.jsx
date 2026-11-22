// app/(tabs)/profile.jsx
// Student Profile & Academic Settings Screen.
// Displays student details, academic task summary, college viva info, and logout handling.

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import taskService from '../../services/taskService';
import CustomButton from '../../components/CustomButton';
import colors from '../../constants/colors';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const tasks = await taskService.getTasks();
        const total = tasks.length;
        const completed = tasks.filter((t) => t.status === 'Completed').length;
        const pending = tasks.filter((t) => t.status === 'Pending').length;
        setStats({ total, completed, pending });
      } catch (err) {
        console.error('Error loading profile stats:', err);
      }
    };
    loadStats();
  }, []);

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to sign out of TaskMate?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/login');
        },
      },
    ]);
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset Demo Data',
      'Reset all tasks to the original student sample dataset for testing?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          onPress: () => {
            taskService.resetPreviewTasks();
            Alert.alert('Success', 'Sample student tasks have been reset.');
            router.push('/(tabs)/tasks');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Student Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitials}>
            {user?.name ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2) : 'ST'}
          </Text>
        </View>

        <Text style={styles.studentName}>{user?.name || 'Alex Johnson'}</Text>
        <Text style={styles.studentEmail}>{user?.email || 'alex.student@college.edu'}</Text>

        <View style={styles.badgeRow}>
          <View style={styles.deptBadge}>
            <Ionicons name="school-outline" size={14} color={colors.primary} />
            <Text style={styles.deptText}>{user?.department || 'Computer Science & Engg'}</Text>
          </View>
        </View>
      </View>

      {/* Academic Task Statistics Summary */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Academic Task Progress</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Tasks</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.warning }]}>{stats.pending}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.success }]}>{stats.completed}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>
      </View>

      {/* College Project & Viva Details Card */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Project Information (For Viva)</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Project Name:</Text>
          <Text style={styles.infoVal}>TaskMate – Smart Student Task Manager</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Frontend:</Text>
          <Text style={styles.infoVal}>React Native, Expo Router, JavaScript</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Backend:</Text>
          <Text style={styles.infoVal}>Node.js, Express, MongoDB, JWT</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Authentication:</Text>
          <Text style={styles.infoVal}>JWT Bearer Token + bcryptjs</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Architecture:</Text>
          <Text style={styles.infoVal}>MVC Backend + Component-Driven UI</Text>
        </View>
      </View>

      {/* Quick Demo Action: Reset Tasks */}
      <TouchableOpacity style={styles.menuItem} onPress={handleResetData} activeOpacity={0.7}>
        <View style={styles.menuIconContainer}>
          <Ionicons name="refresh-circle-outline" size={22} color={colors.primary} />
        </View>
        <View style={styles.menuTextGroup}>
          <Text style={styles.menuTitle}>Reset Sample Tasks</Text>
          <Text style={styles.menuSubtitle}>Restore default demo tasks for viva presentation</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </TouchableOpacity>

      {/* Logout Button */}
      <CustomButton
        title="Log Out"
        onPress={handleLogout}
        variant="danger"
        icon="log-out-outline"
        style={styles.logoutButton}
      />
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
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarInitials: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  studentName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  studentEmail: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  deptBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  deptText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryDark,
    marginLeft: 6,
  },
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.cardBorder,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  infoKey: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  infoVal: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    maxWidth: '60%',
    textAlign: 'right',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuTextGroup: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  menuSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  logoutButton: {
    marginTop: 8,
  },
});
