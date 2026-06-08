const express = require('express');
const router = express.Router();
const { upload, validatePDFContent } = require('../middlewares/upload');
const { uploadLimiter } = require('../middlewares/rateLimiter');
const {
  uploadResume,
  getResumeById,
  getHistory,
  getStats,
  deleteResume,
} = require('../controllers/resumeController');

// @route   POST /api/resume/upload
// @desc    Upload and analyze a resume
// @access  Public
router.post('/upload', uploadLimiter, upload.single('resume'), validatePDFContent, uploadResume);

// @route   GET /api/resume/stats/overview
// @desc    Get aggregate statistics
// @access  Public
router.get('/stats/overview', getStats);

// @route   GET /api/resume/history/:sessionId
// @desc    Get upload history for a session
// @access  Public
router.get('/history/:sessionId', getHistory);

// @route   GET /api/resume/:id
// @desc    Get full resume analysis
// @access  Public
router.get('/:id', getResumeById);

// @route   DELETE /api/resume/:id
// @desc    Delete a resume record
// @access  Public
router.delete('/:id', deleteResume);

module.exports = router;
