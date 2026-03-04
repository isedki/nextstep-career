import { Job } from './api';
import { IdealCompanyProfile } from '../recommendations/company-profile';
import { IdealJobProfile } from '../recommendations/job-profile';
import { companyDatabase } from '../recommendations/company-database';
import { Expectations } from '../expectations/store';

// ============================================
// Job Matching Algorithm
// ============================================

export interface ScoredJob extends Job {
  score: number;
  matchReasons: string[];
  concerns: string[];
  companyMatch?: {
    name: string;
    culture: string[];
    knownFor: string[];
  };
  expectationsMatch?: {
    salaryFit: 'above' | 'within' | 'below' | 'unknown';
    remoteFit: 'match' | 'acceptable' | 'mismatch' | 'unknown';
    levelFit: 'match' | 'stretch' | 'below' | 'unknown';
  };
}

export interface JobMatchingCriteria {
  companyProfile: IdealCompanyProfile;
  jobProfile: IdealJobProfile;
  salaryMin?: number;
  salaryMax?: number;
  remoteRequired?: boolean;
  expectations?: Expectations;
}

/**
 * Score and rank jobs based on profile fit
 */
export function scoreJobs(
  jobs: Job[],
  criteria: JobMatchingCriteria
): ScoredJob[] {
  return jobs
    .map(job => scoreJob(job, criteria))
    .sort((a, b) => b.score - a.score);
}

function scoreJob(
  job: Job,
  criteria: JobMatchingCriteria
): ScoredJob {
  let score = 50; // Base score
  const matchReasons: string[] = [];
  const concerns: string[] = [];
  let expectationsMatch: ScoredJob['expectationsMatch'] = undefined;

  // ========================================
  // Title Matching (25 points max)
  // ========================================
  const titleScore = scoreTitleMatch(job.title, criteria.jobProfile);
  score += titleScore.points;
  if (titleScore.reason) matchReasons.push(titleScore.reason);
  if (titleScore.concern) concerns.push(titleScore.concern);

  // ========================================
  // Company Match (20 points max)
  // ========================================
  const companyMatch = findCompanyMatch(job.company);
  let companyData: ScoredJob['companyMatch'] = undefined;
  
  if (companyMatch) {
    companyData = {
      name: companyMatch.name,
      culture: companyMatch.culture,
      knownFor: companyMatch.knownFor,
    };

    // Check culture fit
    if (companyMatch.culture.includes(criteria.companyProfile.culture.ideal)) {
      score += 15;
      matchReasons.push(`${companyMatch.name} has ${criteria.companyProfile.culture.ideal} culture`);
    } else if (criteria.companyProfile.culture.acceptable.some(c => companyMatch.culture.includes(c))) {
      score += 8;
      matchReasons.push(`${companyMatch.name} has compatible culture`);
    }

    // Check stage fit
    if (companyMatch.stage === criteria.companyProfile.stage.ideal) {
      score += 5;
      matchReasons.push('Right company stage');
    }
  }

  // ========================================
  // Expectations-Based Scoring (NEW - 30 points max)
  // ========================================
  if (criteria.expectations) {
    const expScore = scoreExpectations(job, criteria.expectations);
    score += expScore.points;
    matchReasons.push(...expScore.matches);
    concerns.push(...expScore.concerns);
    expectationsMatch = expScore.fit;
  } else {
    // Fallback to basic remote/salary checks
    // Remote/Location (15 points max)
    if (criteria.remoteRequired) {
      if (job.remote) {
        score += 15;
        matchReasons.push('Remote-friendly');
      } else {
        score -= 20;
        concerns.push('Requires onsite work');
      }
    } else if (job.remote) {
      score += 5;
      matchReasons.push('Offers remote option');
    }

    // Salary Match (15 points max)
    if (job.salary && criteria.salaryMin) {
      if (job.salary.min >= criteria.salaryMin) {
        score += 15;
        matchReasons.push('Meets salary expectations');
      } else if (job.salary.max >= criteria.salaryMin) {
        score += 8;
        matchReasons.push('Salary range overlaps');
      } else {
        concerns.push('Below salary expectations');
      }
    }
  }

  // ========================================
  // Job Description Analysis (25 points max)
  // ========================================
  const descScore = analyzeJobDescription(
    job.description + ' ' + job.requirements.join(' '),
    criteria.jobProfile,
    criteria.expectations
  );
  score += descScore.points;
  matchReasons.push(...descScore.matches);
  concerns.push(...descScore.redFlags);

  // Normalize score to 0-100
  score = Math.max(0, Math.min(100, score));

  return {
    ...job,
    score,
    matchReasons,
    concerns,
    companyMatch: companyData,
    expectationsMatch,
  };
}

