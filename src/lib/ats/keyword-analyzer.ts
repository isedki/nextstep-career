export interface KeywordMatch {
  keyword: string;
  found: boolean;
  importance: 'critical' | 'important' | 'nice-to-have';
  foundVariant?: string;
  context?: string;
}

export interface KeywordAnalysisResult {
  matchRate: number;
  weightedMatchRate: number;
  matches: KeywordMatch[];
  missing: KeywordMatch[];
  suggestions: string[];
  extractedFromJD: string[];
}

interface RoleKeyword {
  keyword: string;
  weight: number;
  type: string;
}

const COMMON_SYNONYMS: Record<string, string[]> = {
  'javascript': ['js', 'ecmascript', 'es6', 'es2015'],
  'typescript': ['ts'],
  'python': ['py'],
  'react': ['reactjs', 'react.js'],
  'node': ['nodejs', 'node.js'],
  'vue': ['vuejs', 'vue.js'],
  'angular': ['angularjs'],
  'aws': ['amazon web services', 'amazon cloud'],
  'gcp': ['google cloud', 'google cloud platform'],
  'azure': ['microsoft azure', 'azure cloud'],
  'kubernetes': ['k8s'],
  'ci/cd': ['cicd', 'ci cd', 'continuous integration', 'continuous deployment'],
  'devops': ['dev ops', 'development operations'],
  'agile': ['scrum', 'kanban'],
  'api': ['rest api', 'restful', 'graphql'],
  'sql': ['mysql', 'postgresql', 'postgres', 'oracle db'],
  'nosql': ['mongodb', 'dynamodb', 'cassandra', 'redis'],
  'saas': ['software as a service'],
  'b2b': ['business to business', 'enterprise'],
  'b2c': ['business to consumer', 'consumer'],
  'crm': ['customer relationship management', 'salesforce', 'hubspot'],
  'erp': ['enterprise resource planning'],
  'pm': ['product manager', 'project manager'],
  'ux': ['user experience'],
  'ui': ['user interface'],
  'ml': ['machine learning'],
  'ai': ['artificial intelligence'],
  'nrr': ['net revenue retention', 'net retention'],
  'arr': ['annual recurring revenue'],
  'mrr': ['monthly recurring revenue'],
  'cac': ['customer acquisition cost'],
  'ltv': ['lifetime value', 'customer lifetime value'],
  'quota attainment': ['quota achievement', 'hit quota', 'exceeded quota'],
  'enterprise sales': ['enterprise selling', 'large account sales'],
  'customer success': ['cs', 'customer experience', 'cx'],
  'solution architecture': ['solutions architect', 'sa'],
  'presales': ['pre-sales', 'pre sales'],
  'cross-functional': ['cross functional', 'cross-team'],
};

const SKILL_EXTRACTION_PATTERNS = [
  /(?:experience with|proficiency in|knowledge of|expertise in|familiar with)\s+([^,.]+)/gi,
  /(?:strong|excellent|good)\s+([^,.]+)\s+skills/gi,
  /(\d+\+?\s*years?)\s+(?:of\s+)?([^,.]+)/gi,
  /(?:must have|required|preferred|nice to have)[:\s]+([^,.]+)/gi,
];

const TECH_KEYWORDS = [
  'javascript', 'typescript', 'python', 'java', 'go', 'rust', 'ruby', 'php', 'c#', 'c++',
  'react', 'vue', 'angular', 'svelte', 'next.js', 'nuxt', 'node.js', 'express', 'fastify',
  'aws', 'azure', 'gcp', 'kubernetes', 'docker', 'terraform', 'ansible',
  'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch',
  'graphql', 'rest', 'grpc', 'websocket',
  'git', 'ci/cd', 'jenkins', 'github actions', 'gitlab ci',
  'agile', 'scrum', 'kanban', 'jira', 'confluence',
];

const BUSINESS_KEYWORDS = [
  'saas', 'b2b', 'b2c', 'enterprise', 'startup', 'scale-up',
  'revenue', 'arr', 'mrr', 'nrr', 'churn', 'retention',
  'quota', 'pipeline', 'forecast', 'territory',
  'customer success', 'onboarding', 'adoption', 'expansion',
  'presales', 'solution', 'architecture', 'consulting',
  'stakeholder', 'executive', 'c-suite', 'board',
  'strategy', 'roadmap', 'okr', 'kpi',
];

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function findKeywordInText(keyword: string, text: string, mode: 'strict' | 'balanced' | 'flexible'): { found: boolean; variant?: string } {
  const normalizedText = normalizeText(text);
  const normalizedKeyword = normalizeText(keyword);
  
  if (normalizedText.includes(normalizedKeyword)) {
    return { found: true, variant: keyword };
  }

  if (mode === 'strict') {
    return { found: false };
  }

  const synonyms = COMMON_SYNONYMS[normalizedKeyword] || [];
  for (const synonym of synonyms) {
    if (normalizedText.includes(normalizeText(synonym))) {
      return { found: true, variant: synonym };
    }
  }

  for (const [canonical, syns] of Object.entries(COMMON_SYNONYMS)) {
    if (syns.map(s => normalizeText(s)).includes(normalizedKeyword)) {
      if (normalizedText.includes(normalizeText(canonical))) {
        return { found: true, variant: canonical };
      }
    }
  }

  if (mode === 'flexible') {
    const keywordWords = normalizedKeyword.split(' ');
    if (keywordWords.length > 1) {
      const matchCount = keywordWords.filter(word => 
        word.length > 3 && normalizedText.includes(word)
      ).length;
      if (matchCount >= Math.ceil(keywordWords.length * 0.6)) {
        return { found: true, variant: `partial: ${keywordWords.filter(w => normalizedText.includes(w)).join(' ')}` };
      }
    }
  }

  return { found: false };
}

