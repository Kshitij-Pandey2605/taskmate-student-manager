// backend/controllers/taskController.js
// Task Controller handling CRUD operations for academic assignments, exams, and personal tasks.
// Enforces strict data ownership: students can ONLY read, update, or delete their own tasks.

const Task = require('../models/Task');

// @desc    Get all tasks for the logged in student
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { status, category, priority, search, sort = 'asc' } = req.query;

    // Base query always filters by the authenticated student
    const query = { user: req.user._id };

    // Optional status filter
    if (status && status !== 'All') {
      query.status = status;
    }

    // Optional category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Optional priority filter
    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    // Optional text search filter
    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Sort order: asc = earliest deadline first; desc = latest deadline first
    const sortDirection = sort === 'desc' ? -1 : 1;

    const tasks = await Task.find(query).sort({ dueDate: sortDirection, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found with the specified ID',
      });
    }

    // Ownership check: ensure student owns this task
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to access another student’s task.',
      });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, category, priority, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required',
      });
    }

    if (!dueDate || !dueDate.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Due date is required (YYYY-MM-DD)',
      });
    }

    // Create task linked to the authenticated user ID
    const task = await Task.create({
      user: req.user._id,
      title: title.trim(),
      description: description ? description.trim() : '',
      category: category || 'Assignment',
      priority: priority || 'Medium',
      dueDate: dueDate.trim(),
      status: 'Pending',
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found to update',
      });
    }

    // Ownership verification
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You cannot edit tasks belonging to other users.',
      });
    }

    // Update only allowed fields
    const { title, description, category, priority, dueDate, status } = req.body;

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (category !== undefined) task.category = category;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate.trim();
    if (status !== undefined) task.status = status;

    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found to delete',
      });
    }

    // Ownership verification
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You cannot delete another student’s task.',
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
