const pdfParse = require('pdf-parse');
const fs = require('fs');
const logger = require('../utils/logger');

/**
 * Extract raw text from a PDF buffer or file path
 */
const extractTextFromPDF = async (filePathOrBuffer) => {
  try {
    let dataBuffer;
    if (typeof filePathOrBuffer === 'string') {
      dataBuffer = fs.readFileSync(filePathOrBuffer);
    } else {
      dataBuffer = filePathOrBuffer;
    }
    const data = await pdfParse(dataBuffer);
    return data.text || '';
  } catch (error) {
    logger.error(`PDF parsing error: ${error.message}`);
    throw new Error('Failed to parse PDF. The file may be corrupted or password-protected.');
  }
};

/**
 * Extract personal information from resume text
 */
const extractPersonalInfo = (text) => {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const info = {
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: '',
  };

  // Email
  const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/);
  if (emailMatch) info.email = emailMatch[0];

  // Phone
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) info.phone = phoneMatch[0].trim();

  // LinkedIn
  const linkedinMatch = text.match(/linkedin\.com\/in\/([a-zA-Z0-9-]+)/i);
  if (linkedinMatch) info.linkedin = `https://linkedin.com/in/${linkedinMatch[1]}`;

  // GitHub
  const githubMatch = text.match(/github\.com\/([a-zA-Z0-9-]+)/i);
  if (githubMatch) info.github = `https://github.com/${githubMatch[1]}`;

  // Website
  const websiteMatch = text.match(/https?:\/\/((?!linkedin|github)[a-zA-Z0-9.-]+\.[a-z]{2,}[^\s]*)/i);
  if (websiteMatch) info.website = websiteMatch[0];

  // Name heuristic: first non-empty line that isn't contact info
  for (const line of lines.slice(0, 8)) {
    if (
      line.length > 2 &&
      line.length < 60 &&
      !line.includes('@') &&
      !line.match(/\d{3}[-.\s]\d{3}/) &&
      !line.toLowerCase().includes('linkedin') &&
      !line.toLowerCase().includes('github') &&
      !line.match(/^https?:\/\//i) &&
      !line.match(/^(summary|objective|experience|education|skills|projects)/i)
    ) {
      info.name = line.replace(/[^a-zA-Z\s\-'.]/g, '').trim();
      if (info.name.length > 2) break;
    }
  }

  // Location heuristic
  const locationMatch = text.match(
    /([A-Z][a-zA-Z\s]+,\s*[A-Z]{2}(\s+\d{5})?)|([A-Z][a-zA-Z\s]+,\s*[A-Z][a-zA-Z\s]+)/
  );
  if (locationMatch) info.location = locationMatch[0].trim();

  return info;
};

/**
 * Detect which major sections are present in the resume
 */
const detectSections = (text) => {
  const lower = text.toLowerCase();
  const sectionKeywords = {
    summary: ['summary', 'objective', 'profile', 'about me', 'professional summary'],
    experience: ['experience', 'work history', 'employment', 'work experience', 'professional experience'],
    education: ['education', 'academic', 'degree', 'university', 'college', 'school'],
    skills: ['skills', 'technical skills', 'competencies', 'technologies', 'proficiencies'],
    projects: ['projects', 'personal projects', 'academic projects', 'portfolio'],
    certifications: ['certifications', 'certificates', 'credentials', 'licenses'],
    languages: ['languages'],
    awards: ['awards', 'honors', 'achievements', 'recognition'],
    publications: ['publications', 'papers', 'research'],
    volunteer: ['volunteer', 'community', 'extracurricular'],
  };

  const detected = [];
  for (const [section, keywords] of Object.entries(sectionKeywords)) {
    if (keywords.some(kw => lower.includes(kw))) {
      detected.push(section);
    }
  }
  return detected;
};

/**
 * Extract education entries
 */
const extractEducation = (text) => {
  const education = [];
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  const degreeKeywords = ['bachelor', 'master', 'phd', 'doctorate', 'associate', 'b.s', 'm.s', 'b.e', 'm.e', 'b.tech', 'm.tech', 'mba', 'b.a', 'm.a', 'bs ', 'ms ', 'ba ', 'ma '];
  const institutionKeywords = ['university', 'college', 'institute', 'school', 'academy'];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].toLowerCase();
    const isEducationLine =
      degreeKeywords.some(kw => line.includes(kw)) ||
      institutionKeywords.some(kw => line.includes(kw));

    if (isEducationLine) {
      const entry = {
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        gpa: '',
      };

      // Try to find institution
      if (institutionKeywords.some(kw => line.includes(kw))) {
        entry.institution = lines[i];
      } else if (i + 1 < lines.length) {
        entry.institution = lines[i];
        entry.degree = lines[i];
      }

      // Look for dates nearby
      for (let j = i; j < Math.min(i + 4, lines.length); j++) {
        const dateMatch = lines[j].match(/(\d{4})\s*[-–]\s*(\d{4}|present|current)/i);
        if (dateMatch) {
          entry.startDate = dateMatch[1];
          entry.endDate = dateMatch[2];
        }
        const gpaMatch = lines[j].match(/gpa[:\s]+([0-9.]+)/i);
        if (gpaMatch) entry.gpa = gpaMatch[1];
      }

      education.push(entry);
    }
    i++;
  }

  return education.slice(0, 5);
};

