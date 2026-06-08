const pdfParse = require('pdf-parse')
const logger = require('../utils/logger')

/**
 * Extract text directly from PDF buffer
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
 * Personal information extraction
 */
const extractPersonalInfo = (text) => {
  const info = {
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
  }

  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  info.email =
    text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/)?.[0] || ''

  info.phone = text.match(/(\+?\d[\d\s\-()]{8,})/)?.[0] || ''

  const linkedin = text.match(/linkedin\.com\/in\/([^\s]+)/i)

  if (linkedin) {
    info.linkedin = `https://linkedin.com/in/${linkedin[1]}`
  }

  const github = text.match(/github\.com\/([^\s]+)/i)

  if (github) {
    info.github = `https://github.com/${github[1]}`
  }

  for (let i = 0; i < Math.min(6, lines.length); i++) {
    const line = lines[i]

    if (line.length > 3 && line.length < 50 && !line.includes('@')) {
      info.name = line
      break
    }
  }

  return info
}

/**
 * Section detection
 */
const detectSections = (text) => {
  const lower = text.toLowerCase()

  const sections = [
    'summary',
    'education',
    'experience',
    'skills',
    'projects',
    'certifications',
  ]

  return sections.filter((s) => lower.includes(s))
}

/**
 * Skills extraction
 */
const extractSkills = (text) => {
  const lower = text.toLowerCase()

  const skillSet = [
    'javascript',
    'typescript',
    'react',
    'node',
    'express',
    'mongodb',
    'mysql',
    'python',
    'java',
    'c++',
    'docker',
    'aws',
    'git',
    'github',
    'next.js',
    'tailwind',
    'firebase',
    'vercel',
  ]

  return skillSet.filter((skill) => lower.includes(skill))
}

/**
 * Summary extraction
 */
const extractSummary = (text) => {
  const match = text.match(/(?:summary|objective)[\s\S]{0,400}/i)

  return match ? match[0] : ''
}

/**
 * Education extraction
 */
const extractEducation = (text) => {
  const lines = text.split('\n')

  return lines
    .filter((l) => /college|university|degree|b\.tech|b\.e/i.test(l))
    .slice(0, 5)
    .map((value) => ({
      institution: value,
    }))
}

/**
 * Experience extraction
 */
const extractExperience = (text) => {
  const lines = text.split('\n')

  return lines
    .filter((l) => /developer|engineer|intern|manager/i.test(l))
    .slice(0, 8)
    .map((value) => ({
      title: value,
    }))
}

/**
 * Project extraction
 */
const extractProjects = (text) => {
  return text.match(/project[s]?[\s\S]{0,300}/i)?.join('') || ''
}

/**
 * Parse resume
 */
const parseResume = async (fileBuffer, originalFilename) => {
  logger.info(`Parsing ${originalFilename}`)

  const rawText = await extractTextFromPDF(fileBuffer)

  if (rawText.length < 50) {
    throw new Error('Resume content too short.')
  }

  return {
    rawText: rawText || '',

    wordCount: rawText ? rawText.split(/\s+/).length : 0,

    personalInfo: extractPersonalInfo(rawText || ''),

    detectedSections: detectSections(rawText || []),

    education: extractEducation(rawText || '') || [],

    experience: extractExperience(rawText || '') || [],

    skills: extractSkills(rawText || '') || [],

    projects: extractProjects(rawText)
      ? [
          {
            title: extractProjects(rawText),
          },
        ]
      : [],

    summary: extractSummary(rawText) || '',

    certifications: [],
  }
}

module.exports = {
  parseResume,
  extractTextFromPDF,
}
