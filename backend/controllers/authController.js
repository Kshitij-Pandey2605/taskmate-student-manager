// backend/controllers/authController.js
// Authentication Controller managing student registration, login, and profile retrieval.

const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new student account
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, department, password } = req.body;

    // Basic body check
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A student account with this email already exists. Please log in.',
      });
    }

    // Create user (password will be automatically hashed by pre-save hook in User model)
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      department: department ? department.trim() : 'General Engineering',
      password,
    });

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Student account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        department: user.department,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate student & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both college email and password',
      });
    }

    // Check for user and explicitly include password field (since it is select: false by default)
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please verify your credentials.',
      });
    }

    // Verify password match using bcrypt
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please verify your credentials.',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        department: user.department,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in student profile
// @route   GET /api/auth/me
// @access  Private (Requires JWT token)
const getMe = async (req, res, next) => {
  try {
    // req.user was attached by authMiddleware
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        department: req.user.department,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
