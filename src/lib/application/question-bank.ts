import { CareerProfile, CareerAnchor, Diagnosis } from '../types';
import { Job } from '../jobs/api';
import { Expectations } from '../expectations/store';
import { 
  WhatMattersGuidance, 
  KeyPoint, 
  InterviewQuestion, 
  Flag 
} from '../resume/types';

// ============================================
// Rule-Based What Matters Generation
// ============================================

export function generateFallbackWhatMatters(
  job: Job,
  profile: CareerProfile,
  expectations?: Expectations
): WhatMattersGuidance {
  const keyPoints = generateKeyPoints(profile, job);
  const questionsToAsk = generateQuestions(profile, expectations);
  const redFlags = generateRedFlags(profile, job);
  const greenFlags = generateGreenFlags(profile, job);
  const salaryTips = generateSalaryTips(expectations, job);

  return {
    keyPoints,
    questionsToAsk,
    redFlags,
    greenFlags,
    salaryTips,
    source: 'rule_based'
  };
}

// ============================================
// Key Points Generation
// ============================================

function generateKeyPoints(profile: CareerProfile, job: Job): KeyPoint[] {
  const points: KeyPoint[] = [];
  const anchor = profile.psychology.careerAnchor.primary;
  const holland = profile.psychology.holland.primary;

  // Anchor-based key points
  const anchorPoints: Record<CareerAnchor, KeyPoint> = {
    technical_competence: {
      point: 'Your deep technical expertise and commitment to quality',
      reason: 'Shows you can handle complex technical challenges',
      priority: 'must_mention'
    },
    management: {
      point: 'Your experience leading teams and driving results',
      reason: 'Demonstrates leadership capability',
      priority: 'must_mention'
    },
    autonomy: {
      point: 'Your ability to work independently and own outcomes',
      reason: 'Shows you can be trusted with responsibility',
      priority: 'must_mention'
    },
    security: {
      point: 'Your track record of consistent, reliable delivery',
      reason: 'Demonstrates you are a stable, long-term investment',
      priority: 'good_to_mention'
    },
    entrepreneurial: {
      point: 'Your initiative and experience building from scratch',
      reason: 'Shows you can create value and drive innovation',
      priority: 'must_mention'
    },
    service: {
      point: 'Your focus on helping others and customer impact',
      reason: 'Shows you understand the bigger picture',
      priority: 'good_to_mention'
    },
    challenge: {
      point: 'Your ability to tackle complex, difficult problems',
      reason: 'Shows you thrive under pressure',
      priority: 'must_mention'
    },
    lifestyle: {
      point: 'Your efficient, focused approach to delivering results',
      reason: 'Shows you prioritize quality over busyness',
      priority: 'good_to_mention'
    }
  };

  points.push(anchorPoints[anchor]);

  // Holland-based points
  if (holland === 'I') {
    points.push({
      point: 'Your analytical thinking and research-driven approach',
      reason: 'Shows methodical problem-solving ability',
      priority: 'good_to_mention'
    });
  } else if (holland === 'E') {
    points.push({
      point: 'Your ability to influence stakeholders and drive consensus',
      reason: 'Shows interpersonal effectiveness',
      priority: 'good_to_mention'
    });
  } else if (holland === 'S') {
    points.push({
      point: 'Your collaborative nature and team focus',
      reason: 'Shows you elevate those around you',
      priority: 'good_to_mention'
    });
  }

  // Job-specific points
  if (job.remote) {
    points.push({
      point: 'Your experience with remote/async collaboration',
      reason: 'Relevant for this remote position',
      priority: 'if_time'
    });
  }

  return points.slice(0, 4);
}

// ============================================
// Questions Generation Based on Diagnoses
// ============================================

