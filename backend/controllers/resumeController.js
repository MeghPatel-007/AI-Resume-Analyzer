const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const Resume = require('../models/Resume');
const { parseResume } = require('../services/parserService');
const { analyzeResume } = require('../services/analyzerService');
const { sendSuccess, sendError, sendPaginated } = require('../utils/apiResponse');
const logger = require('../utils/logger');

/**
 * POST /api/resume/upload
 * Upload and analyze a resume PDF
 */
const uploadResume = async (req, res) => {
  if (!req.file) {
    return sendError(res, 'No file uploaded. Please attach a PDF file.', 400);
  }

  const filePath = req.file.path;
  const sessionId = req.headers['x-session-id'] || uuidv4();

  // Create initial DB record
  const resumeDoc = new Resume({
    sessionId,
    originalFilename: req.file.originalname,
    fileSize: req.file.size,
    mimeType: req.file.mimetype,
    status: 'parsing',
  });

  try {
    await resumeDoc.save();

    // Parse PDF
    logger.info(`Parsing resume: ${req.file.originalname}`);
    const parsed = await parseResume(filePath, req.file.originalname);

    resumeDoc.rawText = parsed.rawText;
    resumeDoc.wordCount = parsed.wordCount;
    resumeDoc.personalInfo = parsed.personalInfo;
    resumeDoc.summary = parsed.summary;
    resumeDoc.education = parsed.education;
    resumeDoc.experience = parsed.experience;
    resumeDoc.skills = parsed.skills;
    resumeDoc.projects = parsed.projects;
    resumeDoc.certifications = parsed.certifications;
    resumeDoc.detectedSections = parsed.detectedSections;
    resumeDoc.status = 'analyzing';

    // Analyze
    logger.info(`Analyzing resume: ${req.file.originalname}`);
    const analysis = analyzeResume(parsed);

    resumeDoc.atsScore = analysis.atsScore;
    resumeDoc.readinessScore = analysis.readinessScore;
    resumeDoc.grade = analysis.grade;
    resumeDoc.scoringBreakdown = analysis.scoringBreakdown;
    resumeDoc.recommendations = analysis.recommendations;
    resumeDoc.status = 'completed';

    await resumeDoc.save();

    // Clean up uploaded file
    try {
      fs.unlinkSync(filePath);
    } catch (_) {
      // Non-critical
    }

    logger.info(`Resume analysis complete. ATS Score: ${analysis.atsScore}, Grade: ${analysis.grade}`);

    return sendSuccess(
      res,
      {
        id: resumeDoc._id,
        sessionId: resumeDoc.sessionId,
        atsScore: resumeDoc.atsScore,
        readinessScore: resumeDoc.readinessScore,
        grade: resumeDoc.grade,
      },
      'Resume analyzed successfully.',
      201
    );
  } catch (error) {
    logger.error(`Resume processing failed: ${error.message}`);

    // Update DB with failure status
    resumeDoc.status = 'failed';
    resumeDoc.errorMessage = error.message;
    await resumeDoc.save().catch(() => {});

    // Clean up file
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (_) {}

    return sendError(res, error.message || 'Failed to process resume.', 422);
  }
};

/**
 * GET /api/resume/:id
 * Get full resume analysis report
 */
const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id).select('-rawText -__v');
    if (!resume) {
      return sendError(res, 'Resume not found.', 404);
    }
    return sendSuccess(res, resume, 'Resume report retrieved.');
  } catch (error) {
    if (error.name === 'CastError') {
      return sendError(res, 'Invalid resume ID.', 400);
    }
    throw error;
  }
};

/**
 * GET /api/resume/history/:sessionId
 * Get upload history for a session
 */
const getHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const [resumes, total] = await Promise.all([
      Resume.find({ sessionId })
        .select('-rawText -__v')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Resume.countDocuments({ sessionId }),
    ]);

    return sendPaginated(
      res,
      resumes,
      { total, page, limit, totalPages: Math.ceil(total / limit) },
      'History retrieved.'
    );
  } catch (error) {
    throw error;
  }
};

/**
 * GET /api/resume/stats/overview
 * Get aggregate statistics
 */
const getStats = async (req, res) => {
  try {
    const stats = await Resume.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: null,
          totalResumes: { $sum: 1 },
          avgAtsScore: { $avg: '$atsScore' },
          avgReadinessScore: { $avg: '$readinessScore' },
          maxAtsScore: { $max: '$atsScore' },
          minAtsScore: { $min: '$atsScore' },
        },
      },
      {
        $project: {
          _id: 0,
          totalResumes: 1,
          avgAtsScore: { $round: ['$avgAtsScore', 1] },
          avgReadinessScore: { $round: ['$avgReadinessScore', 1] },
          maxAtsScore: 1,
          minAtsScore: 1,
        },
      },
    ]);

    const gradeDistribution = await Resume.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$grade', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    return sendSuccess(res, {
      overview: stats[0] || {
        totalResumes: 0,
        avgAtsScore: 0,
        avgReadinessScore: 0,
      },
      gradeDistribution,
    }, 'Stats retrieved.');
  } catch (error) {
    throw error;
  }
};

/**
 * DELETE /api/resume/:id
 * Delete a resume record
 */
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findByIdAndDelete(req.params.id);
    if (!resume) {
      return sendError(res, 'Resume not found.', 404);
    }
    return sendSuccess(res, { id: req.params.id }, 'Resume deleted.');
  } catch (error) {
    if (error.name === 'CastError') {
      return sendError(res, 'Invalid resume ID.', 400);
    }
    throw error;
  }
};

module.exports = {
  uploadResume,
  getResumeById,
  getHistory,
  getStats,
  deleteResume,
};
