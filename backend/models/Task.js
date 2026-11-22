// backend/models/Task.js
// Task Schema and Model for assignments, exams, projects, and personal tasks.
// Each task document is explicitly tied to an authenticated student's User ID.

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task must belong to a student user'],
      index: true, // Speeds up queries filtering by logged-in student
    },
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      enum: {
        values: ['Assignment', 'Exam', 'Project', 'Personal', 'Other'],
        message: '{VALUE} is not a valid task category',
      },
      default: 'Assignment',
    },
    priority: {
      type: String,
      required: [true, 'Please specify priority'],
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: '{VALUE} is not a valid priority level',
      },
      default: 'Medium',
    },
    dueDate: {
      type: String, // Stored as ISO YYYY-MM-DD string for reliable cross-platform comparison
      required: [true, 'Please provide a due date (YYYY-MM-DD)'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in YYYY-MM-DD format'],
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Completed'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Pending',
    },
  },
  {
    timestamps: true, // Automatically populates createdAt and updatedAt
  }
);

// Virtual property: Checks whether task is overdue dynamically
taskSchema.virtual('isOverdue').get(function () {
  if (this.status === 'Completed' || !this.dueDate) return false;
  const today = new Date().toISOString().split('T')[0];
  return this.dueDate < today;
});

// Configure toJSON so virtual fields and clean object formats are sent to frontend
taskSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret.__v;
    return ret;
  },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