function generateQuestions(
  profile: CareerProfile,
  expectations?: Expectations
): InterviewQuestion[] {
  const questions: InterviewQuestion[] = [];
  const diagnoses = profile.diagnoses;
  const sdt = profile.psychology.sdt;

  // Diagnosis-based questions
  const diagnosisQuestions: Record<string, InterviewQuestion> = {
    micromanagement: {
      question: 'How much autonomy do team members have in how they approach their work?',
      why: 'To assess if micromanagement patterns exist',
      category: 'autonomy'
    },
    'absent_direction': {
      question: 'How does the team set priorities and decide what to work on?',
      why: 'To understand if there is clear direction',
      category: 'management'
    },
    'toxic_manager': {
      question: 'Can you describe the management style here? How does feedback typically work?',
      why: 'To assess manager dynamics',
      category: 'management'
    },
    'no_growth': {
      question: 'What does career progression look like for this role?',
      why: 'To ensure there is a growth path',
      category: 'growth'
    },
    burnout: {
      question: 'What does a typical week look like? How does the team handle crunch periods?',
      why: 'To assess workload sustainability',
      category: 'workload'
    },
    undervalued: {
      question: 'How does the team celebrate wins and recognize contributions?',
      why: 'To understand recognition culture',
      category: 'culture'
    },
    'wrong_fit': {
      question: 'What type of person thrives in this role? What type struggles?',
      why: 'To verify role alignment',
      category: 'culture'
    },
    'chaos_instability': {
      question: 'How stable are priorities here? How often do plans change significantly?',
      why: 'To assess organizational stability',
      category: 'culture'
    }
  };

  for (const diagnosis of diagnoses) {
    const q = diagnosisQuestions[diagnosis.issueId];
    if (q) {
      questions.push(q);
    }
  }

  // SDT-based questions
  if (sdt.autonomy === 'unmet') {
    questions.push({
      question: 'How much say do engineers have in technical decisions?',
      why: 'Your autonomy needs are currently unmet',
      category: 'autonomy'
    });
  }

  if (sdt.competence === 'unmet') {
    questions.push({
      question: 'What learning and development opportunities exist?',
      why: 'You need opportunities to grow your skills',
      category: 'growth'
    });
  }

  if (sdt.relatedness === 'unmet') {
    questions.push({
      question: 'How would you describe the team culture? How do people collaborate?',
      why: 'Connection with colleagues is important to you',
      category: 'culture'
    });
  }

  // Expectations-based questions
  if (expectations) {
    if (expectations.workLife.remotePreference === 'required') {
      questions.push({
        question: 'How does the team handle remote collaboration? Any expectations about being online?',
        why: 'Remote work is non-negotiable for you',
        category: 'culture'
      });
    }

    if (expectations.workLife.maxHours <= 40) {
      questions.push({
        question: 'What are the expectations around working hours and availability?',
        why: 'Work-life balance is important to you',
        category: 'workload'
      });
    }

    if (expectations.roleLevel.managementInterest === 'ic_only') {
      questions.push({
        question: 'Is there a strong IC track here, or is management the main path up?',
        why: 'You want to stay on the IC path',
        category: 'growth'
      });
    }
  }

  // Always ask about the role
  questions.push({
    question: 'What would success look like in the first 90 days?',
    why: 'Helps set clear expectations',
    category: 'technical'
  });

  return questions.slice(0, 6);
}

// ============================================
// Red Flags Generation
// ============================================

function generateRedFlags(profile: CareerProfile, job: Job): Flag[] {
  const flags: Flag[] = [];
  const diagnoses = profile.diagnoses;
  const anchor = profile.psychology.careerAnchor.primary;

  // Diagnosis-specific red flags
  if (diagnoses.some(d => d.issueId === 'micromanagement')) {
    flags.push({
      signal: 'Mentions "close supervision" or "daily check-ins"',
      explanation: 'May indicate micromanagement patterns you experienced before',
      severity: 'critical'
    });
  }

  if (diagnoses.some(d => d.issueId === 'burnout')) {
    flags.push({
      signal: 'Terms like "fast-paced", "hustle", or "wear many hats"',
      explanation: 'May indicate workload issues similar to your burnout triggers',
      severity: 'critical'
    });
  }

  if (diagnoses.some(d => d.issueId === 'no_growth')) {
    flags.push({
      signal: 'Vague answers about career progression',
      explanation: 'You left for growth; make sure it exists here',
      severity: 'warning'
    });
  }

  // Anchor-specific red flags
  if (anchor === 'autonomy') {
    flags.push({
      signal: 'Heavy process, lots of approvals needed',
      explanation: 'As someone who values autonomy, this would frustrate you',
      severity: 'warning'
    });
  }

  if (anchor === 'security') {
    flags.push({
      signal: 'Startup instability signs, recent layoffs',
      explanation: 'Security is important to you; verify stability',
      severity: 'warning'
    });
  }

  if (anchor === 'lifestyle') {
    flags.push({
      signal: '"We work hard, play hard" or "like a family"',
      explanation: 'Often code for poor boundaries',
      severity: 'warning'
    });
  }

  // Job description red flags
  const descLower = job.description.toLowerCase();
  if (/24\/7|on-call|always available/i.test(descLower)) {
    flags.push({
      signal: 'On-call or 24/7 availability mentioned',
      explanation: 'May impact work-life balance significantly',
      severity: 'warning'
    });
  }

  return flags.slice(0, 4);
}

