const mongoose = require('mongoose');

const personalInfoSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  github: { type: String, default: '' },
  website: { type: String, default: '' },
}, { _id: false });

const skillCategorySchema = new mongoose.Schema({
  languages: [String],
  frameworks: [String],
  databases: [String],
  tools: [String],
  other: [String],
}, { _id: false });

const educationSchema = new mongoose.Schema({
  institution: String,
  degree: String,
  field: String,
  startDate: String,
  endDate: String,
  gpa: String,
}, { _id: false });

const experienceSchema = new mongoose.Schema({
  company: String,
  title: String,
  startDate: String,
  endDate: String,
  description: String,
  bullets: [String],
}, { _id: false });

const projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  technologies: [String],
  url: String,
}, { _id: false });

const scoringBreakdownSchema = new mongoose.Schema({
  structure: { score: Number, max: Number, label: String },
  keywords: { score: Number, max: Number, label: String },
  formatting: { score: Number, max: Number, label: String },
  skillCoverage: { score: Number, max: Number, label: String },
  experience: { score: Number, max: Number, label: String },
}, { _id: false });

const recommendationsSchema = new mongoose.Schema({
  strengths: [String],
  weaknesses: [String],
  missingSections: [String],
  actionItems: [String],
}, { _id: false });

const resumeSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true,
  },
  originalFilename: {
    type: String,
    required: true,
  },
  fileSize: Number,
  mimeType: String,
  rawText: String,
  wordCount: Number,

  // Parsed content
  personalInfo: personalInfoSchema,
  summary: String,
  education: [educationSchema],
  experience: [experienceSchema],
  skills: skillCategorySchema,
  projects: [projectSchema],
  certifications: [String],
  languages: [String],
  detectedSections: [String],

  // Scores
  atsScore: { type: Number, min: 0, max: 100, default: 0 },
  readinessScore: { type: Number, min: 0, max: 100, default: 0 },
  grade: { type: String, enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'], default: 'F' },
  scoringBreakdown: scoringBreakdownSchema,
  recommendations: recommendationsSchema,

  // Status
  status: {
    type: String,
    enum: ['uploaded', 'parsing', 'analyzing', 'completed', 'failed'],
    default: 'uploaded',
  },
  errorMessage: String,
  analysisVersion: { type: String, default: '1.0.0' },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

resumeSchema.virtual('gradeColor').get(function () {
  const grade = this.grade;
  if (grade?.startsWith('A')) return '#22c55e';
  if (grade?.startsWith('B')) return '#3b82f6';
  if (grade?.startsWith('C')) return '#f59e0b';
  return '#ef4444';
});

resumeSchema.index({ createdAt: -1 });
resumeSchema.index({ sessionId: 1, createdAt: -1 });

module.exports = mongoose.model('Resume', resumeSchema);
