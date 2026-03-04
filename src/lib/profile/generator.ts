import { CareerProfile } from '../types';
import { computePsychologyProfile, getRawSignals } from '../psychology/scoring';
import { generateInsights, getTradeoffStyle } from '../psychology/insights';
import { runDiagnosis } from '../diagnosis/detector';

// ============================================
// Profile Generator
// ============================================

export function generateCareerProfile(
  answers: Record<string, string[]>
): CareerProfile {
  // Compute psychology profile
  const psychology = computePsychologyProfile(answers);
  const signals = getRawSignals(answers);
  
  // Run diagnosis
  const { diagnoses, notDiagnosed } = runDiagnosis(answers, signals, psychology);
  
  // Generate insights
  const insights = generateInsights(psychology, answers, signals);
  
  // Extract basic info
  const trigger = answers.q1_trigger || [];
  const priority = answers.q2_priority?.[0] || '';
  const tradeoffStyle = getTradeoffStyle(answers);
  const role = answers.q6_role?.[0] || '';
  const urgency = answers.q7_urgency?.[0] || '';
  
  // Determine completion
  const completedSections = ['core'];
  const completionPercentage = 25; // Core only = 25%, each deep dive adds 15%

  return {
    trigger,
    priority,
    tradeoffStyle,
    role,
    urgency,
    psychology,
    diagnoses,
    notDiagnosed,
    insights,
    completedSections,
    completionPercentage
  };
}

// ============================================
// Profile Summary Helpers
// ============================================

export function getPriorityLabel(priorityId: string): string {
  const labels: Record<string, string> = {
    control: 'More control over your time and work',
    pay_recognition: 'Better pay or recognition',
    good_team: 'A manager/team you respect',
    challenge: 'Work that challenges you',
    clear_path: 'A clear path forward',
    stability: 'Less chaos, more stability'
  };
  return labels[priorityId] || priorityId;
}

export function getTriggerLabel(triggerId: string): string {
  const labels: Record<string, string> = {
    burned_out: 'Burned out / exhausted',
    underpaid: 'Underpaid or undervalued',
    bad_manager: 'Bad manager or team dynamics',
    bored: 'Bored / unchallenged',
    no_growth: 'No growth path visible',
    instability: 'Company instability',
    life_change: 'Life circumstances changed',
    exploring: 'Just exploring options'
  };
  return labels[triggerId] || triggerId;
}

export function getRoleLabel(roleId: string): string {
  const labels: Record<string, string> = {
    engineering: 'Engineering / Technical',
    design: 'Design / Creative',
    product: 'Product / Project Management',
    marketing: 'Marketing / Sales',
    operations: 'Operations / Admin',
    data: 'Data / Analytics',
    leadership: 'Leadership / Executive',
    other: 'Other'
  };
  return labels[roleId] || roleId;
}

export function getUrgencyLabel(urgencyId: string): string {
  const labels: Record<string, string> = {
    active: 'Actively looking',
    open: 'Open to opportunities',
    exploring: 'Exploring / learning',
    stable: 'Stable but curious'
  };
  return labels[urgencyId] || urgencyId;
}

export function getCareerAnchorDescription(anchor: string): string {
  const descriptions: Record<string, string> = {
    autonomy: "You'll protect independence over money, title, even security",
    security: "You prioritize stability and predictability above all",
    technical_competence: "Being the expert in your craft is non-negotiable",
    management: "Leading and running things is where you thrive",
    challenge: "You live for solving difficult problems",
    lifestyle: "Work-life integration is your compass",
    service: "Making a difference drives everything",
    entrepreneurial: "Building something new is in your DNA"
  };
  return descriptions[anchor] || anchor;
}

export function getHollandDescription(code: string): string {
  const typeDescriptions: Record<string, string> = {
    R: 'Realistic (hands-on)',
    I: 'Investigative (analytical)',
    A: 'Artistic (creative)',
    S: 'Social (helping)',
    E: 'Enterprising (leading)',
    C: 'Conventional (organizing)'
  };
  
  const parts = code.split('').map(c => typeDescriptions[c] || c);
  return parts.join(' + ');
}

