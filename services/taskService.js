// services/taskService.js
// Task service managing all task CRUD operations.
// In Phase 1: Provides rich initial student tasks and local state simulation for testing UI.
// In Phase 2: Interacts with the backend REST endpoints /api/tasks.

import api from './api';

// Realistic student preview tasks for Phase 1 UI testing and viva presentation
export const INITIAL_PREVIEW_TASKS = [
  {
    id: 'task_001',
    title: 'Database Systems Lab Assignment 4',
    description: 'Implement SQL queries for nested joins and write execution plan explanations for the submission report.',
    category: 'Assignment',
    priority: 'High',
    dueDate: '2026-11-25',
    status: 'Pending',
    createdAt: '2026-11-20',
  },
  {
    id: 'task_002',
    title: 'Operating Systems Midterm Revision',
    description: 'Review CPU Scheduling algorithms (Round Robin, SRTF), Banker Algorithm for Deadlocks, and Paging concepts.',
    category: 'Exam',
    priority: 'High',
    dueDate: '2026-11-26',
    status: 'Pending',
    createdAt: '2026-11-19',
  },
  {
    id: 'task_003',
    title: 'Web Technologies Capstone Project Design',
    description: 'Complete UI wireframes in Figma and prepare the architecture diagram for the student dashboard module.',
    category: 'Project',
    priority: 'Medium',
    dueDate: '2026-11-29',
    status: 'Pending',
    createdAt: '2026-11-18',
  },
  {
    id: 'task_004',
    title: 'Submit College Library Book Renewal',
    description: 'Renew Algorithms by Cormen and Clean Code textbook at the central library counter.',
    category: 'Personal',
    priority: 'Low',
    dueDate: '2026-11-24',
    status: 'Completed',
    createdAt: '2026-11-17',
  },
  {
    id: 'task_005',
    title: 'Computer Networks Seminar Presentation',
    description: 'Prepare a 15-minute presentation deck on TCP 3-way Handshake and Congestion Control mechanisms.',
    category: 'Assignment',
    priority: 'Medium',
    dueDate: '2026-11-30',
    status: 'Pending',
    createdAt: '2026-11-21',
  },
  {
    id: 'task_006',
    title: 'Semester Fee Receipt Submission',
    description: 'Submit fee transaction acknowledgement slip to the college finance office room 104.',
    category: 'Other',
    priority: 'Low',
    dueDate: '2026-11-22',
    status: 'Completed',
    createdAt: '2026-11-15',
  },
];

// In-memory array for Phase 1 local UI testing
let localTasks = [...INITIAL_PREVIEW_TASKS];

const taskService = {
  // Fetch all tasks
  getTasks: async () => {
    // In Phase 2:
    // const response = await api.get('/tasks');
    // return response.data;
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...localTasks]);
      }, 300);
    });
  },

  // Fetch single task by ID
  getTaskById: async (id) => {
    // In Phase 2:
    // const response = await api.get(`/tasks/${id}`);
    // return response.data;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const found = localTasks.find((t) => t.id === id);
        if (found) resolve({ ...found });
        else reject(new Error('Task not found'));
      }, 200);
    });
  },

  // Create a new task
  createTask: async (taskData) => {
    // In Phase 2:
    // const response = await api.post('/tasks', taskData);
    // return response.data;
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTask = {
          id: 'task_' + Date.now(),
          title: taskData.title.trim(),
          description: taskData.description ? taskData.description.trim() : '',
          category: taskData.category || 'Assignment',
          priority: taskData.priority || 'Medium',
          dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
          status: 'Pending',
          createdAt: new Date().toISOString().split('T')[0],
        };
        localTasks = [newTask, ...localTasks];
        resolve(newTask);
      }, 300);
    });
  },

  // Update existing task
  updateTask: async (id, updatedFields) => {
    // In Phase 2:
    // const response = await api.put(`/tasks/${id}`, updatedFields);
    // return response.data;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = localTasks.findIndex((t) => t.id === id);
        if (index !== -1) {
          localTasks[index] = { ...localTasks[index], ...updatedFields };
          resolve(localTasks[index]);
        } else {
          reject(new Error('Task not found to update'));
        }
      }, 250);
    });
  },

  // Toggle task status between Pending and Completed
  toggleTaskStatus: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = localTasks.findIndex((t) => t.id === id);
        if (index !== -1) {
          const newStatus = localTasks[index].status === 'Completed' ? 'Pending' : 'Completed';
          localTasks[index] = { ...localTasks[index], status: newStatus };
          resolve(localTasks[index]);
        } else {
          reject(new Error('Task not found'));
        }
      }, 200);
    });
  },

  // Delete a task by ID
  deleteTask: async (id) => {
    // In Phase 2:
    // const response = await api.delete(`/tasks/${id}`);
    // return response.data;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = localTasks.findIndex((t) => t.id === id);
        if (index !== -1) {
          const deleted = localTasks.splice(index, 1);
          resolve(deleted[0]);
        } else {
          reject(new Error('Task not found to delete'));
        }
      }, 200);
    });
  },

  // Reset tasks to default preview data (helpful for testing)
  resetPreviewTasks: () => {
    localTasks = [...INITIAL_PREVIEW_TASKS];
  },
};

export default taskService;
