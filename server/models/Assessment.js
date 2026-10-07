const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  codeSnippet: { type: String },
  options: [{ type: String, required: true }],
  correctOptionIndex: { type: Number, required: true },
  explanation: { type: String },
  category: {
    type: String,
    enum: ['DSA', 'Web Development', 'Core CS (OS & DBMS)', 'Python & Machine Learning', 'Cloud & System Design', 'Aptitude & Logic'],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
  },
  skillTag: { type: String, required: true },
});

const assessmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: {
    type: String,
    required: true,
  },
  timeLimitMinutes: { type: Number, default: 20 },
  questions: [questionSchema],
  targetRole: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Assessment', assessmentSchema);
