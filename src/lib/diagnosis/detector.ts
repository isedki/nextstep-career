import { Diagnosis, DiagnosisEvidence, PsychologyProfile } from '../types';
import { getQuestionById } from '../assessment/questions';

// ============================================
// Evidence Collector
// ============================================

function collectEvidence(
  answers: Record<string, string[]>,
  signals: Record<string, number>,
  checks: Array<{
    condition: boolean;
    signal: string;
    source: string;
    answerKey?: string;
  }>
): DiagnosisEvidence[] {
  const evidence: DiagnosisEvidence[] = [];

  for (const check of checks) {
    if (check.condition) {
      const question = getQuestionById(check.source);
      const answerIds = answers[check.source] || [];
      const answerTexts = answerIds
        .map(id => question?.options?.find(o => o.id === id)?.text)
        .filter(Boolean)
        .join(', ');

      evidence.push({
        signal: check.signal,
        source: check.source,
        userAnswer: check.answerKey || answerTexts || 'Selected'
      });
    }
  }

  return evidence;
}

// ============================================
// Micromanagement Detection
// ============================================

export function diagnoseMicromanagement(
  answers: Record<string, string[]>,
  signals: Record<string, number>,
  profile: PsychologyProfile
): Diagnosis | null {
  const evidence = collectEvidence(answers, signals, [
    {
      condition: answers.q2_priority?.includes('control'),
      signal: 'Primary need is control over work',
      source: 'q2_priority'
    },
    {
      condition: answers.q4_drains?.includes('rigid_processes'),
      signal: 'Rigid processes drain you',
      source: 'q4_drains'
    },
    {
      condition: profile.sdt.autonomy === 'unmet',
      signal: 'Autonomy need is severely unmet',
      source: 'SDT Analysis',
      answerKey: 'Autonomy: Unmet'
    },
    {
      condition: answers.q5_tradeoff?.includes('salary_for_flexibility'),
      signal: "You'd sacrifice pay for flexibility",
      source: 'q5_tradeoff'
    },
    {
      condition: (signals.micromanagement || 0) > 0.5,
      signal: 'Multiple signals indicate micromanagement',
      source: 'Combined signals',
      answerKey: 'Pattern detected'
    }
  ]);

  if (evidence.length >= 2) {
    return {
      issue: 'Micromanagement',
      issueId: 'micromanagement',
      category: 'autonomy_crisis',
      severity: 'moderate' as const,
      confidence: evidence.length >= 3 ? 'high' : 'medium',
      evidence,
      explanation: `Micromanagement directly blocks your core autonomy need. ` +
        `For someone with your profile (${profile.careerAnchor.primary === 'autonomy' ? 'Autonomy is your career anchor' : 'you value independence'}), ` +
        `this isn't just annoying—it's fundamentally incompatible with how you're wired. ` +
        `The frustration you feel is a psychologically predictable response.`,
      screeningQuestions: [
        "How much independence do individual contributors have here?",
        "How often do managers check in on work in progress?",
        "Can you give an example of a decision an IC made autonomously recently?",
        "What does the approval process look like for [relevant task]?"
      ]
    };
  }

  return null;
}

// ============================================
// No Growth Path Detection
// ============================================

export function diagnoseNoGrowth(
  answers: Record<string, string[]>,
  signals: Record<string, number>,
  profile: PsychologyProfile
): Diagnosis | null {
  const evidence = collectEvidence(answers, signals, [
    {
      condition: answers.q1_trigger?.includes('no_growth'),
      signal: 'No growth path selected as trigger',
      source: 'q1_trigger'
    },
    {
      condition: answers.q2_priority?.includes('clear_path'),
      signal: 'Clear path forward is your priority',
      source: 'q2_priority'
    },
    {
      condition: (signals.jdr_missing_growth || 0) > 0.5,
      signal: 'Growth opportunities marked as missing',
      source: 'Resource analysis',
      answerKey: 'Growth: Missing'
    },
    {
      condition: (signals.no_growth || 0) > 0.5,
      signal: 'Multiple growth-related concerns',
      source: 'Combined signals',
      answerKey: 'Pattern detected'
    }
  ]);

  if (evidence.length >= 2) {
    const hollandType = profile.holland.primary;
    const isInvestigative = hollandType === 'I';
    
    return {
      issue: 'No Growth Path',
      issueId: 'no_growth',
      category: 'stagnation',
      severity: 'moderate' as const,
      confidence: evidence.length >= 3 ? 'high' : 'medium',
      evidence,
      explanation: `You've hit a ceiling. The company either can't or won't invest in your development. ` +
        `${isInvestigative ? 'As an Investigative type, learning and mastery are core to your satisfaction. ' : ''}` +
        `This stagnation isn't just about promotion—it's about whether you're still developing your capabilities.`,
      screeningQuestions: [
        "What did the last promotion in this role look like? What was the timeline?",
        "What learning budget or dedicated development time is available?",
        "How do people typically grow in this role?",
        "Can you describe someone who was promoted from this position recently?"
      ]
    };
  }

  return null;
}

