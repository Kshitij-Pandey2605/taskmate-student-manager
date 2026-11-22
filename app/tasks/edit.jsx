// app/tasks/edit.jsx
// Edit Task Screen.
// Pre-fills existing task properties, allows updating Title, Description, Category, Priority,
// Status (Pending/Completed), and Due Date, with full validation.

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import taskService from '../../services/taskService';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import LoadingScreen from '../../components/LoadingScreen';
import colors from '../../constants/colors';

const CATEGORIES = ['Assignment', 'Exam', 'Project', 'Personal', 'Other'];
const PRIORITIES = ['High', 'Medium', 'Low'];
const STATUSES = ['Pending', 'Completed'];

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [initialLoading, setInitialLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Assignment');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Pending');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchExistingTask = async () => {
      try {
        const task = await taskService.getTaskById(id);
        if (task) {
          setTitle(task.title || '');
          setDescription(task.description || '');
          setCategory(task.category || 'Assignment');
          setPriority(task.priority || 'Medium');
          setStatus(task.status || 'Pending');
          setDueDate(task.dueDate || '');
        }
      } catch (err) {
        console.error('Error loading task for edit:', err);
        Alert.alert('Error', 'Could not load task details', [
          { text: 'Back', onPress: () => router.back() },
        ]);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchExistingTask();
  }, [id, router]);

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!dueDate.trim()) {
      newErrors.dueDate = 'Due date is required (YYYY-MM-DD)';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate.trim())) {
      newErrors.dueDate = 'Format must be YYYY-MM-DD';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validate()) return;

    setSaveLoading(true);
    try {
      await taskService.updateTask(id, {
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        status,
        dueDate: dueDate.trim(),
      });
      Alert.alert('Success', 'Task updated successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update task');
    } finally {
      setSaveLoading(false);
    }
  };

  if (initialLoading) {
    return <LoadingScreen message="Loading task for editing..." />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {/* Title */}
          <CustomInput
            label="Task Title *"
            placeholder="e.g. Operating Systems Assignment"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
            }}
            icon="create-outline"
            error={errors.title}
          />

          {/* Description */}
          <CustomInput
            label="Description"
            placeholder="Add details..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            icon="document-text-outline"
          />

          {/* Status Selection */}
          <Text style={styles.sectionLabel}>Status</Text>
          <View style={styles.chipsRow}>
            {STATUSES.map((st) => {
              const isSelected = status === st;
              return (
                <TouchableOpacity
                  key={st}
                  onPress={() => setStatus(st)}
                  style={[
                    styles.chip,
                    isSelected
                      ? { backgroundColor: st === 'Completed' ? colors.success : colors.warning, borderColor: 'transparent' }
                      : styles.inactiveChip,
                  ]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, isSelected ? { color: '#FFFFFF' } : { color: colors.textSecondary }]}>
                    {st}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Category Selection */}
          <Text style={styles.sectionLabel}>Category</Text>
          <View style={styles.chipsRow}>
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat;
              const catColors = colors.category[cat] || colors.category.Other;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCategory(cat)}
                  style={[
                    styles.chip,
                    isSelected
                      ? { backgroundColor: catColors.text, borderColor: catColors.text }
                      : { backgroundColor: catColors.bg, borderColor: catColors.border },
                  ]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, isSelected ? { color: '#FFFFFF' } : { color: catColors.text }]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Priority Selection */}
          <Text style={styles.sectionLabel}>Priority</Text>
          <View style={styles.chipsRow}>
            {PRIORITIES.map((p) => {
              const isSelected = priority === p;
              const prioColors = colors.priority[p] || colors.priority.Medium;
              return (
                <TouchableOpacity
                  key={p}
                  onPress={() => setPriority(p)}
                  style={[
                    styles.chip,
                    isSelected
                      ? { backgroundColor: prioColors.text, borderColor: prioColors.text }
                      : { backgroundColor: prioColors.bg, borderColor: prioColors.border },
                  ]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, isSelected ? { color: '#FFFFFF' } : { color: prioColors.text }]}>
                    {p} Priority
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Due Date */}
          <Text style={styles.sectionLabel}>Due Date (YYYY-MM-DD) *</Text>
          <CustomInput
            placeholder="YYYY-MM-DD"
            value={dueDate}
            onChangeText={(text) => {
              setDueDate(text);
              if (errors.dueDate) setErrors((prev) => ({ ...prev, dueDate: null }));
            }}
            icon="calendar-outline"
            error={errors.dueDate}
          />

          {/* Save & Cancel */}
          <CustomButton
            title="Save Changes"
            onPress={handleUpdate}
            loading={saveLoading}
            variant="primary"
            icon="save-outline"
            style={styles.submitBtn}
          />

          <CustomButton
            title="Cancel"
            onPress={() => router.back()}
            variant="ghost"
            style={styles.cancelBtn}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
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
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
    marginTop: 4,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  inactiveChip: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  submitBtn: {
    marginTop: 12,
    marginBottom: 8,
  },
  cancelBtn: {
    height: 40,
  },
});
