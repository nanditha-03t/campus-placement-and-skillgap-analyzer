const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['Programming', 'Frameworks', 'Core CS', 'Database', 'Cloud & DevOps', 'Tools', 'Soft Skills'],
    default: 'Programming',
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate',
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: 70,
  },
  verified: {
    type: Boolean,
    default: false,
  },
}, { _id: false });

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  techStack: [{ type: String }],
  description: { type: String },
  githubUrl: { type: String },
  liveUrl: { type: String },
}, { _id: false });

const studentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  department: {
    type: String,
    enum: ['CSE', 'IT', 'AI & DS', 'ECE', 'EEE', 'MECH'],
    default: 'CSE',
  },
  batch: { type: String, default: '2026' },
  cgpa: { type: Number, min: 0, max: 10, default: 8.0 },
  backlogs: { type: Number, default: 0 },
  technicalSkills: [skillSchema],
  softSkills: [{ type: String }],
  projects: [projectSchema],
  targetRole: {
    type: String,
    default: 'Software Development Engineer (SDE)',
  },
  preferredCompanies: [{ type: String }],
  assessmentScores: [
    {
      topic: String,
      score: Number,
      total: Number,
      percentage: Number,
      date: { type: Date, default: Date.now },
    },
  ],
  readinessScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 65,
  },
  appliedDrives: [
    {
      drive: { type: mongoose.Schema.Types.ObjectId, ref: 'Drive' },
      status: { type: String, enum: ['Registered', 'Applied', 'Shortlisted', 'Interviewing', 'Selected', 'Rejected'], default: 'Registered' },
      appliedAt: { type: Date, default: Date.now },
    },
  ],
  resumeUploaded: { type: Boolean, default: false },
  githubProfile: { type: String },
  linkedinProfile: { type: String },
  leetcodeProfile: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Student', studentSchema);
