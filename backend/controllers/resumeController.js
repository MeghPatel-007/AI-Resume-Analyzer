const { v4: uuidv4 } = require('uuid')

const Resume = require('../models/Resume')
const { parseResume } = require('../services/parserService')
const { analyzeResume } = require('../services/analyzerService')

const {
  sendSuccess,
  sendError,
  sendPaginated,
} = require('../utils/apiResponse')

const logger = require('../utils/logger')

/**
 * POST /api/resume/upload
 */
const uploadResume = async (req, res) => {
  if (!req.file) {
    return sendError(res, 'No file uploaded. Please attach a PDF file.', 400)
  }

  const fileBuffer = req.file.buffer
  const sessionId = req.headers['x-session-id'] || uuidv4()

  const resumeDoc = new Resume({
    sessionId,
    originalFilename: req.file.originalname,
    fileSize: req.file.size,
    mimeType: req.file.mimetype,
    status: 'parsing',
  })

  try {
    await resumeDoc.save()

    logger.info(`Parsing resume: ${req.file.originalname}`)

    const parsed = await parseResume(fileBuffer, req.file.originalname)

    resumeDoc.rawText = parsed.rawText
    resumeDoc.wordCount = parsed.wordCount

    resumeDoc.personalInfo = parsed.personalInfo

    resumeDoc.summary = parsed.summary

    resumeDoc.education = parsed.education

    resumeDoc.experience = parsed.experience

    resumeDoc.skills = parsed.skills

    resumeDoc.projects = parsed.projects

    resumeDoc.certifications = parsed.certifications

    resumeDoc.detectedSections = parsed.detectedSections

    resumeDoc.status = 'analyzing'

    logger.info(`Analyzing resume: ${req.file.originalname}`)

    const analysis = await analyzeResume(parsed)

    resumeDoc.atsScore = analysis.atsScore

    resumeDoc.readinessScore = analysis.readinessScore

    resumeDoc.grade = analysis.grade

    resumeDoc.scoringBreakdown = analysis.scoringBreakdown

    resumeDoc.recommendations = analysis.recommendations

    resumeDoc.status = 'completed'

    await resumeDoc.save()

    logger.info(`Resume analysis complete`)

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
      201,
    )
  } catch (error) {
    logger.error(`Resume processing failed: ${error.message}`)

    try {
      resumeDoc.status = 'failed'

      resumeDoc.errorMessage = error.message

      await resumeDoc.save()
    } catch {}

    return sendError(res, error.message || 'Failed to process resume.', 422)
  }
}

/**
 * GET /api/resume/:id
 */
const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id).select('-rawText -__v')

    if (!resume) {
      return sendError(res, 'Resume not found.', 404)
    }

    return sendSuccess(res, resume, 'Resume report retrieved.')
  } catch (error) {
    if (error.name === 'CastError') {
      return sendError(res, 'Invalid resume ID.', 400)
    }

    throw error
  }
}

/**
 * GET /api/resume/history/:sessionId
 */
const getHistory = async (req, res) => {
  const { sessionId } = req.params

  const page = Number(req.query.page) || 1

  const limit = Math.min(Number(req.query.limit) || 10, 50)

  const skip = (page - 1) * limit

  const [resumes, total] = await Promise.all([
    Resume.find({
      sessionId,
    })
      .select('-rawText -__v')
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit),

    Resume.countDocuments({
      sessionId,
    }),
  ])

  return sendPaginated(
    res,
    resumes,
    {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    'History retrieved.',
  )
}

/**
 * GET /api/resume/stats/overview
 */
const getStats = async (req, res) => {
  const stats = await Resume.aggregate([
    {
      $match: {
        status: 'completed',
      },
    },
    {
      $group: {
        _id: null,
        totalResumes: {
          $sum: 1,
        },
        avgAtsScore: {
          $avg: '$atsScore',
        },
        avgReadinessScore: {
          $avg: '$readinessScore',
        },
      },
    },
  ])

  return sendSuccess(res, stats[0] || {}, 'Stats retrieved.')
}

/**
 * DELETE /api/resume/:id
 */
const deleteResume = async (req, res) => {
  const deleted = await Resume.findByIdAndDelete(req.params.id)

  if (!deleted) {
    return sendError(res, 'Resume not found.', 404)
  }

  return sendSuccess(
    res,
    {
      id: req.params.id,
    },
    'Resume deleted.',
  )
}

module.exports = {
  uploadResume,
  getResumeById,
  getHistory,
  getStats,
  deleteResume,
}
