/**
 * Resume Analysis Engine
 * Generates ATS Score, Readiness Score, Grade, and Recommendations
 */

const SECTION_WEIGHTS = {
  structure: 25,
  keywords: 25,
  formatting: 20,
  skillCoverage: 20,
  experience: 10,
};

/**
 * Score resume structure based on sections present
 */
const scoreStructure = (detectedSections, personalInfo, wordCount) => {
  let score = 0;
  const max = SECTION_WEIGHTS.structure;

  // Core sections (5 pts each)
  const coreSections = ['experience', 'education', 'skills'];
  coreSections.forEach(s => {
    if (detectedSections.includes(s)) score += 5;
  });

  // Summary adds value
  if (detectedSections.includes('summary')) score += 3;

  // Contact info completeness
  const contactFields = [personalInfo.name, personalInfo.email, personalInfo.phone, personalInfo.location];
  const filledFields = contactFields.filter(f => f && f.trim().length > 0).length;
  score += Math.floor((filledFields / 4) * 5);

  // Projects / certifications
  if (detectedSections.includes('projects')) score += 3;
  if (detectedSections.includes('certifications')) score += 2;

  // Word count sanity
  if (wordCount >= 200 && wordCount <= 700) score += 2;

  return Math.min(Math.round(score), max);
};

/**
 * Score keyword quality
 */
const scoreKeywords = (skills, rawText) => {
  const max = SECTION_WEIGHTS.keywords;
  const lower = rawText.toLowerCase();

  const totalSkills =
    skills.languages.length +
    skills.frameworks.length +
    skills.databases.length +
    skills.tools.length;

  // Skill count scoring (up to 15 pts)
  let score = Math.min(totalSkills * 1.5, 15);

  // Keyword diversity (having skills across multiple categories)
  const categories = [skills.languages, skills.frameworks, skills.databases, skills.tools];
  const nonEmptyCategories = categories.filter(c => c.length > 0).length;
  score += nonEmptyCategories * 2; // up to 8 pts

  // Action verbs presence (up to 2 pts)
  const actionVerbs = ['developed', 'designed', 'built', 'implemented', 'led', 'managed', 'created', 'optimized', 'deployed', 'integrated'];
  const verbsFound = actionVerbs.filter(v => lower.includes(v)).length;
  if (verbsFound >= 5) score += 2;
  else if (verbsFound >= 2) score += 1;

  return Math.min(Math.round(score), max);
};

/**
 * Score formatting
 */
const scoreFormatting = (rawText, wordCount) => {
  const max = SECTION_WEIGHTS.formatting;
  let score = 0;

  // Good length (not too short or too long)
  if (wordCount >= 300 && wordCount <= 600) score += 8;
  else if (wordCount >= 200 && wordCount <= 800) score += 5;
  else if (wordCount >= 100) score += 2;

  // Has bullet points
  const bulletCount = (rawText.match(/[•\-·]\s/g) || []).length;
  if (bulletCount >= 5) score += 6;
  else if (bulletCount >= 2) score += 3;

  // Reasonable line structure (not a wall of text)
  const lines = rawText.split('\n').filter(l => l.trim().length > 0);
  const avgLineLength = rawText.length / Math.max(lines.length, 1);
  if (avgLineLength < 100) score += 3;

  // Dates are present
  const dateCount = (rawText.match(/\d{4}/g) || []).length;
  if (dateCount >= 3) score += 3;

  return Math.min(Math.round(score), max);
};

/**
 * Score skill coverage
 */
const scoreSkillCoverage = (skills) => {
  const max = SECTION_WEIGHTS.skillCoverage;
  let score = 0;

  const { languages, frameworks, databases, tools } = skills;

  // Languages (up to 6 pts)
  score += Math.min(languages.length * 1.5, 6);

  // Frameworks (up to 6 pts)
  score += Math.min(frameworks.length * 1.5, 6);

  // Databases (up to 4 pts)
  score += Math.min(databases.length * 2, 4);

  // Tools (up to 4 pts)
  score += Math.min(tools.length * 1, 4);

  return Math.min(Math.round(score), max);
};

/**
 * Score experience indicators
 */
const scoreExperience = (experience, detectedSections) => {
  const max = SECTION_WEIGHTS.experience;
  let score = 0;

  if (experience.length > 0) score += 4;
  if (experience.length >= 2) score += 2;
  if (experience.some(e => e.bullets && e.bullets.length > 0)) score += 2;
  if (detectedSections.includes('projects')) score += 1;
  if (detectedSections.includes('certifications')) score += 1;

  return Math.min(Math.round(score), max);
};

/**
 * Convert ATS score to letter grade
 */
const scoreToGrade = (score) => {
  if (score >= 93) return 'A+';
  if (score >= 87) return 'A';
  if (score >= 80) return 'A-';
  if (score >= 77) return 'B+';
  if (score >= 73) return 'B';
  if (score >= 70) return 'B-';
  if (score >= 67) return 'C+';
  if (score >= 63) return 'C';
  if (score >= 60) return 'C-';
  if (score >= 50) return 'D';
  return 'F';
};

/**
 * Generate recommendations
 */