// ============================================
// Absent Direction Detection
// ============================================

export function diagnoseAbsentDirection(
  answers: Record<string, string[]>,
  signals: Record<string, number>,
  profile: PsychologyProfile
): Diagnosis | null {
  const evidence = collectEvidence(answers, signals, [
    {
      condition: answers.q4_drains?.includes('ambiguity'),
      signal: 'Ambiguity and chaos drain you',
      source: 'q4_drains'
    },
    {
      condition: (signals.jdr_demand_ambiguity || 0) > 0.5,
      signal: 'Role confusion is a high demand',
      source: 'JDR Analysis',
      answerKey: 'Role ambiguity: High'
    },
    {
      condition: (signals.absent_direction || 0) > 0.5,
      signal: 'Direction-related concerns detected',
      source: 'Combined signals',
      answerKey: 'Pattern detected'
    },
    {
      condition: profile.bigFive.openness === 'low' || profile.careerAnchor.primary === 'security',
      signal: 'Your profile needs structure and clarity',
      source: 'Profile analysis',
      answerKey: 'Values stability/structure'
    }
  ]);

  if (evidence.length >= 2) {
    return {
      issue: 'Lack of Direction',
      issueId: 'absent_direction',
      category: 'misalignment',
      severity: 'moderate' as const,
      confidence: evidence.length >= 3 ? 'high' : 'medium',
      evidence,
      explanation: `You need clarity on WHAT to do, even if you want freedom on HOW. ` +
        `Your manager may be absent on direction but possibly present on oversight—the worst combination. ` +
        `This isn't about wanting to be told what to do; it's about needing clear goals to work toward.`,
      screeningQuestions: [
        "How are goals and priorities communicated to the team?",
        "How much context does leadership share about company direction?",
        "What happens when priorities conflict?",
        "How do you know if you're succeeding in this role?"
      ]
    };
  }

  return null;
}

// ============================================
// Toxic Manager Detection
// ============================================

export function diagnoseToxicManager(
  answers: Record<string, string[]>,
  signals: Record<string, number>,
  profile: PsychologyProfile
): Diagnosis | null {
  const evidence = collectEvidence(answers, signals, [
    {
      condition: answers.q1_trigger?.includes('bad_manager'),
      signal: 'Bad manager selected as trigger',
      source: 'q1_trigger'
    },
    {
      condition: answers.q2_priority?.includes('good_team'),
      signal: 'Good manager/team is your priority',
      source: 'q2_priority'
    },
    {
      condition: (signals.jdr_missing_support || 0) > 0.6,
      signal: 'Manager support severely missing',
      source: 'Resource analysis',
      answerKey: 'Support: Missing'
    },
    {
      condition: profile.sdt.relatedness === 'unmet',
      signal: 'Relatedness need unmet',
      source: 'SDT Analysis',
      answerKey: 'Connection: Unmet'
    },
    {
      condition: (signals.toxic_manager || 0) > 0.5,
      signal: 'Toxic manager signals detected',
      source: 'Combined signals',
      answerKey: 'Pattern detected'
    }
  ]);

  if (evidence.length >= 2) {
    return {
      issue: 'Toxic Manager/Team',
      issueId: 'toxic_manager',
      category: 'toxic_environment',
      severity: 'critical' as const,
      confidence: evidence.length >= 3 ? 'high' : 'medium',
      evidence,
      explanation: `The people problem is real. Whether it's a toxic manager, dysfunctional team dynamics, or both, ` +
        `this is draining your energy and blocking your effectiveness. ` +
        `No amount of interesting work compensates for a bad manager—research consistently shows the manager is the #1 factor in job satisfaction.`,
      screeningQuestions: [
        "Can I speak with people who currently report to this manager?",
        "How would you describe your management style?",
        "How do you handle disagreements with your reports?",
        "What's the team's turnover been like in the past year?"
      ]
    };
  }

  return null;
}

// ============================================
// Burnout Detection
// ============================================

