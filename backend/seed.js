// backend/seed.js
// Database seeder script for TaskMate.
// Populates MongoDB with a default student account and realistic college coursework tasks.

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Task = require('./models/Task');
const connectDB = require('./config/db');

dotenv.config();

const sampleTasks = [
  {
    title: 'Database Systems Lab Assignment 4',
    description: 'Implement SQL queries for nested joins and write execution plan explanations for the submission report.',
    category: 'Assignment',
    priority: 'High',
    dueDate: '2026-11-25',
    status: 'Pending',
  },
  {
    title: 'Operating Systems Midterm Revision',
    description: 'Review CPU Scheduling algorithms (Round Robin, SRTF), Banker Algorithm for Deadlocks, and Paging concepts.',
    category: 'Exam',
    priority: 'High',
    dueDate: '2026-11-26',
    status: 'Pending',
  },
  {
    title: 'Web Technologies Capstone Project Design',
    description: 'Complete UI wireframes in Figma and prepare the architecture diagram for the student dashboard module.',
    category: 'Project',
    priority: 'Medium',
    dueDate: '2026-11-29',
    status: 'Pending',
  },
  {
    title: 'Submit College Library Book Renewal',
    description: 'Renew Algorithms by Cormen and Clean Code textbook at the central library counter.',
    category: 'Personal',
    priority: 'Low',
    dueDate: '2026-11-24',
    status: 'Completed',
  },
  {
    title: 'Computer Networks Seminar Presentation',
    description: 'Prepare a 15-minute presentation deck on TCP 3-way Handshake and Congestion Control mechanisms.',
    category: 'Assignment',
    priority: 'Medium',
    dueDate: '2026-11-30',
    status: 'Pending',
  },
  {
    title: 'Semester Fee Receipt Submission',
    description: 'Submit fee transaction acknowledgement slip to the college finance office room 104.',
    category: 'Other',
    priority: 'Low',
    dueDate: '2026-11-22',
    status: 'Completed',
  },
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('🌱 Seeding TaskMate database...');

    // Find or create default demo student
    let user = await User.findOne({ email: 'alex.student@college.edu' });
    if (!user) {
      user = await User.create({
        name: 'Alex Johnson',
        email: 'alex.student@college.edu',
        department: 'Computer Science & Engineering',
        password: 'student123',
      });
      console.log('✅ Created demo student: alex.student@college.edu');
    } else {
      console.log('ℹ️ Demo student already exists');
    }

    // Clear existing tasks for this demo user to avoid duplicates
    await Task.deleteMany({ user: user._id });

    // Insert sample tasks tied to this student
    const tasksWithUser = sampleTasks.map((t) => ({
      ...t,
      user: user._id,
    }));

    await Task.insertMany(tasksWithUser);
    console.log(`✅ Seeded ${tasksWithUser.length} tasks for ${user.email}`);

    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedData();