// ============================================
// User Quote Extraction for Diagnoses
// ============================================

const answerLabels: Record<string, Record<string, string>> = {
  q1_trigger: {
    burned_out: 'I\'m burned out and exhausted',
    underpaid: 'I feel underpaid or undervalued',
    bad_manager: 'I have a bad manager or team dynamics',
    bored: 'I\'m bored and unchallenged',
    no_growth: 'I see no growth path',
    instability: 'The company feels unstable',
    life_change: 'My life circumstances changed',
    exploring: 'I\'m just exploring options'
  },
  q3_frustrated: {
    meetings: 'Too many meetings and no time for actual work',
    micromanagement: 'Being micromanaged or second-guessed',
    no_feedback: 'Never knowing if I\'m doing well',
    chaos: 'Constantly changing priorities and chaos',
    bureaucracy: 'Bureaucracy slowing everything down',
    isolation: 'Working alone without support',
    politics: 'Office politics and favoritism',
    dead_end: 'Feeling stuck with no advancement'
  },
  q4_tradeoff: {
    less_money_more_time: 'I\'d take a pay cut to have more personal time',
    less_stability_more_growth: 'I\'d trade stability for faster growth',
    smaller_title_better_team: 'I\'d take a lower title to be on a better team',
    harder_work_more_meaning: 'I\'d work harder for more meaningful work'
  },
  q5_energy: {
    deep_work: 'I thrive when I have uninterrupted focus time',
    collaboration: 'I thrive when collaborating with others',
    learning: 'I thrive when learning new things',
    leading: 'I thrive when leading or influencing',
    autonomy: 'I thrive when I have full control over my approach',
    helping: 'I thrive when helping others succeed'
  },
  ctx_manager: {
    great_manager: 'I have a great manager, but other issues exist',
    absent_manager: 'My manager is absent or too busy for me',
    micromanager: 'My manager hovers and controls everything',
    toxic_manager: 'My manager is part of the problem',
    new_manager: 'I have a new manager and we\'re still figuring it out',
    no_manager: 'I have no direct manager right now'
  },
  ctx_tenure: {
    under_3mo: 'This has been going on for less than 3 months',
    '3_6mo': 'This has been going on for 3-6 months',
    '6mo_1yr': 'This has been going on for 6 months to a year',
    '1_2yr': 'This has been going on for 1-2 years',
    '2_plus': 'This has been going on for more than 2 years'
  }
};

export function getUserQuotesForDiagnosis(
  diagnosisCategory: string, 
  answers: Record<string, string[]>
): string[] {
  const quotes: string[] = [];
  
  // Map diagnosis categories to relevant answer keys
  const categoryToQuestions: Record<string, string[]> = {
    burnout: ['q1_trigger', 'q3_frustrated', 'ctx_tenure'],
    stagnation: ['q1_trigger', 'q3_frustrated', 'q5_energy'],
    toxic_environment: ['q1_trigger', 'q3_frustrated', 'ctx_manager'],
    undervalued: ['q1_trigger', 'q3_frustrated', 'q4_tradeoff'],
    misalignment: ['q4_tradeoff', 'q5_energy'],
    autonomy_crisis: ['q3_frustrated', 'q5_energy', 'ctx_manager']
  };
  
  const relevantQuestions = categoryToQuestions[diagnosisCategory] || ['q1_trigger'];
  
  for (const questionId of relevantQuestions) {
    const selectedOptions = answers[questionId] || [];
    const labelMap = answerLabels[questionId] || {};
    
    for (const optionId of selectedOptions) {
      const label = labelMap[optionId];
      if (label) {
        quotes.push(label);
      }
    }
  }
  
  // Return unique quotes, max 3
  return Array.from(new Set(quotes)).slice(0, 3);
}

