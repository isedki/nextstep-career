import { CareerProfile, CareerAnchor } from '../types';
import { CoverLetterResult, CoverLetterInput } from '../resume/types';

// ============================================
// Template-Based Cover Letter Generation
// ============================================

export function generateFallbackCoverLetter(
  input: CoverLetterInput,
  profile: CareerProfile,
  resumeText: string,
  userName?: string
): CoverLetterResult {
  const anchor = profile.psychology.careerAnchor.primary;
  const template = getTemplateByAnchor(anchor);
  
  const achievements = extractAchievements(resumeText);
  const skills = extractSkills(resumeText, input.jobRequirements);
  
  const content = fillTemplate(template, {
    company: input.company,
    jobTitle: input.jobTitle,
    achievement1: achievements[0] || 'delivered significant projects',
    achievement2: achievements[1] || 'collaborated effectively with teams',
    skill1: skills[0] || 'relevant technical skills',
    skill2: skills[1] || 'strong communication abilities',
    motivation: getMotivation(anchor),
    closing: getClosing(anchor)
  });

  return {
    success: true,
    content,
    source: 'template',
    metadata: {
      jobTitle: input.jobTitle,
      company: input.company,
      generatedAt: new Date()
    }
  };
}

// ============================================
// Templates by Career Anchor
// ============================================

interface CoverLetterTemplate {
  opening: string;
  body: string;
  closing: string;
}

const templates: Record<CareerAnchor, CoverLetterTemplate> = {
  technical_competence: {
    opening: `I'm excited to apply for the {jobTitle} position at {company}. What draws me to this role is the opportunity to deepen my technical expertise while contributing to meaningful engineering challenges.`,
    body: `In my career, I've consistently focused on building deep technical competence. {achievement1}, which required both technical depth and practical problem-solving. Additionally, {achievement2}, demonstrating my commitment to quality engineering.

My background in {skill1} and {skill2} aligns well with your requirements. I'm particularly interested in how {company} approaches technical problems, and I'm eager to bring my expertise while continuing to grow as a specialist.`,
    closing: `I'd welcome the opportunity to discuss how my technical background could contribute to your team's success. {closing}`
  },

  management: {
    opening: `I'm writing to express my strong interest in the {jobTitle} role at {company}. The opportunity to lead and develop teams while driving meaningful outcomes is exactly what I'm looking for.`,
    body: `Throughout my career, I've gravitated toward leadership opportunities. {achievement1}, where I led cross-functional collaboration to achieve results. I've also {achievement2}, which strengthened my ability to align teams around shared goals.

My experience with {skill1} combined with {skill2} has prepared me well for this role. I'm drawn to {company}'s approach and believe my leadership style would complement your team well.`,
    closing: `I'm excited about the possibility of contributing to {company}'s growth and would love to discuss this opportunity further. {closing}`
  },

  autonomy: {
    opening: `The {jobTitle} position at {company} caught my attention because it appears to offer the independence and ownership I value in my work.`,
    body: `I thrive when given the freedom to own my work end-to-end. {achievement1}, taking full ownership of the process and outcomes. Similarly, {achievement2}, which I accomplished through self-directed initiative.

With my background in {skill1} and {skill2}, I'm well-equipped to take ownership of responsibilities in this role. I appreciate that {company} seems to value autonomy, and I'm confident I'd excel in such an environment.`,
    closing: `I'd be glad to discuss how my independent working style could benefit your team. {closing}`
  },

  security: {
    opening: `I'm interested in the {jobTitle} position at {company} as an opportunity to contribute to a stable organization while building a long-term career.`,
    body: `I value consistency and long-term commitment in my professional life. {achievement1}, demonstrating my dedication to seeing things through. I've also {achievement2}, reflecting my reliable and thorough approach.

My experience with {skill1} and {skill2} provides a solid foundation for this role. I'm attracted to {company}'s established presence and the opportunity to grow within a stable environment.`,
    closing: `I'd appreciate the opportunity to discuss how I could contribute to your team's continued success. {closing}`
  },

  entrepreneurial: {
    opening: `The {jobTitle} role at {company} excites me because of the opportunity to innovate and build something impactful.`,
    body: `I'm driven by creating new things and driving change. {achievement1}, where I identified an opportunity and built a solution from the ground up. I've also {achievement2}, showing my initiative in pursuing new ideas.

My skills in {skill1} and {skill2} enable me to move quickly from concept to execution. I'm drawn to {company}'s innovative spirit and would love to bring my entrepreneurial energy to your team.`,
    closing: `I'm eager to discuss how I could help drive innovation at {company}. {closing}`
  },

  service: {
    opening: `I'm drawn to the {jobTitle} position at {company} because of the opportunity to make a meaningful difference for others.`,
    body: `What motivates me most is knowing my work helps people. {achievement1}, which directly improved outcomes for those I served. I've also {achievement2}, reflecting my commitment to adding value for others.

My background in {skill1} and {skill2} has always been focused on service. I'm impressed by {company}'s mission and excited about the opportunity to contribute to work that matters.`,
    closing: `I'd love to discuss how I could contribute to {company}'s mission. {closing}`
  },

  challenge: {
    opening: `The {jobTitle} role at {company} appeals to me because of the complex challenges it presents.`,
    body: `I'm energized by difficult problems that others might shy away from. {achievement1}, which required navigating significant complexity. I've also {achievement2}, demonstrating my persistence when facing obstacles.

My expertise in {skill1} and {skill2} has been developed through tackling challenging work. I'm excited by the technical and strategic challenges this role offers and am confident I'd thrive in such an environment.`,
    closing: `I'm excited about the challenges ahead and would welcome the opportunity to discuss this further. {closing}`
  },

  lifestyle: {
    opening: `I'm interested in the {jobTitle} position at {company} as it aligns with both my professional goals and my approach to balanced, sustainable work.`,
    body: `I believe in doing excellent work while maintaining perspective. {achievement1}, which I accomplished through focused, efficient effort. I've also {achievement2}, demonstrating that quality work doesn't require burnout.

My skills in {skill1} and {skill2} enable me to deliver strong results. I appreciate that {company} seems to value both performance and wellbeing, which aligns with my approach to work.`,
    closing: `I'd be happy to discuss how I could contribute to your team effectively. {closing}`
  }
};