const generateRecommendations = (parsed, scores) => {
  const { personalInfo, detectedSections, skills, experience, wordCount } = parsed;
  const strengths = [];
  const weaknesses = [];
  const missingSections = [];
  const actionItems = [];

  // Strengths
  if (scores.structure >= 18) strengths.push('Well-structured resume with all key sections present.');
  if (scores.keywords >= 18) strengths.push('Strong keyword presence improves ATS compatibility.');
  if (skills.languages.length >= 3) strengths.push(`Solid programming language portfolio (${skills.languages.slice(0, 3).join(', ')}).`);
  if (skills.frameworks.length >= 2) strengths.push(`Good framework knowledge (${skills.frameworks.slice(0, 2).join(', ')}).`);
  if (experience.length >= 2) strengths.push('Multiple work experiences demonstrate career progression.');
  if (detectedSections.includes('projects')) strengths.push('Projects section showcases practical application of skills.');
  if (personalInfo.linkedin) strengths.push('LinkedIn profile included for professional networking.');
  if (personalInfo.github) strengths.push('GitHub profile demonstrates open-source/portfolio work.');

  // Weaknesses
  if (scores.structure < 15) weaknesses.push('Resume structure needs improvement — key sections may be missing or unclear.');
  if (scores.keywords < 12) weaknesses.push('Low keyword density may cause ATS systems to filter out this resume.');
  if (wordCount < 200) weaknesses.push('Resume is too short. Add more detail to experience and projects.');
  if (wordCount > 900) weaknesses.push('Resume is too long. Aim for 1–2 pages (400–700 words).');
  if (!personalInfo.email) weaknesses.push('Email address not detected — critical for recruiter contact.');
  if (!personalInfo.phone) weaknesses.push('Phone number not found — add it for recruiter outreach.');
  if (skills.languages.length === 0) weaknesses.push('No programming languages detected in the skills section.');
  if (experience.length === 0) weaknesses.push('No work experience detected — add internships or projects.');

  // Missing sections
  const requiredSections = ['summary', 'experience', 'education', 'skills'];
  requiredSections.forEach(s => {
    if (!detectedSections.includes(s)) missingSections.push(s.charAt(0).toUpperCase() + s.slice(1));
  });
  if (!detectedSections.includes('projects')) missingSections.push('Projects (highly recommended for developers)');
  if (!detectedSections.includes('certifications')) missingSections.push('Certifications (boosts credibility)');

  // Action items
  if (!personalInfo.linkedin) actionItems.push('Add your LinkedIn profile URL to the contact section.');
  if (!personalInfo.github) actionItems.push('Add your GitHub profile URL to showcase your code.');
  if (skills.tools.length < 3) actionItems.push('List DevOps/tooling skills: Docker, Git, CI/CD, cloud platforms.');
  if (skills.databases.length === 0) actionItems.push('Mention databases you have worked with (e.g., MongoDB, PostgreSQL).');
  if (experience.every(e => !e.bullets || e.bullets.length === 0)) {
    actionItems.push('Use bullet points under each job to quantify achievements (e.g., "Improved load time by 40%").');
  }
  actionItems.push('Tailor your resume keywords to match the specific job description.');
  actionItems.push('Use consistent date formatting (Month Year – Month Year) throughout.');
  if (wordCount < 300) actionItems.push('Expand your resume with more detailed project descriptions and responsibilities.');

  return {
    strengths: strengths.slice(0, 6),
    weaknesses: weaknesses.slice(0, 5),
    missingSections,
    actionItems: actionItems.slice(0, 8),
  };
};

/**
 * Main analysis function
 */
const analyzeResume = (parsed) => {
  const { detectedSections, personalInfo, skills, experience, rawText, wordCount } = parsed;

  const structureScore = scoreStructure(detectedSections, personalInfo, wordCount);
  const keywordsScore = scoreKeywords(skills, rawText);
  const formattingScore = scoreFormatting(rawText, wordCount);
  const skillCoverageScore = scoreSkillCoverage(skills);
  const experienceScore = scoreExperience(experience, detectedSections);

  const atsScore = structureScore + keywordsScore + formattingScore + skillCoverageScore + experienceScore;

  // Readiness score: weighted differently — more emphasis on practical elements
  const readinessScore =
    structureScore * 0.2 +
    keywordsScore * 0.3 +
    skillCoverageScore * 0.3 +
    experienceScore * 0.7 +
    formattingScore * 0.1;

  const readinessMax =
    SECTION_WEIGHTS.structure * 0.2 +
    SECTION_WEIGHTS.keywords * 0.3 +
    SECTION_WEIGHTS.skillCoverage * 0.3 +
    SECTION_WEIGHTS.experience * 0.7 +
    SECTION_WEIGHTS.formatting * 0.1;

  const normalizedReadiness = Math.min(
    Math.round((readinessScore / Math.max(readinessMax, 1)) * 100),
    100
  );

  const grade = scoreToGrade(atsScore);

  const scoringBreakdown = {
    structure: { score: structureScore, max: SECTION_WEIGHTS.structure, label: 'Resume Structure' },
    keywords: { score: keywordsScore, max: SECTION_WEIGHTS.keywords, label: 'Keyword Quality' },
    formatting: { score: formattingScore, max: SECTION_WEIGHTS.formatting, label: 'Formatting' },
    skillCoverage: { score: skillCoverageScore, max: SECTION_WEIGHTS.skillCoverage, label: 'Skill Coverage' },
    experience: { score: experienceScore, max: SECTION_WEIGHTS.experience, label: 'Experience' },
  };

  const recommendations = generateRecommendations(parsed, {
    structure: structureScore,
    keywords: keywordsScore,
    formatting: formattingScore,
    skillCoverage: skillCoverageScore,
    experience: experienceScore,
  });

  return {
    atsScore: Math.min(atsScore, 100),
    readinessScore: normalizedReadiness,
    grade,
    scoringBreakdown,
    recommendations,
  };
};

module.exports = { analyzeResume };
