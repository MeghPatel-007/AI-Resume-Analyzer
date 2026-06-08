const pdfParse = require('pdf-parse')
const logger = require('../utils/logger')

/**
 * Extract text from PDF
 */
const extractTextFromPDF = async (fileBuffer) => {
  try {
    if (!Buffer.isBuffer(fileBuffer)) {
      throw new Error('Expected PDF buffer.')
    }

    const pdf = await pdfParse(fileBuffer)

    return (pdf.text || '').trim()
  } catch (error) {
    logger.error(`PDF parse failed: ${error.message}`)

    throw new Error('Failed to parse PDF.')
  }
}

/**
 * Extract personal info
 */
const extractPersonalInfo = (text) => {
  const info = {
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
  }

  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  for (let i = 0; i < Math.min(6, lines.length); i++) {
    const line = lines[i]

    if (line.length > 3 && line.length < 50 && !line.includes('@')) {
      info.name = line
      break
    }
  }

  info.email =
    text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/)?.[0] || ''

  info.phone = text.match(/(\+?\d[\d\s\-()]{8,})/)?.[0] || ''

  info.location = lines[1] || ''

  const linkedin = text.match(/linkedin\.com\/in\/([^\s]+)/i)

  if (linkedin) {
    info.linkedin = `https://linkedin.com/in/${linkedin[1]}`
  }

  const github = text.match(/github\.com\/([^\s]+)/i)

  if (github) {
    info.github = `https://github.com/${github[1]}`
  }

  return info
}

/**
 * Detect sections
 */
const detectSections = (text) => {
  const lower = text.toLowerCase()

  return [
    'summary',
    'education',
    'experience',
    'skills',
    'projects',
    'certifications',
  ].filter((s) => lower.includes(s))
}

/**
 * Structured skills
 */
const extractSkills = (text) => {
  const lower = text.toLowerCase()

  return {
    languages: [
      'javascript',
      'typescript',
      'python',
      'java',
      'c++',
      'c',
    ].filter((s) => lower.includes(s)),

    frameworks: [
      'react',
      'node',
      'express',
      'next.js',
      'tailwind',
      'firebase',
    ].filter((s) => lower.includes(s)),

    databases: ['mongodb', 'mysql', 'postgresql'].filter((s) =>
      lower.includes(s),
    ),

    tools: ['git', 'github', 'docker', 'aws', 'vercel', 'figma'].filter((s) =>
      lower.includes(s),
    ),
  }
}

/**
 * Summary
 */
const extractSummary = (text) => {
  return text.match(/(?:summary|objective)[\s\S]{0,400}/i)?.[0] || ''
}

/**
 * Education
 */
const extractEducation = (text) => {
  return text
    .split('\n')
    .filter((l) => /college|university|degree|b\.tech|b\.e/i.test(l))
    .slice(0, 5)
    .map((institution) => ({
      institution,
    }))
}

/**
 * Experience
 */
const extractExperience = (text) => {
  return text
    .split('\n')
    .filter((l) => /developer|engineer|intern|manager/i.test(l))
    .slice(0, 8)
    .map((title) => ({
      title,
      bullets: [],
    }))
}

/**
 * Projects
 */
const extractProjects = (text) => {
  const match = text.match(/project[s]?[\s\S]{0,300}/i)

  if (!match) {
    return []
  }

  return [
    {
      title: match[0],
    },
  ]
}

/**
 * Parse Resume
 */
const parseResume = async (fileBuffer, originalFilename) => {
  logger.info(`Parsing ${originalFilename}`)

  const rawText = await extractTextFromPDF(fileBuffer)

  if (!rawText || rawText.length < 50) {
    throw new Error('Resume content too short.')
  }

  return {
    rawText,

    wordCount: rawText.split(/\s+/).length,

    personalInfo: extractPersonalInfo(rawText),

    detectedSections: detectSections(rawText),

    education: extractEducation(rawText),

    experience: extractExperience(rawText),

    skills: extractSkills(rawText),

    projects: extractProjects(rawText),

    summary: extractSummary(rawText),

    certifications: [],
  }
}

module.exports = {
  parseResume,
  extractTextFromPDF,
}
