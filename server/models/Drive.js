const mongoose = require('mongoose');

const driveSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  logoUrl: String,
  role: {
    type: String,
    required: true,
  },
  ctcLpa: {
    type: Number,
    required: true,
  },
  driveDate: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    default: 'Campus / Virtual',
  },
  jobDescription: String,
  criteria: {
    minCgpa: { type: Number, default: 7.0 },
    maxBacklogs: { type: Number, default: 0 },
    allowedBranches: [{ type: String, default: ['CSE', 'IT', 'AI & DS', 'ECE'] }],
    requiredSkills: [{ type: String }],
  },
  registeredStudents: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
      status: {
        type: String,
        enum: ['Registered', 'Shortlisted', 'OA Cleared', 'Interview Cleared', 'Selected', 'Rejected'],
        default: 'Registered',
      },
      matchScore: Number,
      appliedAt: { type: Date, default: Date.now },
    },
  ],
  status: {
    type: String,
    enum: ['Upcoming', 'Registration Open', 'In Progress', 'Completed'],
    default: 'Registration Open',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Drive', driveSchema);