function getTemplateByAnchor(anchor: CareerAnchor): CoverLetterTemplate {
  return templates[anchor] || templates.technical_competence;
}

// ============================================
// Content Extraction
// ============================================

function extractAchievements(resumeText: string): string[] {
  const achievements: string[] = [];
  const textLower = resumeText.toLowerCase();
  
  const achievementPatterns = [
    /(?:led|managed|built|developed|created|implemented|launched|delivered|increased|reduced|improved|designed|architected)[^.]{20,100}\./gi,
    /(?:\d+%|\d+x|\$\d+|\d+\s*(?:users|customers|team|people))[^.]{10,80}\./gi
  ];

  for (const pattern of achievementPatterns) {
    const matches = resumeText.match(pattern);
    if (matches) {
      achievements.push(...matches.slice(0, 2).map(m => m.trim().replace(/^\W+/, '')));
    }
  }

  // Clean up and deduplicate
  return Array.from(new Set(achievements))
    .slice(0, 3)
    .map(a => a.charAt(0).toLowerCase() + a.slice(1).replace(/\.$/, ''));
}

function extractSkills(resumeText: string, requirements: string[]): string[] {
  const skills: string[] = [];
  const textLower = resumeText.toLowerCase();
  
  // Common skill patterns
  const skillKeywords = [
    'python', 'javascript', 'typescript', 'react', 'node', 'aws', 'sql',
    'leadership', 'management', 'communication', 'problem-solving',
    'project management', 'data analysis', 'design', 'architecture',
    'agile', 'scrum', 'devops', 'machine learning', 'product'
  ];

  // First, try to match with requirements
  for (const req of requirements) {
    const reqWords = req.toLowerCase().split(/\s+/);
    for (const word of reqWords) {
      if (word.length > 4 && textLower.includes(word)) {
        skills.push(word);
      }
    }
  }

  // Then add common skills found
  for (const skill of skillKeywords) {
    if (textLower.includes(skill)) {
      skills.push(skill);
    }
  }

  return Array.from(new Set(skills)).slice(0, 4);
}

function getMotivation(anchor: CareerAnchor): string {
  const motivations: Record<CareerAnchor, string> = {
    technical_competence: 'deepen my expertise',
    management: 'lead and develop teams',
    autonomy: 'own my work independently',
    security: 'build a stable career',
    entrepreneurial: 'innovate and create',
    service: 'make a meaningful impact',
    challenge: 'tackle complex problems',
    lifestyle: 'do excellent work sustainably'
  };
  return motivations[anchor] || 'grow professionally';
}

function getClosing(anchor: CareerAnchor): string {
  const closings: Record<CareerAnchor, string> = {
    technical_competence: 'Thank you for considering my application.',
    management: 'I look forward to the possibility of leading great work together.',
    autonomy: 'Thank you for your time and consideration.',
    security: 'Thank you for the opportunity to apply.',
    entrepreneurial: 'Looking forward to potentially building something great together.',
    service: 'Thank you for the opportunity to contribute.',
    challenge: 'I look forward to the possibility of tackling these challenges.',
    lifestyle: 'Thank you for your consideration.'
  };
  return closings[anchor] || 'Thank you for your consideration.';
}

// ============================================
// Template Filling
// ============================================

interface TemplateVariables {
  company: string;
  jobTitle: string;
  achievement1: string;
  achievement2: string;
  skill1: string;
  skill2: string;
  motivation: string;
  closing: string;
}

function fillTemplate(template: CoverLetterTemplate, vars: TemplateVariables): string {
  let content = `${template.opening}\n\n${template.body}\n\n${template.closing}`;
  
  for (const [key, value] of Object.entries(vars)) {
    content = content.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  
  return content;
}
