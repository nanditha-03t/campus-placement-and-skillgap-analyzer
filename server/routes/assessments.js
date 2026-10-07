const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');
const Student = require('../models/Student');
const JobRole = require('../models/JobRole');
const { analyzeSkillGap } = require('../services/analyzerService');

// Get all mock assessments
router.get('/', async (req, res) => {
  try {
    const assessments = await Assessment.find().select('-questions.correctOptionIndex -questions.explanation');
    res.json(assessments);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving assessments', error: err.message });
  }
});

// Get a specific assessment with all questions
router.get('/:id', async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });
    res.json(assessment);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving assessment', error: err.message });
  }
});

// Submit assessment answers and evaluate
router.post('/:id/submit', async (req, res) => {
  try {
    const { answers } = req.body; // Map or object of { questionIndex: chosenOptionIndex }
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });

    let correctCount = 0;
    const totalCount = assessment.questions.length;
    const questionReview = [];

    assessment.questions.forEach((q, index) => {
      const userChoice = answers[index];
      const isCorrect = userChoice === q.correctOptionIndex;
      if (isCorrect) correctCount += 1;

      questionReview.push({
        questionText: q.questionText,
        options: q.options,
        userChoice,
        correctOptionIndex: q.correctOptionIndex,
        isCorrect,
        explanation: q.explanation,
        skillTag: q.skillTag,
      });
    });

    const percentage = Math.round((correctCount / totalCount) * 100);

    // Update student's record and verify corresponding skill
    const student = await Student.findOne({ email: 'student@campus.edu' });
    if (student) {
      student.assessmentScores.push({
        topic: assessment.title,
        score: correctCount,
        total: totalCount,
        percentage,
        date: new Date(),
      });

      // Verify skills related to this assessment if passed with >= 70%
      if (percentage >= 70) {
        assessment.questions.forEach((q) => {
          const existingSkill = student.technicalSkills.find(
            (s) => s.name.toLowerCase() === q.skillTag.toLowerCase()
          );
          if (existingSkill) {
            existingSkill.verified = true;
            existingSkill.score = Math.max(existingSkill.score, percentage);
          } else {
            student.technicalSkills.push({
              name: q.skillTag,
              category: q.category.includes('DSA') ? 'Core CS' : 'Frameworks',
              level: percentage >= 85 ? 'Advanced' : 'Intermediate',
              score: percentage,
              verified: true,
            });
          }
        });
      }

      // Re-evaluate overall readiness
      const targetJob = await JobRole.findOne({ roleName: student.targetRole });
      if (targetJob) {
        const analysis = analyzeSkillGap(student, targetJob);
        student.readinessScore = analysis.overallReadiness;
      }

      await student.save();
    }

    res.json({
      score: correctCount,
      total: totalCount,
      percentage,
      passed: percentage >= 70,
      questionReview,
      updatedReadinessScore: student ? student.readinessScore : null,
    });
  } catch (err) {
    console.error('Assessment submission error:', err);
    res.status(500).json({ message: 'Error evaluating assessment', error: err.message });
  }
});

module.exports = router;