export function extractKeywordsFromJobDescription(jobDescription: string): string[] {
  const extracted = new Set<string>();
  const normalizedJD = normalizeText(jobDescription);

  for (const tech of TECH_KEYWORDS) {
    if (normalizedJD.includes(normalizeText(tech))) {
      extracted.add(tech);
    }
  }

  for (const biz of BUSINESS_KEYWORDS) {
    if (normalizedJD.includes(normalizeText(biz))) {
      extracted.add(biz);
    }
  }

  for (const pattern of SKILL_EXTRACTION_PATTERNS) {
    let match;
    while ((match = pattern.exec(jobDescription)) !== null) {
      const skill = match[match.length - 1]?.trim();
      if (skill && skill.length > 2 && skill.length < 50) {
        extracted.add(skill.toLowerCase());
      }
    }
  }

  return Array.from(extracted);
}

export function analyzeKeywords(
  resumeText: string,
  jobDescription: string,
  roleKeywords?: RoleKeyword[],
  mode: 'strict' | 'balanced' | 'flexible' = 'balanced'
): KeywordAnalysisResult {
  const matches: KeywordMatch[] = [];
  const missing: KeywordMatch[] = [];
  const extractedFromJD = extractKeywordsFromJobDescription(jobDescription);

  const keywordsToCheck: { keyword: string; weight: number }[] = [];

  if (roleKeywords && roleKeywords.length > 0) {
    for (const rk of roleKeywords) {
      keywordsToCheck.push({ keyword: rk.keyword, weight: rk.weight });
    }
  }

  for (const jdKeyword of extractedFromJD) {
    if (!keywordsToCheck.some(k => normalizeText(k.keyword) === normalizeText(jdKeyword))) {
      keywordsToCheck.push({ keyword: jdKeyword, weight: 2 });
    }
  }

  let totalWeight = 0;
  let matchedWeight = 0;

  for (const { keyword, weight } of keywordsToCheck) {
    const importance: 'critical' | 'important' | 'nice-to-have' = 
      weight >= 3 ? 'critical' : weight >= 2 ? 'important' : 'nice-to-have';
    
    totalWeight += weight;
    
    const result = findKeywordInText(keyword, resumeText, mode);
    
    if (result.found) {
      matchedWeight += weight;
      matches.push({
        keyword,
        found: true,
        importance,
        foundVariant: result.variant,
      });
    } else {
      missing.push({
        keyword,
        found: false,
        importance,
      });
    }
  }

  const matchRate = keywordsToCheck.length > 0 
    ? (matches.length / keywordsToCheck.length) * 100 
    : 0;
  
  const weightedMatchRate = totalWeight > 0 
    ? (matchedWeight / totalWeight) * 100 
    : 0;

  const suggestions = generateSuggestions(missing, matches);

  return {
    matchRate: Math.round(matchRate),
    weightedMatchRate: Math.round(weightedMatchRate),
    matches,
    missing,
    suggestions,
    extractedFromJD,
  };
}

function generateSuggestions(missing: KeywordMatch[], matches: KeywordMatch[]): string[] {
  const suggestions: string[] = [];

  const criticalMissing = missing.filter(m => m.importance === 'critical');
  const importantMissing = missing.filter(m => m.importance === 'important');

  if (criticalMissing.length > 0) {
    suggestions.push(
      `Add these critical keywords to your resume: ${criticalMissing.slice(0, 5).map(m => m.keyword).join(', ')}`
    );
  }

  if (importantMissing.length > 0) {
    suggestions.push(
      `Consider adding: ${importantMissing.slice(0, 5).map(m => m.keyword).join(', ')}`
    );
  }

  if (missing.length > matches.length) {
    suggestions.push(
      'Your resume is missing many keywords from the job description. Consider tailoring it more specifically.'
    );
  }

  if (matches.length > 0 && missing.length === 0) {
    suggestions.push(
      'Great keyword coverage! Focus on quantifying your achievements with these skills.'
    );
  }

  return suggestions;
}

export function calculateKeywordDensity(text: string, keywords: string[]): Record<string, number> {
  const normalizedText = normalizeText(text);
  const wordCount = normalizedText.split(' ').length;
  const density: Record<string, number> = {};

  for (const keyword of keywords) {
    const regex = new RegExp(normalizeText(keyword), 'gi');
    const matches = normalizedText.match(regex);
    const count = matches ? matches.length : 0;
    density[keyword] = Math.round((count / wordCount) * 1000) / 10;
  }

  return density;
}
