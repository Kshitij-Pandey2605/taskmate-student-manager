// services/taskService.js
// Task Service executing live CRUD operations against the Express & MongoDB backend.

import api from './api';

const taskService = {
  // Fetch all tasks for the authenticated user, with optional filters
  getTasks: async (filters = {}) => {
    const params = {};
    if (filters.status && filters.status !== 'All') params.status = filters.status;
    if (filters.category && filters.category !== 'All') params.category = filters.category;
    if (filters.priority && filters.priority !== 'All') params.priority = filters.priority;
    if (filters.search) params.search = filters.search;
    if (filters.sort) params.sort = filters.sort;

    const response = await api.get('/tasks', { params });
    return response.data.tasks || [];
  },

  // Fetch single task by ID
  getTaskById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data.task;
  },

  // Create a new task
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data.task;
  },

  // Update an existing task
  updateTask: async (id, updatedFields) => {
    const response = await api.put(`/tasks/${id}`, updatedFields);
    return response.data.task;
  },

  // Toggle completion status between Pending and Completed
  toggleTaskStatus: async (id, currentStatus) => {
    const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    const response = await api.put(`/tasks/${id}`, { status: newStatus });
    return response.data.task;
  },

  // Delete a task by ID
  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};

export default taskService;
