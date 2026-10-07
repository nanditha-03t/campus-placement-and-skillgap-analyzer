const mongoose = require('mongoose');

const requiredSkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  importance: {
    type: String,
    enum: ['Critical', 'High', 'Medium', 'Bonus'],
    default: 'High',
  },
  minimumLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate',
  },
  weight: {
    type: Number,
    min: 1,
    max: 10,
    default: 5,
  },
  category: {
    type: String,
    enum: ['Programming', 'Frameworks', 'Core CS', 'Database', 'Cloud & DevOps', 'Tools', 'Soft Skills'],
    default: 'Programming',
  },
}, { _id: false });

const roadmapStepSchema = new mongoose.Schema({
  step: Number,
  title: String,
  estimatedWeeks: Number,
  topics: [String],
  description: String,
  resources: [
    {
      title: String,
      url: String,
      type: { type: String, enum: ['Documentation', 'Course', 'Practice', 'Video', 'Article'] },
    },
  ],
}, { _id: false });

const jobRoleSchema = new mongoose.Schema({
  roleName: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  averageCtcLpa: {
    min: Number,
    max: Number,
  },
  tier: {
    type: String,
    enum: ['Tier 1 (Product / FAANG)', 'Tier 2 (Mid-Product / Fintech)', 'Tier 3 (Service / IT Services)'],
    default: 'Tier 1 (Product / FAANG)',
  },
  minCgpa: {
    type: Number,
    default: 7.0,
  },
  maxBacklogsAllowed: {
    type: Number,
    default: 0,
  },
  requiredSkills: [requiredSkillSchema],
  roadmap: [roadmapStepSchema],
  topCompaniesHiring: [String],
  interviewRounds: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('JobRole', jobRoleSchema);