/**
 * Extract work experience entries
 */
const extractExperience = (text) => {
  const experience = [];
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  const jobTitleKeywords = [
    'engineer', 'developer', 'designer', 'manager', 'analyst', 'consultant',
    'specialist', 'architect', 'lead', 'senior', 'junior', 'intern', 'director',
    'coordinator', 'administrator', 'scientist', 'researcher', 'officer', 'associate'
  ];

  let currentEntry = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lower = line.toLowerCase();

    const hasJobTitle = jobTitleKeywords.some(kw => lower.includes(kw));
    const hasDate = /\d{4}/.test(line) && (line.includes('-') || line.includes('–') || lower.includes('present'));

    if (hasJobTitle && line.length < 80) {
      if (currentEntry && currentEntry.title) {
        experience.push(currentEntry);
      }
      currentEntry = {
        company: '',
        title: line,
        startDate: '',
        endDate: '',
        description: '',
        bullets: [],
      };

      // Look for date on same line or next line
      const dateMatch = line.match(/(\w+\s+\d{4}|\d{4})\s*[-–]\s*(\w+\s+\d{4}|\d{4}|present|current)/i);
      if (dateMatch) {
        currentEntry.startDate = dateMatch[1];
        currentEntry.endDate = dateMatch[2];
      }

      // Try next line for company
      if (i + 1 < lines.length && lines[i + 1].length < 80) {
        currentEntry.company = lines[i + 1];
      }
    } else if (currentEntry && (line.startsWith('•') || line.startsWith('-') || line.startsWith('·'))) {
      currentEntry.bullets.push(line.replace(/^[•\-·]\s*/, '').trim());
    }
  }

  if (currentEntry && currentEntry.title) {
    experience.push(currentEntry);
  }

  return experience.slice(0, 10);
};

/**
 * Extract and categorize skills
 */
