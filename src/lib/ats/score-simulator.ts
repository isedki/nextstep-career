import { analyzeKeywords, KeywordAnalysisResult } from './keyword-analyzer';
import { checkFormatting, FormatCheckResult, ATSMode } from './format-rules';

export interface ATSScore {
  overall: number;
  passLikelihood: 'high' | 'medium' | 'low';
  breakdown: {
    keywordMatch: number;
    formatting: number;
    relevance: number;
    completeness: number;
  };
  mode: ATSMode;
  modeDescription: string;
  keywordAnalysis: KeywordAnalysisResult;
  formatAnalysis: FormatCheckResult;
  improvements: Improvement[];
  summary: string;
}

export interface Improvement {
  category: 'keyword' | 'format' | 'relevance' | 'completeness';
  priority: 'high' | 'medium' | 'low';
  action: string;
  impact: string;
}

interface RoleKeyword {
  keyword: string;
  weight: number;
  type: string;
}

const MODE_DESCRIPTIONS: Record<ATSMode, string> = {
  strict: 'Strict Mode (Workday, Taleo): Requires exact keyword matches and strict formatting',
  balanced: 'Balanced Mode (Greenhouse, iCIMS): Industry standard with some flexibility',
  flexible: 'Flexible Mode (Lever, SmartRecruiters): AI-assisted with semantic matching',
};

const PASS_THRESHOLDS: Record<ATSMode, { high: number; medium: number }> = {
  strict: { high: 85, medium: 70 },
  balanced: { high: 75, medium: 60 },
  flexible: { high: 65, medium: 50 },
};

const SCORE_WEIGHTS: Record<ATSMode, { keyword: number; format: number; relevance: number; completeness: number }> = {
  strict: { keyword: 0.45, format: 0.25, relevance: 0.20, completeness: 0.10 },
  balanced: { keyword: 0.40, format: 0.20, relevance: 0.25, completeness: 0.15 },
  flexible: { keyword: 0.35, format: 0.15, relevance: 0.30, completeness: 0.20 },
};

export function simulateATSScore(
  resumeText: string,
  jobDescription: string,
  mode: ATSMode = 'balanced',
  roleKeywords?: RoleKeyword[]
): ATSScore {
  const keywordAnalysis = analyzeKeywords(resumeText, jobDescription, roleKeywords, mode);
  const formatAnalysis = checkFormatting(resumeText, mode);

  const keywordScore = keywordAnalysis.weightedMatchRate;
  const formatScore = formatAnalysis.score;
  const relevanceScore = calculateRelevanceScore(resumeText, jobDescription, keywordAnalysis);
  const completenessScore = calculateCompletenessScore(resumeText);

  const weights = SCORE_WEIGHTS[mode];
  const overall = Math.round(
    keywordScore * weights.keyword +
    formatScore * weights.format +
    relevanceScore * weights.relevance +
    completenessScore * weights.completeness
  );

  const thresholds = PASS_THRESHOLDS[mode];
  const passLikelihood: 'high' | 'medium' | 'low' = 
    overall >= thresholds.high ? 'high' :
    overall >= thresholds.medium ? 'medium' : 'low';

  const improvements = generateImprovements(
    keywordAnalysis,
    formatAnalysis,
    relevanceScore,
    completenessScore,
    mode
  );

  const summary = generateSummary(overall, passLikelihood, mode, improvements);

  return {
    overall,
    passLikelihood,
    breakdown: {
      keywordMatch: Math.round(keywordScore),
      formatting: Math.round(formatScore),
      relevance: Math.round(relevanceScore),
      completeness: Math.round(completenessScore),
    },
    mode,
    modeDescription: MODE_DESCRIPTIONS[mode],
    keywordAnalysis,
    formatAnalysis,
    improvements,
    summary,
  };
}

function calculateRelevanceScore(
  resumeText: string,
  jobDescription: string,
  keywordAnalysis: KeywordAnalysisResult
): number {
  let score = 50;

  const criticalMatches = keywordAnalysis.matches.filter(m => m.importance === 'critical').length;
  const criticalTotal = keywordAnalysis.matches.filter(m => m.importance === 'critical').length +
    keywordAnalysis.missing.filter(m => m.importance === 'critical').length;
  
  if (criticalTotal > 0) {
    const criticalRatio = criticalMatches / criticalTotal;
    score += criticalRatio * 30;
  } else {
    score += 15;
  }

  const resumeLower = resumeText.toLowerCase();
  const jdLower = jobDescription.toLowerCase();

  const titlePattern = /\b(engineer|developer|manager|director|architect|analyst|consultant|executive|specialist)\b/gi;
  
  const resumeTitles = resumeLower.match(titlePattern) || [];
  const jdTitles = jdLower.match(titlePattern) || [];
  
  const resumeTitlesSet = new Set(resumeTitles.map(t => t.toLowerCase()));
  const jdTitlesSet = new Set(jdTitles.map(t => t.toLowerCase()));
  
  let overlap = 0;
  resumeTitlesSet.forEach(t => {
    if (jdTitlesSet.has(t)) overlap++;
  });
  
  if (overlap > 0) {
    score += Math.min(overlap * 5, 20);
  }

  return Math.min(100, Math.max(0, score));
}

