import {
  SDTProfile,
  JDRProfile,
  BurnoutProfile,
  CareerAnchorProfile,
  CareerAnchor,
  HollandProfile,
  HollandType,
  BigFiveProfile,
  FlowProfile,
  PsychologyProfile
} from '../types';
import { getQuestionById } from '../assessment/questions';

// ============================================
// Signal Accumulator
// ============================================

export function accumulateSignals(
  answers: Record<string, string[]>
): Record<string, number> {
  const signals: Record<string, number> = {};

  for (const [questionId, selectedOptions] of Object.entries(answers)) {
    const question = getQuestionById(questionId);
    if (!question || !question.options) continue;

    for (const optionId of selectedOptions) {
      const option = question.options.find(o => o.id === optionId);
      if (!option) continue;

      for (const [signal, value] of Object.entries(option.signals)) {
        signals[signal] = (signals[signal] || 0) + value;
      }
    }
  }

  return signals;
}

// ============================================
// Self-Determination Theory Scoring
// ============================================

export function scoreSDT(signals: Record<string, number>): SDTProfile {
  const autonomy = signals.sdt_autonomy || 0;
  const competence = signals.sdt_competence || 0;
  const relatedness = signals.sdt_relatedness || 0;

  const toLevel = (score: number): 'unmet' | 'partial' | 'met' => {
    if (score < -0.3) return 'unmet';
    if (score < 0.3) return 'partial';
    return 'met';
  };

  const levels = {
    autonomy: toLevel(autonomy),
    competence: toLevel(competence),
    relatedness: toLevel(relatedness)
  };

  // Find primary unmet need
  let primaryUnmetNeed: 'autonomy' | 'competence' | 'relatedness' | null = null;
  const scores = { autonomy, competence, relatedness };
  const minScore = Math.min(autonomy, competence, relatedness);
  
  if (minScore < -0.3) {
    const entry = Object.entries(scores).find(([, v]) => v === minScore);
    if (entry) {
      primaryUnmetNeed = entry[0] as 'autonomy' | 'competence' | 'relatedness';
    }
  }

  return {
    ...levels,
    primaryUnmetNeed
  };
}

// ============================================
// Job Demands-Resources Scoring
// ============================================

export function scoreJDR(signals: Record<string, number>): JDRProfile {
  const demandSignals = [
    'jdr_demand_workload',
    'jdr_demand_time',
    'jdr_demand_emotional',
    'jdr_demand_cognitive',
    'jdr_demand_ambiguity',
    'jdr_demand_work_life'
  ];

  const resourceSignals = [
    'jdr_missing_autonomy',
    'jdr_missing_support',
    'jdr_missing_feedback',
    'jdr_missing_growth',
    'jdr_missing_recognition',
    'jdr_missing_purpose'
  ];

  const demands: string[] = [];
  const missingResources: string[] = [];
  let demandScore = 0;
  let resourceScore = 0;

  for (const signal of demandSignals) {
    if ((signals[signal] || 0) > 0.5) {
      demands.push(signal.replace('jdr_demand_', ''));
      demandScore += signals[signal];
    }
  }

  for (const signal of resourceSignals) {
    if ((signals[signal] || 0) > 0.5) {
      missingResources.push(signal.replace('jdr_missing_', ''));
      resourceScore += signals[signal];
    }
  }

  const imbalanceScore = Math.min(100, Math.round((demandScore + resourceScore) / 6 * 100));
  
  let imbalanceType: JDRProfile['imbalanceType'] = 'balanced';
  if (demandScore > resourceScore && demandScore > 1) {
    imbalanceType = 'demand_overload';
  } else if (resourceScore > demandScore && resourceScore > 1) {
    imbalanceType = 'resource_depletion';
  } else if (demandScore > 1 && resourceScore > 1) {
    imbalanceType = resourceScore > demandScore ? 'resource_depletion' : 'demand_overload';
  }

  return {
    demands,
    missingResources,
    imbalanceScore,
    imbalanceType
  };
}

// ============================================
// Maslach Burnout Scoring
// ============================================

export function scoreBurnout(signals: Record<string, number>): BurnoutProfile {
  const exhaustion = Math.min(100, Math.max(0, (signals.burnout_exhaustion || 0) * 100));
  const cynicism = Math.min(100, Math.max(0, (signals.burnout_cynicism || 0) * 100));
  const inefficacy = Math.min(100, Math.max(0, (signals.burnout_inefficacy || 0) * 100));

  // Also factor in indirect signals
  const indirectExhaustion = (signals.jdr_demand_workload || 0) * 20 + 
                             (signals.jdr_demand_time || 0) * 20;
  const indirectCynicism = (signals.wrong_fit || 0) * 30 + 
                           (signals.jdr_missing_purpose || 0) * 20;

  const finalExhaustion = Math.min(100, exhaustion + indirectExhaustion);
  const finalCynicism = Math.min(100, cynicism + indirectCynicism);

  const average = (finalExhaustion + finalCynicism + inefficacy) / 3;
  
  let level: BurnoutProfile['level'] = 'low';
  if (average > 70) level = 'severe';
  else if (average > 50) level = 'high';
  else if (average > 30) level = 'moderate';

  // Find primary dimension
  let primaryDimension: BurnoutProfile['primaryDimension'] = null;
  const max = Math.max(finalExhaustion, finalCynicism, inefficacy);
  if (max > 40) {
    if (finalExhaustion === max) primaryDimension = 'exhaustion';
    else if (finalCynicism === max) primaryDimension = 'cynicism';
    else primaryDimension = 'inefficacy';
  }

  return {
    exhaustion: Math.round(finalExhaustion),
    cynicism: Math.round(finalCynicism),
    inefficacy: Math.round(inefficacy),
    level,
    primaryDimension
  };
}

