/**
 * Core Skill Gap & Placement Readiness Analysis Engine
 */

const LEVEL_SCORES = {
  Beginner: 45,
  Intermediate: 75,
  Advanced: 100,
};

const IMPORTANCE_WEIGHTS = {
  Critical: 10,
  High: 8,
  Medium: 5,
  Bonus: 3,
};

function normalizeSkill(str) {
  return str ? str.trim().toLowerCase().replace(/[^a-z0-9]/g, '') : '';
}

function analyzeSkillGap(student, jobRole) {
  const studentSkillsMap = new Map();
  (student.technicalSkills || []).forEach((s) => {
    studentSkillsMap.set(normalizeSkill(s.name), {
      name: s.name,
      level: s.level || 'Intermediate',
      score: s.score || LEVEL_SCORES[s.level] || 70,
      verified: s.verified || false,
      category: s.category || 'Programming',
    });
  });

  let totalWeightedScore = 0;
  let maxPossibleScore = 0;

  const matchedSkills = [];
  const criticalGaps = [];
  const recommendedGaps = [];
  const bonusGaps = [];

  const categoryBreakdown = {};

  (jobRole.requiredSkills || []).forEach((req) => {
    const weight = req.weight || IMPORTANCE_WEIGHTS[req.importance] || 5;
    maxPossibleScore += weight * 100;

    const normReq = normalizeSkill(req.name);
    // Exact or partial substring match
    let matchedStudentSkill = studentSkillsMap.get(normReq);
    if (!matchedStudentSkill) {
      for (const [key, val] of studentSkillsMap.entries()) {
        if (key.includes(normReq) || normReq.includes(key)) {
          matchedStudentSkill = val;
          break;
        }
      }
    }

    if (!categoryBreakdown[req.category]) {
      categoryBreakdown[req.category] = { total: 0, acquired: 0 };
    }
    categoryBreakdown[req.category].total += 1;

    if (matchedStudentSkill) {
      categoryBreakdown[req.category].acquired += 1;
      const studentSkillScore = matchedStudentSkill.score || LEVEL_SCORES[matchedStudentSkill.level] || 70;
      totalWeightedScore += weight * studentSkillScore;

      const isSufficient = studentSkillScore >= (LEVEL_SCORES[req.minimumLevel] || 60);

      matchedSkills.push({
        name: req.name,
        category: req.category,
        importance: req.importance,
        studentLevel: matchedStudentSkill.level,
        requiredLevel: req.minimumLevel,
        score: studentSkillScore,
        status: isSufficient ? 'Proficient' : 'Needs Reinforcement',
        verified: matchedStudentSkill.verified,
      });
    } else {
      // Skill is missing!
      const gapItem = {
        name: req.name,
        category: req.category,
        importance: req.importance,
        requiredLevel: req.minimumLevel,
        estimatedHoursToLearn: req.importance === 'Critical' ? 35 : 20,
      };

      if (req.importance === 'Critical') {
        criticalGaps.push(gapItem);
      } else if (req.importance === 'High') {
        recommendedGaps.push(gapItem);
      } else {
        bonusGaps.push(gapItem);
      }
    }
  });

  // Calculate skill match percentage (0 - 100)
  const skillMatchPercentage = maxPossibleScore > 0 ? Math.round((totalWeightedScore / maxPossibleScore) * 100) : 70;

  // Academic score (0-100)
  const cgpa = student.cgpa || 7.0;
  const backlogs = student.backlogs || 0;
  let academicScore = Math.min(100, Math.round((cgpa / 10) * 100));
  if (backlogs > 0) {
    academicScore = Math.max(20, academicScore - backlogs * 15);
  }

  const isAcademicEligible = cgpa >= (jobRole.minCgpa || 6.5) && backlogs <= (jobRole.maxBacklogsAllowed || 0);

  // Project score (based on count and relevant tech)
  const projectCount = (student.projects || []).length;
  let projectScore = Math.min(100, projectCount * 30 + 10);

  // Overall Placement Readiness Index:
  // 50% Technical Skills Match, 20% Academic Record, 20% Projects, 10% Verified Assessments
  const verifiedBonus = (student.assessmentScores || []).length > 0 ? 85 : 50;
  const overallReadiness = Math.round(
    skillMatchPercentage * 0.5 + academicScore * 0.2 + projectScore * 0.2 + verifiedBonus * 0.1
  );

  // Tier Prediction
  let predictedTier = 'Tier 3 (Service / IT Services: 3.5 - 7 LPA)';
  let predictedBand = 'Entry Level / Service Drive';
  if (overallReadiness >= 80 && isAcademicEligible && criticalGaps.length === 0) {
    predictedTier = 'Tier 1 (Product / FAANG: 15 - 35+ LPA)';
    predictedBand = 'High Probability - Product Engineer';
  } else if (overallReadiness >= 65 && backlogs === 0) {
    predictedTier = 'Tier 2 (Mid-Product / Fintech: 8 - 14 LPA)';
    predictedBand = 'Competitive - Mid-Tier & Tech Firms';
  }

  // Generate personalized learning pathway based on specific missing skills
  const personalizedRoadmap = generatePersonalizedRoadmap(jobRole, criticalGaps, recommendedGaps);

  return {
    roleName: jobRole.roleName,
    overallReadiness: Math.min(100, Math.max(0, overallReadiness)),
    skillMatchPercentage,
    academicScore,
    projectScore,
    isAcademicEligible,
    eligibilityNotes: isAcademicEligible
      ? 'Meets minimum CGPA and backlog criteria'
      : `Short on eligibility: Required CGPA ${jobRole.minCgpa}, Max backlogs ${jobRole.maxBacklogsAllowed}`,
    matchedSkills,
    criticalGaps,
    recommendedGaps,
    bonusGaps,
    categoryBreakdown,
    predictedTier,
    predictedBand,
    personalizedRoadmap,
  };
}

