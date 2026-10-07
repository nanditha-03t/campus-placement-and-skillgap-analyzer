require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./config/db');
const seedDatabase = require('./seed/seedData');
const JobRole = require('./models/JobRole');

const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const analysisRoutes = require('./routes/analysis');
const driveRoutes = require('./routes/drives');
const assessmentRoutes = require('./routes/assessments');
const tpoRoutes = require('./routes/tpo');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/drives', driveRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/tpo', tpoRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Campus Placement & Skill Gap Analyzer API',
  });
});

// Start Server
const startServer = async () => {
  try {
    await connectDB();

    // Check if initial seeding is needed
    const roleCount = await JobRole.countDocuments();
    if (roleCount === 0) {
      console.log('Database is empty. Populating with realistic campus data & benchmark roles...');
      await seedDatabase();
    } else {
      console.log(`Database already has ${roleCount} benchmark job roles.`);
    }

    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
