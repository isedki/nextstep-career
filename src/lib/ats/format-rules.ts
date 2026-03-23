export interface FormatIssue {
  rule: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  suggestion: string;
  affectedATS: string[];
}

export interface FormatCheckResult {
  score: number;
  issues: FormatIssue[];
  passedRules: string[];
  recommendations: string[];
}

export type ATSMode = 'strict' | 'balanced' | 'flexible';

interface FormatRule {
  id: string;
  name: string;
  description: string;
  check: (text: string) => boolean;
  severity: Record<ATSMode, 'error' | 'warning' | 'info' | 'skip'>;
  suggestion: string;
  affectedATS: string[];
}

const FORMAT_RULES: FormatRule[] = [
  {
    id: 'has_contact_info',
    name: 'Contact Information Present',
    description: 'Resume should include contact information at the top',
    check: (text) => {
      const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(text);
      const hasPhone = /[\d\s()-]{10,}/.test(text);
      return hasEmail || hasPhone;
    },
    severity: { strict: 'error', balanced: 'error', flexible: 'warning' },
    suggestion: 'Add your email and phone number at the top of your resume',
    affectedATS: ['All ATS systems'],
  },
  {
    id: 'no_tables',
    name: 'No Complex Tables',
    description: 'Tables can confuse ATS parsers',
    check: (text) => {
      const tablePatterns = [
        /\|.*\|.*\|/,
        /┌|┐|└|┘|│|─/,
        /\+[-+]+\+/,
      ];
      return !tablePatterns.some(p => p.test(text));
    },
    severity: { strict: 'error', balanced: 'warning', flexible: 'info' },
    suggestion: 'Use bullet points instead of tables for better ATS compatibility',
    affectedATS: ['Workday', 'Taleo', 'iCIMS'],
  },
  {
    id: 'standard_sections',
    name: 'Standard Section Headers',
    description: 'Use standard section names that ATS systems recognize',
    check: (text) => {
      const standardHeaders = [
        /\b(experience|work experience|professional experience|employment)\b/i,
        /\b(education|academic|qualifications)\b/i,
        /\b(skills|technical skills|core competencies)\b/i,
      ];
      const matchCount = standardHeaders.filter(h => h.test(text)).length;
      return matchCount >= 2;
    },
    severity: { strict: 'error', balanced: 'warning', flexible: 'info' },
    suggestion: 'Use standard headers like "Experience", "Education", and "Skills"',
    affectedATS: ['Workday', 'Greenhouse', 'Lever'],
  },
  {
    id: 'consistent_date_format',
    name: 'Consistent Date Format',
    description: 'Dates should follow a consistent format',
    check: (text) => {
      const datePatterns = [
        /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s*\d{4}/gi,
        /\b\d{1,2}\/\d{4}/g,
        /\b\d{4}\s*-\s*(present|current|\d{4})/gi,
      ];
      const matches = datePatterns.flatMap(p => text.match(p) || []);
      if (matches.length < 2) return true;
      const pattern1 = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i;
      const pattern2 = /\d{1,2}\/\d{4}/;
      const hasPattern1 = matches.some(m => pattern1.test(m));
      const hasPattern2 = matches.some(m => pattern2.test(m));
      return !(hasPattern1 && hasPattern2);
    },
    severity: { strict: 'error', balanced: 'warning', flexible: 'skip' },
    suggestion: 'Use consistent date format throughout (e.g., "Jan 2020" or "01/2020")',
    affectedATS: ['Workday', 'Taleo'],
  },
  {
    id: 'no_headers_footers',
    name: 'No Headers/Footers Content',
    description: 'Important info should not be in headers/footers',
    check: (text) => {
      const lines = text.split('\n');
      if (lines.length < 5) return true;
      const firstLines = lines.slice(0, 3).join(' ').toLowerCase();
      return /[\w.-]+@[\w.-]+\.\w+/.test(firstLines) || /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(firstLines);
    },
    severity: { strict: 'warning', balanced: 'info', flexible: 'skip' },
    suggestion: 'Keep contact info in the main body, not in document headers',
    affectedATS: ['Taleo', 'iCIMS'],
  },
  {
    id: 'no_special_characters',
    name: 'Minimal Special Characters',
    description: 'Avoid excessive special characters that may not parse correctly',
    check: (text) => {
      const specialChars = text.match(/[^\w\s.,;:'"!?@#$%&*()\-+=\[\]{}|\\/<>]/g) || [];
      const ratio = specialChars.length / text.length;
      return ratio < 0.02;
    },
    severity: { strict: 'warning', balanced: 'info', flexible: 'skip' },
    suggestion: 'Use standard punctuation marks and avoid decorative characters',
    affectedATS: ['Workday', 'Taleo'],
  },
  {
    id: 'reasonable_length',
    name: 'Reasonable Resume Length',
    description: 'Resume should be appropriate length',
    check: (text) => {
      const wordCount = text.split(/\s+/).length;
      return wordCount >= 200 && wordCount <= 2000;
    },
    severity: { strict: 'warning', balanced: 'warning', flexible: 'info' },
    suggestion: 'Aim for 400-800 words for a single-page resume, up to 1200 for two pages',
    affectedATS: ['All ATS systems'],
  },
  {
    id: 'has_bullet_points',
    name: 'Uses Bullet Points',
    description: 'Bullet points improve readability and parsing',
    check: (text) => {
      const bulletPatterns = [
        /^[\s]*[•●○■□►▸▹-]\s/m,
        /^[\s]*\*\s/m,
        /^\s*-\s+\w/m,
      ];
      return bulletPatterns.some(p => p.test(text));
    },
    severity: { strict: 'warning', balanced: 'info', flexible: 'skip' },
    suggestion: 'Use bullet points to list responsibilities and achievements',
    affectedATS: ['All ATS systems'],
  },
  {
    id: 'quantified_achievements',
    name: 'Quantified Achievements',
    description: 'Include numbers and metrics to strengthen impact',
    check: (text) => {
      const quantifiers = [
        /\d+%/,
        /\$[\d,]+/,
        /\d+\+?\s*(years?|months?)/i,
        /increased|decreased|improved|reduced|grew|saved/i,
      ];
      const matchCount = quantifiers.filter(p => p.test(text)).length;
      return matchCount >= 2;
    },
    severity: { strict: 'info', balanced: 'info', flexible: 'skip' },
    suggestion: 'Add numbers (%, $, timeframes) to quantify your achievements',
    affectedATS: ['Greenhouse', 'Lever'],
  },
  {
    id: 'no_images_graphics',
    name: 'No Images or Graphics',
    description: 'Images and graphics are not parsed by ATS',
    check: (text) => {
      const imageIndicators = [
        /\[image\]/i,
        /\[photo\]/i,
        /\[graphic\]/i,
        /📷|📸|🖼️|👤/,
      ];
      return !imageIndicators.some(p => p.test(text));
    },
    severity: { strict: 'error', balanced: 'warning', flexible: 'info' },
    suggestion: 'Remove images, photos, or graphics - they are ignored by ATS',
    affectedATS: ['All ATS systems'],
  },
  {
    id: 'action_verbs',
    name: 'Strong Action Verbs',
    description: 'Start bullet points with action verbs',
    check: (text) => {
      const actionVerbs = /\b(led|managed|developed|created|implemented|designed|built|achieved|delivered|launched|improved|increased|reduced|negotiated|coordinated|established|analyzed|optimized|streamlined|spearheaded)\b/gi;
      const matches = text.match(actionVerbs) || [];
      return matches.length >= 5;
    },
    severity: { strict: 'info', balanced: 'info', flexible: 'skip' },
    suggestion: 'Start accomplishments with action verbs like "Led", "Developed", "Achieved"',
    affectedATS: ['Greenhouse', 'Lever', 'SmartRecruiters'],
  },
];

export function checkFormatting(text: string, mode: ATSMode = 'balanced'): FormatCheckResult {
  const issues: FormatIssue[] = [];
  const passedRules: string[] = [];
  let score = 100;

  for (const rule of FORMAT_RULES) {
    const severity = rule.severity[mode];
    
    if (severity === 'skip') continue;

    const passed = rule.check(text);

    if (passed) {
      passedRules.push(rule.name);
    } else {
      issues.push({
        rule: rule.name,
        severity,
        message: rule.description,
        suggestion: rule.suggestion,
        affectedATS: rule.affectedATS,
      });

      const penalty = severity === 'error' ? 15 : severity === 'warning' ? 8 : 3;
      score -= penalty;
    }
  }

  score = Math.max(0, Math.min(100, score));

  const recommendations = generateFormatRecommendations(issues, mode);

  return {
    score,
    issues,
    passedRules,
    recommendations,
  };
}

function generateFormatRecommendations(issues: FormatIssue[], mode: ATSMode): string[] {
  const recommendations: string[] = [];

  const errors = issues.filter(i => i.severity === 'error');
  const warnings = issues.filter(i => i.severity === 'warning');

  if (errors.length > 0) {
    recommendations.push(
      `Fix these critical issues first: ${errors.map(e => e.rule).join(', ')}`
    );
  }

  if (warnings.length > 0 && mode !== 'flexible') {
    recommendations.push(
      `Address these warnings for better compatibility: ${warnings.slice(0, 3).map(w => w.rule).join(', ')}`
    );
  }

  if (issues.length === 0) {
    recommendations.push('Great formatting! Your resume structure is ATS-friendly.');
  }

  if (mode === 'strict') {
    recommendations.push(
      'For strict ATS (Workday/Taleo): Use simple formatting, standard fonts, and avoid any graphics.'
    );
  }

  return recommendations;
}

export const ATS_FORMAT_TIPS = {
  fileFormat: {
    title: 'File Format',
    tips: [
      'PDF is generally safe for most ATS systems',
      'DOCX is preferred by some older ATS (Taleo, iCIMS)',
      'Avoid formats like .pages, .odt, or image-based PDFs',
    ],
  },
  fonts: {
    title: 'Font Recommendations',
    tips: [
      'Use standard fonts: Arial, Calibri, Times New Roman, Helvetica',
      'Font size: 10-12pt for body, 14-16pt for headers',
      'Avoid decorative or script fonts',
    ],
  },
  structure: {
    title: 'Document Structure',
    tips: [
      'Use a single-column layout for best parsing',
      'Put contact info at the very top, not in headers',
      'Use clear section breaks with standard headers',
    ],
  },
  content: {
    title: 'Content Guidelines',
    tips: [
      'Use bullet points instead of paragraphs',
      'Start bullets with action verbs',
      'Include numbers and metrics to quantify achievements',
      'Tailor keywords to match the job description',
    ],
  },
};
