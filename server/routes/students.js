const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const JobRole = require('../models/JobRole');
const { authMiddleware } = require('../middleware/auth');
const { analyzeSkillGap } = require('../services/analyzerService');

// Get profile of authenticated student or demo student if unauthenticated
router.get('/profile', async (req, res) => {
  try {
    let student = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const jwt = require('jsonwebtoken');
      const { JWT_SECRET } = require('../middleware/auth');
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        student = await Student.findOne({ user: decoded.id }).populate('appliedDrives.drive');
      } catch (e) {
        // Fallback to first student if token expired or invalid
      }
    }

    if (!student) {
      student = await Student.findOne({ email: 'student@campus.edu' }).populate('appliedDrives.drive');
    }

    if (!student) {
      student = await Student.findOne().populate('appliedDrives.drive');
    }

    if (!student) {
      return res.status(404).json({ message: 'No student profile found' });
    }

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving student profile', error: err.message });
  }
});

// Update student profile (CGPA, backlogs, target role, profiles)
router.put('/profile', async (req, res) => {
  try {
    const { id, cgpa, backlogs, targetRole, department, name, githubProfile, leetcodeProfile, linkedinProfile, resumeUploaded } = req.body;

    let query = {};
    if (id) {
      query._id = id;
    } else {
      query.email = 'student@campus.edu';
    }

    const student = await Student.findOne(query);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (cgpa !== undefined) student.cgpa = Number(cgpa);
    if (backlogs !== undefined) student.backlogs = Number(backlogs);
    if (targetRole) student.targetRole = targetRole;
    if (department) student.department = department;
    if (name) student.name = name;
    if (githubProfile !== undefined) student.githubProfile = githubProfile;
    if (leetcodeProfile !== undefined) student.leetcodeProfile = leetcodeProfile;
    if (linkedinProfile !== undefined) student.linkedinProfile = linkedinProfile;
    if (resumeUploaded !== undefined) student.resumeUploaded = resumeUploaded;

    // Recalculate readiness score
    const targetJob = await JobRole.findOne({ roleName: student.targetRole });
    if (targetJob) {
      const analysis = analyzeSkillGap(student, targetJob);
      student.readinessScore = analysis.overallReadiness;
    }

    await student.save();
    res.json({ message: 'Profile updated successfully', student });
  } catch (err) {
    res.status(500).json({ message: 'Error updating student profile', error: err.message });
  }
});

// Add or update a technical skill
router.post('/skills', async (req, res) => {
  try {
    const { studentId, name, level = 'Intermediate', category = 'Programming', score } = req.body;

    let student = null;
    if (studentId) {
      student = await Student.findById(studentId);
    } else {
      student = await Student.findOne({ email: 'student@campus.edu' });
    }

    if (!student) return res.status(404).json({ message: 'Student not found' });

    const existingIndex = student.technicalSkills.findIndex(
      (s) => s.name.toLowerCase() === name.toLowerCase()
    );

    const calculatedScore = score || (level === 'Advanced' ? 90 : level === 'Intermediate' ? 70 : 45);

    if (existingIndex >= 0) {
      student.technicalSkills[existingIndex].level = level;
      student.technicalSkills[existingIndex].score = calculatedScore;
      student.technicalSkills[existingIndex].category = category;
    } else {
      student.technicalSkills.push({
        name,
        level,
        category,
        score: calculatedScore,
        verified: false,
      });
    }

    // Refresh readiness
    const targetJob = await JobRole.findOne({ roleName: student.targetRole });
    if (targetJob) {
      const analysis = analyzeSkillGap(student, targetJob);
      student.readinessScore = analysis.overallReadiness;
    }

    await student.save();
    res.json({ message: 'Skill updated successfully', skills: student.technicalSkills, readinessScore: student.readinessScore });
  } catch (err) {
    res.status(500).json({ message: 'Error modifying skill', error: err.message });
  }
});

// Delete a technical skill
router.delete('/skills/:name', async (req, res) => {
  try {
    const skillName = decodeURIComponent(req.params.name);
    const student = await Student.findOne({ email: 'student@campus.edu' });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    student.technicalSkills = student.technicalSkills.filter(
      (s) => s.name.toLowerCase() !== skillName.toLowerCase()
    );

    // Refresh readiness
    const targetJob = await JobRole.findOne({ roleName: student.targetRole });
    if (targetJob) {
      const analysis = analyzeSkillGap(student, targetJob);
      student.readinessScore = analysis.overallReadiness;
    }

    await student.save();
    res.json({ message: 'Skill deleted', skills: student.technicalSkills, readinessScore: student.readinessScore });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting skill', error: err.message });
  }
});

// Add project
router.post('/projects', async (req, res) => {
  try {
    const { title, techStack, description, githubUrl, liveUrl } = req.body;
    const student = await Student.findOne({ email: 'student@campus.edu' });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    student.projects.push({
      title,
      techStack: Array.isArray(techStack) ? techStack : (techStack ? techStack.split(',').map((t) => t.trim()) : []),
      description,
      githubUrl,
      liveUrl,
    });

    await student.save();
    res.json({ message: 'Project added', projects: student.projects });
  } catch (err) {
    res.status(500).json({ message: 'Error adding project', error: err.message });
  }
});

module.exports = router;
