const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const JobRole = require('../models/JobRole');
const { analyzeSkillGap } = require('../services/analyzerService');

// Get all industry target roles
router.get('/roles', async (req, res) => {
  try {
    const roles = await JobRole.find();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving job roles', error: err.message });
  }
});

// Run skill gap analysis for the current student against their target role or requested role
router.get('/gap', async (req, res) => {
  try {
    const { roleName, studentEmail } = req.query;

    const email = studentEmail || 'student@campus.edu';
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const selectedRoleName = roleName || student.targetRole || 'Software Development Engineer (SDE)';
    const jobRole = await JobRole.findOne({ roleName: selectedRoleName });

    if (!jobRole) {
      return res.status(404).json({ message: `Role "${selectedRoleName}" not found in benchmark database` });
    }

    const analysisResult = analyzeSkillGap(student, jobRole);

    res.json({
      student: {
        id: student._id,
        name: student.name,
        rollNo: student.rollNo,
        department: student.department,
        cgpa: student.cgpa,
        backlogs: student.backlogs,
        currentSkills: student.technicalSkills,
        targetRole: student.targetRole,
      },
      jobRole: {
        roleName: jobRole.roleName,
        category: jobRole.category,
        tier: jobRole.tier,
        averageCtcLpa: jobRole.averageCtcLpa,
        topCompaniesHiring: jobRole.topCompaniesHiring,
        interviewRounds: jobRole.interviewRounds,
      },
      analysis: analysisResult,
    });
  } catch (err) {
    console.error('Skill gap analysis error:', err);
    res.status(500).json({ message: 'Error running skill gap analysis', error: err.message });
  }
});

// Ad-hoc skill test: Analyze custom skill set and CGPA against a role
router.post('/simulate', async (req, res) => {
  try {
    const { roleName, skills, cgpa = 8.0, backlogs = 0 } = req.body;

    const jobRole = await JobRole.findOne({ roleName });
    if (!jobRole) {
      return res.status(404).json({ message: 'Target role not found' });
    }

    const simulatedStudent = {
      cgpa: Number(cgpa),
      backlogs: Number(backlogs),
      technicalSkills: (skills || []).map((s) => ({
        name: typeof s === 'string' ? s : s.name,
        level: s.level || 'Intermediate',
        score: s.score || 75,
      })),
      projects: [{ title: 'Simulated Project' }],
    };

    const analysis = analyzeSkillGap(simulatedStudent, jobRole);
    res.json(analysis);
  } catch (err) {
    res.status(500).json({ message: 'Error simulating skill analysis', error: err.message });
  }
});

module.exports = router;