// ========================================
// Expectations Scoring
// ========================================
function scoreExpectations(
  job: Job,
  expectations: Expectations
): {
  points: number;
  matches: string[];
  concerns: string[];
  fit: ScoredJob['expectationsMatch'];
} {
  let points = 0;
  const matches: string[] = [];
  const concerns: string[] = [];
  
  const fit: NonNullable<ScoredJob['expectationsMatch']> = {
    salaryFit: 'unknown',
    remoteFit: 'unknown',
    levelFit: 'unknown',
  };

  // ========================================
  // Salary Expectations (15 points max)
  // ========================================
  if (job.salary && expectations.salary.min) {
    const jobMin = job.salary.min;
    const jobMax = job.salary.max;
    const userMin = expectations.salary.min;
    const userTarget = expectations.salary.target;
    const userStretch = expectations.salary.stretch;

    if (userStretch && jobMin >= userStretch) {
      points += 15;
      matches.push('Exceeds salary expectations');
      fit.salaryFit = 'above';
    } else if (userTarget && jobMax >= userTarget) {
      points += 12;
      matches.push('Meets target salary');
      fit.salaryFit = 'within';
    } else if (jobMax >= userMin) {
      points += 8;
      matches.push('Salary range overlaps minimum');
      fit.salaryFit = 'within';
    } else {
      if (expectations.salary.flexibility === 'firm') {
        points -= 15;
        concerns.push('Below minimum salary (firm)');
      } else {
        points -= 5;
        concerns.push('Below minimum salary');
      }
      fit.salaryFit = 'below';
    }
  }

  // ========================================
  // Remote/Work Mode (15 points max)
  // ========================================
  const remotePref = expectations.workLife.remotePreference;
  
  if (remotePref === 'required') {
    if (job.remote) {
      points += 15;
      matches.push('Fully remote (required)');
      fit.remoteFit = 'match';
    } else {
      points -= 25;
      concerns.push('Requires onsite - you need remote');
      fit.remoteFit = 'mismatch';
    }
  } else if (remotePref === 'preferred') {
    if (job.remote) {
      points += 12;
      matches.push('Remote-friendly');
      fit.remoteFit = 'match';
    } else {
      points -= 5;
      concerns.push('No remote option');
      fit.remoteFit = 'acceptable';
    }
  } else if (remotePref === 'flexible') {
    if (job.remote) {
      points += 5;
      matches.push('Remote option available');
    }
    fit.remoteFit = 'acceptable';
  } else if (remotePref === 'onsite_preferred' || remotePref === 'onsite_ok') {
    if (!job.remote) {
      points += 5;
      matches.push('On-site opportunity');
      fit.remoteFit = 'match';
    }
  }

  // ========================================
  // Role Level (5 points max - estimated from title)
  // ========================================
  const titleLower = job.title.toLowerCase();
  const seniorityTarget = expectations.roleLevel.seniorityTarget;
  
  const levelIndicators = {
    junior: ['junior', 'associate', 'entry', 'graduate', 'intern'],
    mid: ['mid', 'intermediate'],
    senior: ['senior', 'sr.', 'sr '],
    staff: ['staff', 'principal', 'lead', 'architect'],
    director: ['director', 'head of', 'vp', 'vice president', 'chief']
  };

  let jobLevel: keyof typeof levelIndicators | 'unknown' = 'unknown';
  for (const [level, indicators] of Object.entries(levelIndicators)) {
    if (indicators.some(i => titleLower.includes(i))) {
      jobLevel = level as keyof typeof levelIndicators;
      break;
    }
  }

  if (jobLevel !== 'unknown') {
    if (seniorityTarget === 'up_one' || seniorityTarget === 'skip') {
      const levelOrder = ['junior', 'mid', 'senior', 'staff', 'director'];
      const jobIdx = levelOrder.indexOf(jobLevel);
      if (jobIdx >= levelOrder.indexOf('senior')) {
        points += 5;
        matches.push('Higher-level opportunity');
        fit.levelFit = 'stretch';
      }
    } else if (seniorityTarget === 'same' || seniorityTarget === 'flexible') {
      points += 3;
      fit.levelFit = 'match';
    }
  }

  // ========================================
  // Management Interest
  // ========================================
  const mgmtInterest = expectations.roleLevel.managementInterest;
  const hasManagementKeywords = /manager|management|lead|director|head of/i.test(job.title);
  const hasICKeywords = /engineer|developer|designer|analyst|specialist/i.test(job.title) && !hasManagementKeywords;

  if (mgmtInterest === 'ic_only' && hasManagementKeywords) {
    points -= 5;
    concerns.push('Management role - you prefer IC');
  } else if ((mgmtInterest === 'manager' || mgmtInterest === 'senior_mgmt') && hasICKeywords) {
    points -= 3;
    concerns.push('IC role - you prefer management');
  }

  return { points, matches, concerns, fit };
}