const extractSkills = (text) => {
  const lower = text.toLowerCase();

  const skillDictionary = {
    languages: [
      'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'kotlin',
      'swift', 'ruby', 'php', 'scala', 'r', 'matlab', 'bash', 'shell', 'perl', 'dart',
      'objective-c', 'assembly', 'cobol', 'fortran', 'haskell', 'lua', 'elixir'
    ],
    frameworks: [
      'react', 'angular', 'vue', 'next.js', 'nuxt', 'svelte', 'express', 'fastapi',
      'django', 'flask', 'spring', 'spring boot', 'laravel', 'rails', 'asp.net', 'node.js',
      'nestjs', 'graphql', 'redux', 'tailwind', 'bootstrap', 'material ui', 'chakra ui',
      'jquery', 'electron', 'react native', 'flutter', 'tensorflow', 'pytorch', 'keras',
      'scikit-learn', 'pandas', 'numpy', 'fastify', 'koa', 'hapi', 'strapi'
    ],
    databases: [
      'mongodb', 'postgresql', 'mysql', 'sqlite', 'redis', 'cassandra', 'dynamodb',
      'firebase', 'supabase', 'elasticsearch', 'neo4j', 'mariadb', 'oracle', 'sql server',
      'cockroachdb', 'planetscale', 'prisma', 'sequelize', 'typeorm', 'mongoose'
    ],
    tools: [
      'git', 'github', 'gitlab', 'bitbucket', 'docker', 'kubernetes', 'aws', 'azure',
      'gcp', 'linux', 'nginx', 'apache', 'jenkins', 'ci/cd', 'terraform', 'ansible',
      'prometheus', 'grafana', 'jira', 'confluence', 'figma', 'postman', 'swagger',
      'vscode', 'intellij', 'webpack', 'vite', 'babel', 'eslint', 'jest', 'mocha',
      'vercel', 'netlify', 'heroku', 'digitalocean', 'cloudflare', 'stripe', 'twilio'
    ],
  };

  const found = { languages: [], frameworks: [], databases: [], tools: [], other: [] };

  for (const [category, skills] of Object.entries(skillDictionary)) {
    for (const skill of skills) {
      // Use word boundary matching
      const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      if (regex.test(lower)) {
        found[category].push(skill);
      }
    }
  }

  return found;
};

/**
 * Extract projects from resume text
 */
const extractProjects = (text) => {
  const projects = [];
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  let inProjectsSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lower = line.toLowerCase();

    if (lower.match(/^(projects|personal projects|academic projects|side projects)$/)) {
      inProjectsSection = true;
      continue;
    }

    if (inProjectsSection && lower.match(/^(experience|education|skills|certifications|awards)/)) {
      inProjectsSection = false;
    }

    if (inProjectsSection && line.length > 3 && line.length < 100 && !line.startsWith('•') && !line.startsWith('-')) {
      const techMatch = line.match(/\(([^)]+)\)/) || line.match(/technologies?[:\s]+(.+)/i);
      projects.push({
        name: line.replace(/\s*\([^)]*\)/, '').trim(),
        description: lines[i + 1] || '',
        technologies: techMatch ? techMatch[1].split(/[,|]/).map(t => t.trim()) : [],
        url: '',
      });
    }
  }

  return projects.slice(0, 8);
};

/**
 * Extract summary/objective section
 */
const extractSummary = (text) => {
  const summaryMatch = text.match(
    /(?:summary|objective|profile|about me|professional summary)[:\s]*\n([\s\S]{20,500}?)(?:\n[A-Z][A-Z\s]{3,}|\n\n\n|$)/i
  );
  if (summaryMatch) {
    return summaryMatch[1].replace(/\n/g, ' ').trim().slice(0, 400);
  }
  return '';
};

/**
 * Main parse function
 */
const parseResume = async (filePathOrBuffer, originalFilename) => {
  const rawText = await extractTextFromPDF(filePathOrBuffer);

  if (!rawText || rawText.trim().length < 50) {
    throw new Error('Could not extract meaningful content from this PDF.');
  }

  const wordCount = rawText.split(/\s+/).filter(Boolean).length;
  const personalInfo = extractPersonalInfo(rawText);
  const detectedSections = detectSections(rawText);
  const education = extractEducation(rawText);
  const experience = extractExperience(rawText);
  const skills = extractSkills(rawText);
  const projects = extractProjects(rawText);
  const summary = extractSummary(rawText);

  // Extract certifications
  const certLines = [];
  const certRegex = /(?:certification|certificate|certified)[:\s]+([^\n]+)/gi;
  let certMatch;
  while ((certMatch = certRegex.exec(rawText)) !== null) {
    certLines.push(certMatch[1].trim());
  }

  return {
    rawText,
    wordCount,
    personalInfo,
    detectedSections,
    education,
    experience,
    skills,
    projects,
    summary,
    certifications: certLines.slice(0, 10),
  };
};

module.exports = { parseResume, extractTextFromPDF };