function calculateCompletenessScore(resumeText: string): number {
  let score = 0;
  const checks = [
    { pattern: /[\w.-]+@[\w.-]+\.\w+/, weight: 15, name: 'email' },
    { pattern: /[\d\s()-]{10,}/, weight: 10, name: 'phone' },
    { pattern: /\b(experience|work experience|professional experience)\b/i, weight: 15, name: 'experience section' },
    { pattern: /\b(education|academic|degree|university|college)\b/i, weight: 15, name: 'education section' },
    { pattern: /\b(skills|technical skills|competencies)\b/i, weight: 15, name: 'skills section' },
    { pattern: /\d{4}\s*[-–]\s*(present|\d{4})/i, weight: 10, name: 'date ranges' },
    { pattern: /\d+%|\$[\d,]+|increased|decreased|improved|grew/i, weight: 10, name: 'quantified achievements' },
    { pattern: /linkedin\.com|github\.com/i, weight: 5, name: 'professional links' },
    { pattern: /\b(summary|objective|profile)\b/i, weight: 5, name: 'summary section' },
  ];

  for (const check of checks) {
    if (check.pattern.test(resumeText)) {
      score += check.weight;
    }
  }

  return score;
}

function generateImprovements(
  keywordAnalysis: KeywordAnalysisResult,
  formatAnalysis: FormatCheckResult,
  relevanceScore: number,
  completenessScore: number,
  mode: ATSMode
): Improvement[] {
  const improvements: Improvement[] = [];

  const criticalMissing = keywordAnalysis.missing.filter(m => m.importance === 'critical');
  if (criticalMissing.length > 0) {
    improvements.push({
      category: 'keyword',
      priority: 'high',
      action: `Add critical keywords: ${criticalMissing.slice(0, 3).map(m => m.keyword).join(', ')}`,
      impact: `Could increase keyword score by ${Math.min(criticalMissing.length * 5, 20)}%`,
    });
  }

  const importantMissing = keywordAnalysis.missing.filter(m => m.importance === 'important');
  if (importantMissing.length > 3) {
    improvements.push({
      category: 'keyword',
      priority: 'medium',
      action: `Consider adding: ${importantMissing.slice(0, 3).map(m => m.keyword).join(', ')}`,
      impact: 'Could improve keyword match by 10-15%',
    });
  }

  const formatErrors = formatAnalysis.issues.filter(i => i.severity === 'error');
  if (formatErrors.length > 0) {
    improvements.push({
      category: 'format',
      priority: 'high',
      action: formatErrors[0].suggestion,
      impact: `Critical for ${formatErrors[0].affectedATS.join(', ')} compatibility`,
    });
  }

  const formatWarnings = formatAnalysis.issues.filter(i => i.severity === 'warning');
  if (formatWarnings.length > 0 && mode !== 'flexible') {
    improvements.push({
      category: 'format',
      priority: 'medium',
      action: formatWarnings[0].suggestion,
      impact: 'Improves parsing accuracy',
    });
  }

  if (relevanceScore < 60) {
    improvements.push({
      category: 'relevance',
      priority: 'medium',
      action: 'Tailor your resume more specifically to this job description',
      impact: 'Better alignment with role requirements',
    });
  }

  if (completenessScore < 70) {
    improvements.push({
      category: 'completeness',
      priority: 'low',
      action: 'Add missing sections (summary, skills, or quantified achievements)',
      impact: 'Creates a more complete professional profile',
    });
  }

  return improvements.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

function generateSummary(
  score: number,
  likelihood: 'high' | 'medium' | 'low',
  mode: ATSMode,
  improvements: Improvement[]
): string {
  const likelihoodText = {
    high: 'Your resume is likely to pass ATS screening',
    medium: 'Your resume may or may not pass ATS screening',
    low: 'Your resume is at risk of being filtered out by ATS',
  };

  const modeContext = {
    strict: 'For enterprise ATS like Workday or Taleo',
    balanced: 'For most modern ATS systems',
    flexible: 'For AI-powered ATS like Lever',
  };

  let summary = `Score: ${score}/100. ${likelihoodText[likelihood]}. ${modeContext[mode]}.`;

  if (improvements.length > 0) {
    const topImprovement = improvements[0];
    summary += ` Top priority: ${topImprovement.action}`;
  }

  return summary;
}

export function compareScoresAcrossModes(
  resumeText: string,
  jobDescription: string,
  roleKeywords?: RoleKeyword[]
): Record<ATSMode, ATSScore> {
  return {
    strict: simulateATSScore(resumeText, jobDescription, 'strict', roleKeywords),
    balanced: simulateATSScore(resumeText, jobDescription, 'balanced', roleKeywords),
    flexible: simulateATSScore(resumeText, jobDescription, 'flexible', roleKeywords),
  };
}

export function getRecommendedMode(companyName?: string): ATSMode {
  if (!companyName) return 'balanced';
  
  const name = companyName.toLowerCase();
  
  const strictCompanies = ['oracle', 'sap', 'ibm', 'accenture', 'deloitte', 'pwc', 'kpmg', 'ey'];
  const flexibleCompanies = ['stripe', 'notion', 'figma', 'linear', 'vercel', 'supabase'];
  
  if (strictCompanies.some(c => name.includes(c))) return 'strict';
  if (flexibleCompanies.some(c => name.includes(c))) return 'flexible';
  
  return 'balanced';
}