function scoreTitleMatch(
  title: string,
  jobProfile: IdealJobProfile
): { points: number; reason?: string; concern?: string } {
  const titleLower = title.toLowerCase();
  
  // Check for excellent matches
  for (const ideal of jobProfile.idealTitles) {
    if (ideal.fit === 'excellent') {
      const searchTerms = ideal.title.toLowerCase().split(/[\s-]+/);
      const matchCount = searchTerms.filter(term => titleLower.includes(term)).length;
      if (matchCount >= searchTerms.length * 0.6) {
        return { points: 25, reason: `Great title match: ${ideal.title}` };
      }
    }
  }
  
  // Check for good matches
  for (const ideal of jobProfile.idealTitles) {
    if (ideal.fit === 'good') {
      const searchTerms = ideal.title.toLowerCase().split(/[\s-]+/);
      const matchCount = searchTerms.filter(term => titleLower.includes(term)).length;
      if (matchCount >= searchTerms.length * 0.5) {
        return { points: 15, reason: `Good title match: ${ideal.title}` };
      }
    }
  }

  // Check for avoid titles
  for (const avoid of jobProfile.avoidTitles) {
    const searchTerms = avoid.toLowerCase().split(/[\s-]+/);
    const matchCount = searchTerms.filter(term => titleLower.includes(term)).length;
    if (matchCount >= searchTerms.length * 0.5) {
      return { points: -10, concern: `Title matches one to avoid: ${avoid}` };
    }
  }

  return { points: 5 };
}

function findCompanyMatch(companyName: string) {
  const normalized = companyName.toLowerCase().trim();
  
  return companyDatabase.find(c => {
    const dbName = c.name.toLowerCase();
    return dbName === normalized || 
           normalized.includes(dbName) || 
           dbName.includes(normalized);
  });
}

