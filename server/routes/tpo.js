const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Drive = require('../models/Drive');
const JobRole = require('../models/JobRole');

// Get high-level placement and batch analytics for TPO
router.get('/stats', async (req, res) => {
  try {
    const students = await Student.find();
    const drives = await Drive.find();
    const roles = await JobRole.find();

    const totalStudents = students.length;
    if (totalStudents === 0) {
      return res.json({ totalStudents: 0, averageCgpa: 0, averageReadiness: 0 });
    }

    const totalCgpa = students.reduce((acc, s) => acc + (s.cgpa || 0), 0);
    const averageCgpa = Number((totalCgpa / totalStudents).toFixed(2));

    const totalReadiness = students.reduce((acc, s) => acc + (s.readinessScore || 0), 0);
    const averageReadiness = Math.round(totalReadiness / totalStudents);

    // Readiness Tiers
    const readinessBuckets = {
      high: students.filter((s) => (s.readinessScore || 0) >= 75).length,
      moderate: students.filter((s) => (s.readinessScore || 0) >= 50 && (s.readinessScore || 0) < 75).length,
      needsImprovement: students.filter((s) => (s.readinessScore || 0) < 50).length,
    };

    // Branch Breakdown
    const branchMap = {};
    students.forEach((s) => {
      const dept = s.department || 'Other';
      if (!branchMap[dept]) {
        branchMap[dept] = { count: 0, totalReadiness: 0, totalCgpa: 0, eligibleCount: 0 };
      }
      branchMap[dept].count += 1;
      branchMap[dept].totalReadiness += s.readinessScore || 0;
      branchMap[dept].totalCgpa += s.cgpa || 0;
      if (s.cgpa >= 7.0 && s.backlogs === 0) {
        branchMap[dept].eligibleCount += 1;
      }
    });

    const branchAnalytics = Object.keys(branchMap).map((dept) => ({
      department: dept,
      studentCount: branchMap[dept].count,
      averageReadiness: Math.round(branchMap[dept].totalReadiness / branchMap[dept].count),
      averageCgpa: Number((branchMap[dept].totalCgpa / branchMap[dept].count).toFixed(2)),
      eligiblePercentage: Math.round((branchMap[dept].eligibleCount / branchMap[dept].count) * 100),
    }));

    // Campus-wide Common Skill Gaps
    // Count how many students do NOT possess common target skills
    const benchmarkSkills = [
      'Data Structures & Algorithms',
      'System Design Basics',
      'Docker Basics',
      'Operating Systems & Concurrency',
      'Kubernetes Orchestration',
      'REST APIs & WebSockets',
      'Machine Learning (Scikit-Learn)',
      'DBMS & SQL',
    ];

    const missingSkillCounts = benchmarkSkills.map((skillName) => {
      const missingCount = students.filter((s) => {
        return !s.technicalSkills.some((ts) => ts.name.toLowerCase().includes(skillName.toLowerCase().slice(0, 8)));
      }).length;

      return {
        skillName,
        missingPercentage: Math.round((missingCount / totalStudents) * 100),
        studentsMissing: missingCount,
      };
    }).sort((a, b) => b.missingPercentage - a.missingPercentage);

    // Drives summary
    const activeDrivesCount = drives.filter((d) => d.status === 'Registration Open' || d.status === 'Upcoming').length;
    const totalSelections = drives.reduce((acc, d) => {
      const selected = (d.registeredStudents || []).filter((r) => r.status === 'Selected').length;
      return acc + selected;
    }, 0);

    res.json({
      totalStudents,
      averageCgpa,
      averageReadiness,
      activeDrivesCount,
      totalSelections,
      readinessBuckets,
      branchAnalytics,
      missingSkillCounts,
    });
  } catch (err) {
    console.error('TPO stats error:', err);
    res.status(500).json({ message: 'Error compiling TPO statistics', error: err.message });
  }
});

// Get cohort list with flexible filters
router.get('/cohort', async (req, res) => {
  try {
    const { department, minCgpa, maxBacklogs, minReadiness, targetRole, search } = req.query;

    const query = {};

    if (department && department !== 'All') {
      query.department = department;
    }
    if (minCgpa) {
      query.cgpa = { $gte: Number(minCgpa) };
    }
    if (maxBacklogs !== undefined && maxBacklogs !== '') {
      query.backlogs = { $lte: Number(maxBacklogs) };
    }
    if (minReadiness) {
      query.readinessScore = { $gte: Number(minReadiness) };
    }
    if (targetRole && targetRole !== 'All') {
      query.targetRole = targetRole;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { rollNo: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const students = await Student.find(query).sort({ readinessScore: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving cohort roster', error: err.message });
  }
});

// Candidate eligibility filter for a specific drive
router.get('/drive-eligibility/:driveId', async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.driveId);
    if (!drive) return res.status(404).json({ message: 'Drive not found' });

    const allStudents = await Student.find();

    const eligible = [];
    const ineligible = [];

    allStudents.forEach((student) => {
      const issues = [];
      if (student.cgpa < drive.criteria.minCgpa) {
        issues.push(`CGPA ${student.cgpa} < required ${drive.criteria.minCgpa}`);
      }
      if (student.backlogs > drive.criteria.maxBacklogs) {
        issues.push(`Backlogs ${student.backlogs} > allowed ${drive.criteria.maxBacklogs}`);
      }
      if (drive.criteria.allowedBranches && !drive.criteria.allowedBranches.includes(student.department)) {
        issues.push(`Department ${student.department} not allowed`);
      }

      if (issues.length === 0) {
        eligible.push({
          student,
          status: 'Eligible',
          readinessScore: student.readinessScore,
        });
      } else {
        ineligible.push({
          student,
          reasons: issues,
        });
      }
    });

    res.json({
      drive,
      eligibleCount: eligible.length,
      ineligibleCount: ineligible.length,
      eligible,
      ineligible,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error evaluating drive eligibility roster', error: err.message });
  }
});

module.exports = router;
