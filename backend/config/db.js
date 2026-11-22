// backend/config/db.js
// Establishes connection to MongoDB database using Mongoose.
// In college viva, explain: Mongoose is an ODM (Object Data Modeling) library for MongoDB and Node.js.
// It manages relationships between data, provides schema validation, and translates between objects in code and database documents.

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskmate');
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
