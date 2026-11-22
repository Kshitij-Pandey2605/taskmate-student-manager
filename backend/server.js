// backend/server.js
// Main entry point for TaskMate Express REST API server.

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware: Enable Cross-Origin Resource Sharing
app.use(cors());

// Middleware: Parse incoming JSON request bodies
app.use(express.json());

// API Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TaskMate Student API Server is running smoothly 🚀',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// 404 & Central Error Handling Middleware (must be after routes)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 TaskMate Backend Server listening on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`⚙️  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`====================================================`);
});