function generatePersonalizedRoadmap(jobRole, criticalGaps, recommendedGaps) {
  const steps = [];

  if (criticalGaps.length > 0) {
    steps.push({
      phase: 'Phase 1: Bridge Core Placement Blockers',
      timeframe: 'Weeks 1 - 3',
      priority: 'Urgent',
      focusSkills: criticalGaps.map((g) => g.name),
      actionItems: [
        `Complete fundamental drills on ${criticalGaps.slice(0, 3).map((g) => g.name).join(', ')}.`,
        'Solve 25+ curated leetcode/interview problems in these core domains.',
        'Review foundational theory, time complexities, and typical viva questions.',
      ],
      recommendedResources: [
        { title: 'NeetCode 150 Roadmap', type: 'Practice', url: 'https://neetcode.io/roadmap' },
        { title: 'GeeksforGeeks Placement Prep', type: 'Course', url: 'https://geeksforgeeks.org' },
      ],
    });
  }

  if (recommendedGaps.length > 0) {
    steps.push({
      phase: 'Phase 2: Master Frameworks & Technical Depth',
      timeframe: 'Weeks 4 - 6',
      priority: 'High',
      focusSkills: recommendedGaps.map((g) => g.name),
      actionItems: [
        `Build a hands-on project utilizing ${recommendedGaps.slice(0, 2).map((g) => g.name).join(' & ')}.`,
        'Implement clean architecture, test cases, and containerization.',
        'Push code to GitHub with descriptive README and system architecture diagrams.',
      ],
      recommendedResources: [
        { title: 'FullStackOpen / Roadmap.sh', type: 'Documentation', url: 'https://roadmap.sh' },
        { title: 'Official Documentation & Guides', type: 'Article', url: 'https://developer.mozilla.org' },
      ],
    });
  }

  steps.push({
    phase: 'Phase 3: Mock Interviews, System Design & Aptitude Drills',
    timeframe: 'Weeks 7 - 8',
    priority: 'Final Sprint',
    focusSkills: ['Mock Technical Interviews', 'CS Fundamentals (OS, DBMS, Networks)', 'HR Behavioral (STAR method)'],
    actionItems: [
      'Take timed online mock assessments to simulate campus screening rounds.',
      'Prepare 2-minute elevator pitch and project deep-dive walkthroughs.',
      'Practice top 50 SQL queries and concurrency questions.',
    ],
    recommendedResources: [
      { title: 'Pramp / InterviewBit Mock Tests', type: 'Practice', url: 'https://interviewbit.com' },
      { title: 'Grokking System Design Fundamentals', type: 'Course', url: 'https://github.com/donnemartin/system-design-primer' },
    ],
  });

  return steps;
}

module.exports = {
  analyzeSkillGap,
  LEVEL_SCORES,
  IMPORTANCE_WEIGHTS,
};