export function diagnoseBurnout(
  answers: Record<string, string[]>,
  signals: Record<string, number>,
  profile: PsychologyProfile
): Diagnosis | null {
  const evidence = collectEvidence(answers, signals, [
    {
      condition: answers.q1_trigger?.includes('burned_out'),
      signal: 'Burnout/exhaustion selected as trigger',
      source: 'q1_trigger'
    },
    {
      condition: profile.burnout.level === 'high' || profile.burnout.level === 'severe',
      signal: `Burnout level: ${profile.burnout.level}`,
      source: 'Burnout analysis',
      answerKey: `${profile.burnout.exhaustion}% exhaustion`
    },
    {
      condition: profile.jdr.imbalanceType !== 'balanced',
      signal: `JDR imbalance: ${profile.jdr.imbalanceType.replace('_', ' ')}`,
      source: 'JDR Analysis',
      answerKey: `${profile.jdr.imbalanceScore}% imbalance`
    },
    {
      condition: profile.jdr.demands.length >= 2,
      signal: `Multiple high demands: ${profile.jdr.demands.join(', ')}`,
      source: 'Demand analysis',
      answerKey: profile.jdr.demands.join(', ')
    }
  ]);

  if (evidence.length >= 2 || profile.burnout.level === 'severe') {
    const burnoutType = profile.jdr.imbalanceType === 'demand_overload' 
      ? 'demand overload (too much work)' 
      : 'resource depletion (missing support, autonomy, etc.)';

    return {
      issue: 'Burnout / Overwork',
      issueId: 'burnout',
      category: 'burnout',
      severity: profile.burnout.level === 'severe' ? 'critical' as const : 'moderate' as const,
      confidence: profile.burnout.level === 'severe' ? 'high' : evidence.length >= 3 ? 'high' : 'medium',
      evidence,
      explanation: `Your burnout is ${burnoutType} type. ` +
        `${profile.jdr.imbalanceType === 'demand_overload' 
          ? 'The workload exceeds sustainable levels.' 
          : `The bigger issue is missing resources—especially ${profile.jdr.missingResources.slice(0, 2).join(' and ')}.`} ` +
        `This isn't a willpower problem. Burnout is a physiological response to chronic stress. Recovery requires changing the conditions, not just "trying harder."`,
      screeningQuestions: [
        "What are typical working hours here? How often do people work evenings/weekends?",
        "How does the team handle periods of high workload?",
        "What does work-life balance actually look like for people in this role?",
        "How many people have left this team in the past year, and why?"
      ]
    };
  }

  return null;
}

// ============================================
// Undervalued Detection
// ============================================

export function diagnoseUndervalued(
  answers: Record<string, string[]>,
  signals: Record<string, number>,
  profile: PsychologyProfile
): Diagnosis | null {
  const evidence = collectEvidence(answers, signals, [
    {
      condition: answers.q1_trigger?.includes('underpaid'),
      signal: 'Underpaid/undervalued selected as trigger',
      source: 'q1_trigger'
    },
    {
      condition: answers.q2_priority?.includes('pay_recognition'),
      signal: 'Better pay/recognition is your priority',
      source: 'q2_priority'
    },
    {
      condition: (signals.jdr_missing_recognition || 0) > 0.5,
      signal: 'Recognition is missing',
      source: 'Resource analysis',
      answerKey: 'Recognition: Missing'
    },
    {
      condition: (signals.undervalued || 0) > 0.5,
      signal: 'Undervaluation signals detected',
      source: 'Combined signals',
      answerKey: 'Pattern detected'
    },
    {
      condition: profile.sdt.competence === 'unmet',
      signal: 'Competence need is unmet',
      source: 'SDT Analysis',
      answerKey: 'Competence: Unmet'
    }
  ]);

  if (evidence.length >= 2) {
    return {
      issue: 'Undervalued / Underpaid',
      issueId: 'undervalued',
      category: 'undervalued',
      severity: 'moderate' as const,
      confidence: evidence.length >= 3 ? 'high' : 'medium',
      evidence,
      explanation: `Feeling undervalued isn't just about money—it's about whether your contribution is recognized. ` +
        `This can manifest as below-market pay, lack of acknowledgment, or both. ` +
        `The psychological impact is real: when effort isn't matched by recognition, motivation erodes.`,
      screeningQuestions: [
        "How does compensation compare to market rate for this role?",
        "How does the company recognize exceptional work?",
        "What's the typical promotion/raise timeline?",
        "Can you share the compensation philosophy here?"
      ]
    };
  }

  return null;
}

// ============================================
// Wrong Fit Detection
// ============================================

