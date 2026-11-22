// backend/utils/generateToken.js
// Generates a signed JSON Web Token (JWT) for student authentication.
// In college viva, explain: JWT is stateless. The server doesn't need to store session IDs in memory.
// The client sends this token in the 'Authorization: Bearer <token>' header for every protected API request.

const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'taskmate_super_secret_jwt_key_2026_student_manager', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

module.exports = generateToken;
