const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');
const { authMiddleware, JWT_SECRET } = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'student', department, rollNo, batch, cgpa } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    if (role === 'student') {
      const student = new Student({
        user: user._id,
        name,
        email,
        rollNo: rollNo || `22CS${Math.floor(1000 + Math.random() * 9000)}`,
        department: department || 'CSE',
        batch: batch || '2026',
        cgpa: cgpa ? Number(cgpa) : 8.0,
        technicalSkills: [
          { name: 'JavaScript / TypeScript', level: 'Intermediate', score: 70 },
          { name: 'Data Structures & Algorithms', level: 'Beginner', score: 55 },
          { name: 'DBMS & SQL', level: 'Intermediate', score: 65 },
        ],
      });
      await student.save();
      user.studentProfile = student._id;
    }

    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentProfile: user.studentProfile,
      },
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error during registration', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentProfile: user.studentProfile,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
});

// Get current user profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').populate('studentProfile');
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving user profile', error: err.message });
  }
});

module.exports = router;