export function diagnoseWrongFit(
  answers: Record<string, string[]>,
  signals: Record<string, number>,
  profile: PsychologyProfile
): Diagnosis | null {
  const evidence = collectEvidence(answers, signals, [
    {
      condition: answers.q1_trigger?.includes('bored'),
      signal: 'Bored/unchallenged selected as trigger',
      source: 'q1_trigger'
    },
    {
      condition: answers.q3_flow?.includes('been_a_while'),
      signal: "Can't remember last time in flow",
      source: 'q3_flow'
    },
    {
      condition: (signals.wrong_fit || 0) > 0.4,
      signal: 'Work misalignment detected',
      source: 'Combined signals',
      answerKey: 'Pattern detected'
    },
    {
      condition: (signals.flow_understimulated || 0) > 0.5,
      signal: 'Understimulated at work',
      source: 'Flow analysis',
      answerKey: 'Challenge too low'
    }
  ]);

  if (evidence.length >= 2) {
    return {
      issue: 'Wrong Fit / Boredom',
      issueId: 'wrong_fit',
      category: 'misalignment',
      severity: 'moderate' as const,
      confidence: evidence.length >= 3 ? 'high' : 'medium',
      evidence,
      explanation: `The work itself doesn't match who you are. ` +
        `As a ${profile.holland.code} type, you need ${getHollandNeeds(profile.holland.primary)}. ` +
        `Boredom isn't laziness—it's a signal that your skills and interests aren't being engaged. ` +
        `This mismatch is draining even when you're "doing well" by external measures.`,
      screeningQuestions: [
        "What does a typical week look like in this role?",
        "What's the most challenging problem someone in this role has solved recently?",
        "How much variety is there in the day-to-day work?",
        "What opportunities are there to work on different types of projects?"
      ]
    };
  }

  return null;
}

// Helper function
function getHollandNeeds(type: string): string {
  const needs: Record<string, string> = {
    R: 'hands-on work with tangible outcomes',
    I: 'complex problems that require deep analysis',
    A: 'creative freedom and original thinking',
    S: 'meaningful connection and helping others',
    E: 'leadership opportunities and influence',
    C: 'structure, organization, and clear systems'
  };
  return needs[type] || 'engaging work';
}

// ============================================
// Chaos/Instability Detection
// ============================================

export function diagnoseChaos(
  answers: Record<string, string[]>,
  signals: Record<string, number>,
  profile: PsychologyProfile
): Diagnosis | null {
  const evidence = collectEvidence(answers, signals, [
    {
      condition: answers.q1_trigger?.includes('instability'),
      signal: 'Company instability selected as trigger',
      source: 'q1_trigger'
    },
    {
      condition: answers.q2_priority?.includes('stability'),
      signal: 'Stability is your priority',
      source: 'q2_priority'
    },
    {
      condition: answers.q4_drains?.includes('ambiguity'),
      signal: 'Ambiguity and chaos drain you',
      source: 'q4_drains'
    },
    {
      condition: profile.careerAnchor.primary === 'security',
      signal: 'Security is your career anchor',
      source: 'Anchor analysis',
      answerKey: 'Career Anchor: Security'
    },
    {
      condition: (signals.chaos_instability || 0) > 0.5,
      signal: 'Instability signals detected',
      source: 'Combined signals',
      answerKey: 'Pattern detected'
    }
  ]);

  if (evidence.length >= 2) {
    return {
      issue: 'Chaos / Instability',
      issueId: 'chaos_instability',
      category: 'toxic_environment',
      severity: 'moderate' as const,
      confidence: evidence.length >= 3 ? 'high' : 'medium',
      evidence,
      explanation: `The constant change and uncertainty is taking a toll. ` +
        `${profile.careerAnchor.primary === 'security' 
          ? "As someone who values security, this instability directly conflicts with your core need. " 
          : "While some thrive in chaos, your profile suggests you need more predictability. "}` +
        `This isn't about being inflexible—it's about needing a stable foundation to do your best work.`,
      screeningQuestions: [
        "How stable has the team structure been over the past year?",
        "What's the company's financial situation?",
        "How often do priorities or direction change significantly?",
        "How many reorgs has this team been through recently?"
      ]
    };
  }

  return null;
}

// ============================================
// Run All Diagnoses
// ============================================

export function runDiagnosis(
  answers: Record<string, string[]>,
  signals: Record<string, number>,
  profile: PsychologyProfile
): { diagnoses: Diagnosis[]; notDiagnosed: string[] } {
  const allDiagnostics: Array<{
    name: string;
    fn: typeof diagnoseMicromanagement;
  }> = [
    { name: 'Micromanagement', fn: diagnoseMicromanagement },
    { name: 'No Growth Path', fn: diagnoseNoGrowth },
    { name: 'Lack of Direction', fn: diagnoseAbsentDirection },
    { name: 'Toxic Manager/Team', fn: diagnoseToxicManager },
    { name: 'Burnout / Overwork', fn: diagnoseBurnout },
    { name: 'Undervalued / Underpaid', fn: diagnoseUndervalued },
    { name: 'Wrong Fit / Boredom', fn: diagnoseWrongFit },
    { name: 'Chaos / Instability', fn: diagnoseChaos }
  ];

  const diagnoses: Diagnosis[] = [];
  const notDiagnosed: string[] = [];

  for (const diagnostic of allDiagnostics) {
    const result = diagnostic.fn(answers, signals, profile);
    if (result) {
      diagnoses.push(result);
    } else {
      notDiagnosed.push(diagnostic.name);
    }
  }

  // Sort by confidence
  diagnoses.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.confidence] - order[b.confidence];
  });

  return { diagnoses, notDiagnosed };
}