// ============================================
// Career Anchors Scoring
// ============================================

export function scoreCareerAnchors(signals: Record<string, number>): CareerAnchorProfile {
  const anchors: CareerAnchor[] = [
    'technical_competence',
    'management',
    'autonomy',
    'security',
    'entrepreneurial',
    'service',
    'challenge',
    'lifestyle'
  ];

  const scores: Record<CareerAnchor, number> = {} as Record<CareerAnchor, number>;
  
  for (const anchor of anchors) {
    const signalKey = `anchor_${anchor === 'technical_competence' ? 'technical' : anchor}`;
    scores[anchor] = signals[signalKey] || 0;
  }

  // Also map from other signals
  if (signals.tradeoff_time_over_money) scores.lifestyle += signals.tradeoff_time_over_money * 0.5;
  if (signals.tradeoff_peace_over_status) scores.lifestyle += signals.tradeoff_peace_over_status * 0.3;
  if (signals.tradeoff_stability_over_growth) scores.security += signals.tradeoff_stability_over_growth * 0.5;
  if (signals.tradeoff_growth_over_stability) scores.challenge += signals.tradeoff_growth_over_stability * 0.4;

  // Sort to find primary and secondary
  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
  
  return {
    primary: sorted[0][0] as CareerAnchor,
    secondary: sorted[1][1] > 0.3 ? sorted[1][0] as CareerAnchor : null,
    scores
  };
}

// ============================================
// Holland RIASEC Scoring
// ============================================

export function scoreHolland(signals: Record<string, number>): HollandProfile {
  const types: HollandType[] = ['R', 'I', 'A', 'S', 'E', 'C'];
  const scores: Record<HollandType, number> = {
    R: signals.holland_R || 0,
    I: signals.holland_I || 0,
    A: signals.holland_A || 0,
    S: signals.holland_S || 0,
    E: signals.holland_E || 0,
    C: signals.holland_C || 0
  };

  // Map flow triggers to Holland
  if (signals.flow_analytical) scores.I += signals.flow_analytical * 0.5;
  if (signals.flow_creative) scores.A += signals.flow_creative * 0.5;
  if (signals.flow_systematic) scores.C += signals.flow_systematic * 0.5;
  if (signals.flow_hands_on) scores.R += signals.flow_hands_on * 0.5;

  // Sort to get top 3
  const sorted = types.sort((a, b) => scores[b] - scores[a]);

  return {
    primary: sorted[0],
    secondary: sorted[1],
    tertiary: sorted[2],
    code: `${sorted[0]}${sorted[1]}${sorted[2]}`,
    scores
  };
}

// ============================================
// Big Five Scoring
// ============================================

export function scoreBigFive(signals: Record<string, number>): BigFiveProfile {
  const toLevel = (score: number): 'low' | 'moderate' | 'high' => {
    if (score < -0.3) return 'low';
    if (score > 0.3) return 'high';
    return 'moderate';
  };

  return {
    extraversion: toLevel(signals.bigfive_extraversion || 0),
    openness: toLevel(signals.bigfive_openness || 0),
    conscientiousness: toLevel(signals.bigfive_conscientiousness || 0),
    agreeableness: toLevel(signals.bigfive_agreeableness || 0),
    neuroticism: toLevel(signals.bigfive_neuroticism || 0)
  };
}

// ============================================
// Flow Profile Scoring
// ============================================

export function scoreFlow(signals: Record<string, number>): FlowProfile {
  const triggers: string[] = [];
  const drains: string[] = [];

  // Map flow triggers
  const flowTriggerSignals = [
    { signal: 'flow_analytical', label: 'Solving complex problems' },
    { signal: 'flow_creative', label: 'Creative work' },
    { signal: 'flow_systematic', label: 'Building systems' },
    { signal: 'flow_hands_on', label: 'Hands-on building' }
  ];

  for (const { signal, label } of flowTriggerSignals) {
    if ((signals[signal] || 0) > 0.5) {
      triggers.push(label);
    }
  }

  // Map drains
  const drainSignals = [
    { signal: 'flow_drain_social', label: 'Meetings and small talk' },
    { signal: 'flow_drain_monotony', label: 'Repetitive tasks' }
  ];

  for (const { signal, label } of drainSignals) {
    if ((signals[signal] || 0) > 0.5) {
      drains.push(label);
    }
  }

  // Add drains from negative extraversion
  if ((signals.bigfive_extraversion || 0) < -0.3) {
    if (!drains.includes('Meetings and small talk')) {
      drains.push('Social interactions');
    }
  }

  // Determine optimal challenge level
  let optimalChallenge: FlowProfile['optimalChallenge'] = 'medium';
  if (signals.anchor_challenge > 0.5 || signals.holland_I > 0.5) {
    optimalChallenge = 'high';
  } else if (signals.anchor_security > 0.5) {
    optimalChallenge = 'low';
  }

  return {
    triggers,
    drains,
    optimalChallenge
  };
}

// ============================================
// Complete Psychology Profile
// ============================================

export function computePsychologyProfile(
  answers: Record<string, string[]>
): PsychologyProfile {
  const signals = accumulateSignals(answers);

  return {
    sdt: scoreSDT(signals),
    jdr: scoreJDR(signals),
    burnout: scoreBurnout(signals),
    careerAnchor: scoreCareerAnchors(signals),
    holland: scoreHolland(signals),
    bigFive: scoreBigFive(signals),
    flow: scoreFlow(signals)
  };
}

// ============================================
// Get Raw Signals (for diagnosis)
// ============================================

export function getRawSignals(answers: Record<string, string[]>): Record<string, number> {
  return accumulateSignals(answers);
}

