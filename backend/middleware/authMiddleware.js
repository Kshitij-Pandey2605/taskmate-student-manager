// backend/middleware/authMiddleware.js
// Authentication Middleware protecting private routes.
// Extracts JWT Bearer token, verifies its signature, and binds the student User document to req.user.

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and begins with 'Bearer '
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Format: "Bearer <token>" -> split by space and take the second item
      token = req.headers.authorization.split(' ')[1];

      // Verify token signature against JWT_SECRET
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'taskmate_super_secret_jwt_key_2026_student_manager'
      );

      // Find user by ID in database and exclude password hash from the attached object
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'The student account associated with this token no longer exists.',
        });
      }

      req.user = user;
      next(); // Proceed to the requested controller
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session token. Please log in again.',
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authorization token was provided.',
    });
  }
};

module.exports = { protect };