function analyzeJobDescription(
  text: string,
  jobProfile: IdealJobProfile,
  expectations?: Expectations
): { points: number; matches: string[]; redFlags: string[] } {
  const textLower = text.toLowerCase();
  let points = 0;
  const matches: string[] = [];
  const redFlags: string[] = [];

  // ========================================
  // Green Flags from Job Profile
  // ========================================
  const greenPatterns = [
    { pattern: /own\s*(end[- ]to[- ]end|full|entire)/i, reason: 'End-to-end ownership', points: 8 },
    { pattern: /autonom(y|ous)/i, reason: 'Values autonomy', points: 6 },
    { pattern: /remote[- ]first/i, reason: 'Remote-first culture', points: 5 },
    { pattern: /async/i, reason: 'Async communication', points: 4 },
    { pattern: /work[- ]life|sustainable/i, reason: 'Work-life balance', points: 5 },
    { pattern: /technical\s*lead/i, reason: 'Technical leadership', points: 5 },
    { pattern: /architecture|design\s*decisions/i, reason: 'Architecture decisions', points: 5 },
    { pattern: /mentor/i, reason: 'Mentorship opportunity', points: 4 },
    { pattern: /flexible\s*(hours|schedule|working)/i, reason: 'Flexible schedule', points: 5 },
    { pattern: /unlimited\s*pto|generous\s*vacation/i, reason: 'Good time-off policy', points: 4 },
  ];

  for (const { pattern, reason, points: p } of greenPatterns) {
    if (pattern.test(text)) {
      points += p;
      matches.push(reason);
    }
  }

  // ========================================
  // Red Flags from Job Profile
  // ========================================
  const redPatterns = [
    { pattern: /daily\s*stand[- ]?ups?/i, reason: 'Daily standups (may indicate micromanagement)', points: -5 },
    { pattern: /fast[- ]paced|hustle/i, reason: 'May indicate long hours', points: -4 },
    { pattern: /wear\s*many\s*hats/i, reason: 'Unclear role boundaries', points: -3 },
    { pattern: /24\/?7|on[- ]call\s*rotation/i, reason: 'On-call requirements', points: -5 },
    { pattern: /like\s*a?\s*family/i, reason: '"Like a family" culture (boundary concerns)', points: -4 },
    { pattern: /support\s*multiple\s*teams/i, reason: 'Context-switching likely', points: -3 },
    { pattern: /stakeholder\s*management/i, reason: 'Heavy coordination work', points: -3 },
    { pattern: /50\+?\s*hours|long\s*hours/i, reason: 'Mentions long hours', points: -6 },
    { pattern: /travel\s*(required|expected|frequently)/i, reason: 'Travel required', points: -3 },
  ];

  for (const { pattern, reason, points: p } of redPatterns) {
    if (pattern.test(text)) {
      points += p;
      redFlags.push(reason);
    }
  }

  // ========================================
  // Expectations-Based Analysis
  // ========================================
  if (expectations) {
    // Work-life balance emphasis if user has strict hours
    if (expectations.workLife.maxHours <= 40) {
      if (/work[- ]life|balance|sustainable|40\s*hours?/i.test(text)) {
        points += 5;
        matches.push('Emphasizes work-life balance');
      }
      if (/startup\s*hours|crunch|grind/i.test(text)) {
        points -= 5;
        redFlags.push('May require overtime');
      }
    }

    // Travel sensitivity
    if (expectations.workLife.travelTolerance === 'none') {
      if (/travel\s*(required|expected|up\s*to)/i.test(text)) {
        points -= 8;
        redFlags.push('Requires travel - you prefer none');
      }
    }

    // Timezone flexibility
    if (expectations.workLife.timezoneFlexibility === 'own_tz') {
      if (/global\s*team|multiple\s*time\s*zones|distributed/i.test(text)) {
        points -= 3;
        redFlags.push('Global team - may require odd hours');
      }
    }

    // Schedule flexibility importance
    if (expectations.workLife.flexibilityNeed === 'critical') {
      if (/flexible\s*(hours|schedule|working)|set\s*your\s*own/i.test(text)) {
        points += 5;
        matches.push('Flexible schedule (important to you)');
      }
      if (/core\s*hours|9[- ]to[- ]5|fixed\s*hours/i.test(text)) {
        points -= 3;
        redFlags.push('Fixed hours - you need flexibility');
      }
    }

    // Ownership level match
    if (expectations.roleLevel.ownershipLevel === 'full') {
      if (/own\s*(end[- ]to[- ]end|full|entire)|high\s*ownership/i.test(text)) {
        points += 5;
        matches.push('High ownership (matches preference)');
      }
    }
  }

  // ========================================
  // Custom Look-for Patterns
  // ========================================
  for (const lookFor of jobProfile.lookFor) {
    const cleaned = lookFor.replace(/['"]/g, '').toLowerCase();
    const words = cleaned.split(/\s+/).filter(w => w.length > 3);
    const matchCount = words.filter(w => textLower.includes(w)).length;
    if (matchCount >= words.length * 0.5) {
      points += 3;
    }
  }

  // ========================================
  // Custom Avoid Patterns
  // ========================================
  for (const avoid of jobProfile.avoid) {
    const cleaned = avoid.replace(/['"]/g, '').toLowerCase();
    const words = cleaned.split(/\s+/).filter(w => w.length > 3);
    const matchCount = words.filter(w => textLower.includes(w)).length;
    if (matchCount >= words.length * 0.5) {
      points -= 3;
    }
  }

  return { points, matches: matches.slice(0, 5), redFlags: redFlags.slice(0, 4) };
}

/**
 * Generate search queries based on profile
 */
export function generateSearchQueries(
  jobProfile: IdealJobProfile,
  companyProfile: IdealCompanyProfile
): string[] {
  const queries: string[] = [];

  // Add ideal titles as queries
  for (const title of jobProfile.idealTitles) {
    if (title.fit === 'excellent' || title.fit === 'good') {
      queries.push(title.title);
    }
  }

  // Add industry-specific queries
  for (const industry of companyProfile.industries.slice(0, 2)) {
    if (jobProfile.idealTitles[0]) {
      queries.push(`${jobProfile.idealTitles[0].title} ${industry}`);
    }
  }

  // Add remote-specific query if needed
  if (companyProfile.workMode.ideal === 'remote_first') {
    queries.push(`${jobProfile.idealTitles[0]?.title || 'Software Engineer'} remote`);
  }

  return Array.from(new Set(queries)).slice(0, 5);
}

