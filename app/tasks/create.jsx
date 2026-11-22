// app/tasks/create.jsx
// Add Task Screen.
// Allows students to create a new task with Title, Description, Category, Priority, and Due Date.
// Includes quick deadline presets (Today, Tomorrow, 3 Days, Next Week) and clean validation.

import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import taskService from '../../services/taskService';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import colors from '../../constants/colors';

const CATEGORIES = ['Assignment', 'Exam', 'Project', 'Personal', 'Other'];
const PRIORITIES = ['High', 'Medium', 'Low'];

export default function CreateTaskScreen() {
  const router = useRouter();

  // Helper to get formatted YYYY-MM-DD
  const formatDateString = (daysToAdd = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + daysToAdd);
    return d.toISOString().split('T')[0];
  };

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Assignment');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState(formatDateString(3)); // Default: 3 days from now
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Validation
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
      newErrors.dueDate = 'Format must be YYYY-MM-DD (e.g. 2026-11-25)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      await taskService.createTask({
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        dueDate: dueDate.trim(),
      });
      Alert.alert('Success', 'Task created successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

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
          {/* Title Input */}
          <CustomInput
            label="Task Title *"
            placeholder="e.g. Operating Systems Lab Assignment 3"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
            }}
            icon="create-outline"
            error={errors.title}
          />

          {/* Description Input */}
          <CustomInput
            label="Description (Optional)"
            placeholder="Add details, instructions, references..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            icon="document-text-outline"
          />

          {/* Category Selector */}
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
                  <Text
                    style={[
                      styles.chipText,
                      isSelected ? { color: '#FFFFFF' } : { color: catColors.text },
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Priority Selector */}
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
                  <Text
                    style={[
                      styles.chipText,
                      isSelected ? { color: '#FFFFFF' } : { color: prioColors.text },
                    ]}
                  >
                    {p} Priority
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Due Date & Quick Presets */}
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

          <View style={styles.presetsRow}>
            <TouchableOpacity
              style={styles.presetPill}
              onPress={() => setDueDate(formatDateString(0))}
              activeOpacity={0.7}
            >
              <Text style={styles.presetText}>Today</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.presetPill}
              onPress={() => setDueDate(formatDateString(1))}
              activeOpacity={0.7}
            >
              <Text style={styles.presetText}>Tomorrow</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.presetPill}
              onPress={() => setDueDate(formatDateString(3))}
              activeOpacity={0.7}
            >
              <Text style={styles.presetText}>In 3 Days</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.presetPill}
              onPress={() => setDueDate(formatDateString(7))}
              activeOpacity={0.7}
            >
              <Text style={styles.presetText}>Next Week</Text>
            </TouchableOpacity>
          </View>

          {/* Save & Cancel Buttons */}
          <CustomButton
            title="Create Task"
            onPress={handleCreate}
            loading={isLoading}
            variant="primary"
            icon="add-circle-outline"
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
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  presetsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: -8,
  },
  presetPill: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  presetText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  submitBtn: {
    marginTop: 8,
    marginBottom: 8,
  },
  cancelBtn: {
    height: 40,
  },
});
