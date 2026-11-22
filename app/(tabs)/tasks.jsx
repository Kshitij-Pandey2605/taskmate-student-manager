// app/(tabs)/tasks.jsx
// Main Task Management Screen.
// Features search, status tabs (All, Pending, Completed), priority filters, category chips,
// due date sorting, quick toggle, deletion confirmation, and empty states.

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import taskService from '../../services/taskService';
import TaskCard from '../../components/TaskCard';
import EmptyState from '../../components/EmptyState';
import LoadingScreen from '../../components/LoadingScreen';
import colors from '../../constants/colors';

const STATUS_TABS = ['All', 'Pending', 'Completed'];
const PRIORITIES = ['All', 'High', 'Medium', 'Low'];
const CATEGORIES = ['All', 'Assignment', 'Exam', 'Project', 'Personal', 'Other'];

export default function TasksScreen() {
  const router = useRouter();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' = closest deadline first

  // Fetch tasks when screen gains focus
  const fetchTasks = async () => {
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
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

  // Toggle completion status
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await taskService.toggleTaskStatus(id, currentStatus);
      fetchTasks();
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  // Delete task after user confirms
  const handleDeleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  // Filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        // Status tab filter
        if (selectedStatus !== 'All' && t.status !== selectedStatus) {
          return false;
        }
        // Priority filter
        if (selectedPriority !== 'All' && t.priority !== selectedPriority) {
          return false;
        }
        // Category filter
        if (selectedCategory !== 'All' && t.category !== selectedCategory) {
          return false;
        }
        // Search query filter (matches title or description)
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchTitle = t.title.toLowerCase().includes(query);
          const matchDesc = t.description && t.description.toLowerCase().includes(query);
          if (!matchTitle && !matchDesc) return false;
        }
        return true;
      })
      .sort((a, b) => {
        // Sort by Due Date
        const dateA = a.dueDate || '9999-99-99';
        const dateB = b.dueDate || '9999-99-99';
        return sortOrder === 'asc' ? dateA.localeCompare(dateB) : dateB.localeCompare(dateA);
      });
  }, [tasks, selectedStatus, selectedPriority, selectedCategory, searchQuery, sortOrder]);

  if (loading && !refreshing) {
    return <LoadingScreen message="Loading student tasks..." />;
  }

  return (
    <View style={styles.container}>
      {/* Search Bar + Sort Button */}
      <View style={styles.searchHeader}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            placeholder="Search assignments, exams..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[styles.sortButton, sortOrder === 'desc' && styles.sortButtonActive]}
          onPress={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={sortOrder === 'asc' ? 'arrow-up-outline' : 'arrow-down-outline'}
            size={18}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Main Status Segment Tabs (All / Pending / Completed) */}
      <View style={styles.statusTabsRow}>
        {STATUS_TABS.map((status) => {
          const isActive = selectedStatus === status;
          return (
            <TouchableOpacity
              key={status}
              onPress={() => setSelectedStatus(status)}
              style={[styles.statusTab, isActive && styles.statusTabActive]}
              activeOpacity={0.7}
            >
              <Text style={[styles.statusTabText, isActive && styles.statusTabTextActive]}>
                {status}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Horizontal Category & Priority Filter Bar */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <Text style={styles.filterLabel}>Category:</Text>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[styles.chip, isSelected && styles.chipActive]}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>{cat}</Text>
              </TouchableOpacity>
            );
          })}

          <View style={styles.filterDivider} />

          <Text style={styles.filterLabel}>Priority:</Text>
          {PRIORITIES.map((p) => {
            const isSelected = selectedPriority === p;
            return (
              <TouchableOpacity
                key={p}
                onPress={() => setSelectedPriority(p)}
                style={[styles.chip, isSelected && styles.chipActive]}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>{p}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Tasks List */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onPress={() => router.push({ pathname: '/tasks/[id]', params: { id: item.id } })}
            onToggleStatus={handleToggleStatus}
            onEdit={() => router.push({ pathname: '/tasks/edit', params: { id: item.id } })}
            onDelete={handleDeleteTask}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
        ListEmptyComponent={
          <EmptyState
            icon="search-outline"
            title="No matching tasks"
            description={
              searchQuery || selectedCategory !== 'All' || selectedPriority !== 'All'
                ? 'Try resetting your search or filter settings.'
                : 'You currently have no tasks in this category.'
            }
            buttonTitle="+ Create Task"
            onButtonPress={() => router.push('/tasks/create')}
          />
        }
      />

      {/* Floating Action Button (+ New Task) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/tasks/create')}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
  },
  sortButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  sortButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  statusTabsRow: {
    flexDirection: 'row',
    backgroundColor: '#EEF2F6',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 4,
  },
  statusTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  statusTabActive: {
    backgroundColor: colors.card,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  statusTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  statusTabTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  filterBar: {
    marginBottom: 6,
  },
  filterScroll: {
    paddingHorizontal: 16,
    alignItems: 'center',
    paddingVertical: 4,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginRight: 6,
  },
  chip: {
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  filterDivider: {
    width: 1,
    height: 18,
    backgroundColor: colors.cardBorder,
    marginHorizontal: 8,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});
