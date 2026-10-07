const express = require('express');
const router = express.Router();
const Drive = require('../models/Drive');
const Student = require('../models/Student');

// Get all recruitment drives with student-specific eligibility calculated
router.get('/', async (req, res) => {
  try {
    const student = await Student.findOne({ email: 'student@campus.edu' });
    const drives = await Drive.find().sort({ driveDate: 1 }).lean();

    const enrichedDrives = drives.map((d) => {
      let isEligible = true;
      const reasons = [];

      if (student) {
        if (student.cgpa < d.criteria.minCgpa) {
          isEligible = false;
          reasons.push(`CGPA (${student.cgpa}) is below required minimum (${d.criteria.minCgpa})`);
        }
        if (student.backlogs > d.criteria.maxBacklogs) {
          isEligible = false;
          reasons.push(`Active backlogs (${student.backlogs}) exceed maximum allowed (${d.criteria.maxBacklogs})`);
        }
        if (d.criteria.allowedBranches && !d.criteria.allowedBranches.includes(student.department)) {
          isEligible = false;
          reasons.push(`Department ${student.department} is not in eligible branches (${d.criteria.allowedBranches.join(', ')})`);
        }

        // Check registration status
        const isRegistered = d.registeredStudents.some(
          (reg) => reg.student && reg.student.toString() === student._id.toString()
        );

        return {
          ...d,
          isEligible,
          eligibilityReasons: reasons,
          isRegistered,
          applicantCount: d.registeredStudents ? d.registeredStudents.length : 0,
        };
      }

      return {
        ...d,
        isEligible: true,
        eligibilityReasons: [],
        isRegistered: false,
        applicantCount: d.registeredStudents ? d.registeredStudents.length : 0,
      };
    });

    res.json(enrichedDrives);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving drives', error: err.message });
  }
});

// Student applies / registers for a drive
router.post('/:id/apply', async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.id);
    if (!drive) return res.status(404).json({ message: 'Drive not found' });

    const student = await Student.findOne({ email: 'student@campus.edu' });
    if (!student) return res.status(404).json({ message: 'Student profile not found' });

    // Verify eligibility
    if (student.cgpa < drive.criteria.minCgpa || student.backlogs > drive.criteria.maxBacklogs) {
      return res.status(400).json({ message: 'You do not meet the minimum eligibility criteria for this drive.' });
    }

    const alreadyRegistered = drive.registeredStudents.some(
      (r) => r.student.toString() === student._id.toString()
    );

    if (alreadyRegistered) {
      return res.status(400).json({ message: 'Already registered for this drive' });
    }

    drive.registeredStudents.push({
      student: student._id,
      status: 'Registered',
      matchScore: student.readinessScore || 70,
    });

    student.appliedDrives.push({
      drive: drive._id,
      status: 'Applied',
    });

    await drive.save();
    await student.save();

    res.json({ message: `Successfully registered for ${drive.companyName} drive!` });
  } catch (err) {
    res.status(500).json({ message: 'Error registering for drive', error: err.message });
  }
});

// TPO adds a new campus recruitment drive
router.post('/', async (req, res) => {
  try {
    const { companyName, role, ctcLpa, driveDate, location, minCgpa, maxBacklogs, allowedBranches, requiredSkills, jobDescription } = req.body;

    const newDrive = new Drive({
      companyName,
      role,
      ctcLpa: Number(ctcLpa),
      driveDate: driveDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      location: location || 'Campus / Virtual',
      jobDescription,
      criteria: {
        minCgpa: Number(minCgpa) || 7.0,
        maxBacklogs: Number(maxBacklogs) || 0,
        allowedBranches: allowedBranches || ['CSE', 'IT', 'AI & DS', 'ECE'],
        requiredSkills: requiredSkills || [],
      },
    });

    await newDrive.save();
    res.status(201).json({ message: 'Campus drive announced successfully', drive: newDrive });
  } catch (err) {
    res.status(500).json({ message: 'Error creating drive', error: err.message });
  }
});

module.exports = router;