// ============================================
// Green Flags Generation
// ============================================

function generateGreenFlags(profile: CareerProfile, job: Job): Flag[] {
  const flags: Flag[] = [];
  const anchor = profile.psychology.careerAnchor.primary;
  const sdt = profile.psychology.sdt;

  // Anchor-specific green flags
  const anchorGreenFlags: Record<CareerAnchor, Flag> = {
    technical_competence: {
      signal: 'Emphasis on technical excellence and deep work',
      explanation: 'Aligns with your value for technical mastery',
      severity: 'note'
    },
    management: {
      signal: 'Clear leadership development path',
      explanation: 'Supports your management aspirations',
      severity: 'note'
    },
    autonomy: {
      signal: 'Terms like "ownership", "self-directed", "trust"',
      explanation: 'Indicates respect for autonomy',
      severity: 'note'
    },
    security: {
      signal: 'Profitable company, long employee tenure',
      explanation: 'Indicates stability you value',
      severity: 'note'
    },
    entrepreneurial: {
      signal: 'Greenfield projects, "build from scratch"',
      explanation: 'Opportunity to create something new',
      severity: 'note'
    },
    service: {
      signal: 'Clear customer impact, mission-driven language',
      explanation: 'Work that creates meaningful impact',
      severity: 'note'
    },
    challenge: {
      signal: 'Complex problems, technical depth',
      explanation: 'Challenging work you thrive on',
      severity: 'note'
    },
    lifestyle: {
      signal: '"Work-life balance", "sustainable pace", "flexible"',
      explanation: 'Values aligned with yours',
      severity: 'note'
    }
  };

  flags.push(anchorGreenFlags[anchor]);

  // SDT-based green flags
  if (sdt.autonomy !== 'met') {
    flags.push({
      signal: 'High autonomy, minimal process',
      explanation: 'Addresses your unmet autonomy needs',
      severity: 'note'
    });
  }

  if (sdt.competence !== 'met') {
    flags.push({
      signal: 'Strong learning culture, conference budgets',
      explanation: 'Opportunities to build competence',
      severity: 'note'
    });
  }

  if (sdt.relatedness !== 'met') {
    flags.push({
      signal: 'Collaborative culture, team bonding',
      explanation: 'Supports your need for connection',
      severity: 'note'
    });
  }

  // Job-specific green flags
  if (job.remote) {
    flags.push({
      signal: 'Remote-first with async communication',
      explanation: 'Modern remote practices',
      severity: 'note'
    });
  }

  return flags.slice(0, 4);
}

// ============================================
// Salary Tips Generation
// ============================================

function generateSalaryTips(
  expectations?: Expectations,
  job?: Job
): string[] {
  const tips: string[] = [];

  // General tips
  tips.push('Research the market rate for this role in this location on levels.fyi or Glassdoor');
  tips.push('Wait for them to name a number first if possible');

  if (expectations?.salary.target) {
    tips.push(`Your target is ${expectations.salary.currency} ${expectations.salary.target?.toLocaleString()} - aim slightly higher in negotiations`);
  }

  if (expectations?.salary.flexibility === 'negotiable') {
    tips.push('Consider total compensation: equity, bonus, benefits, and flexibility may offset base');
  }

  if (job?.salary) {
    tips.push(`Listed range: ${job.salary.currency} ${job.salary.min.toLocaleString()}-${job.salary.max.toLocaleString()} - you can often negotiate above midpoint for the right experience`);
  }

  tips.push("If pressed, give a range and say 'depending on total compensation'");

  return tips.slice(0, 4);
}
