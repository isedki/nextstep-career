import { PsychologyProfile, Insight, HollandTypeNames } from '../types';

// ============================================
// Insight Templates
// ============================================

const insightTemplates = {
  // Autonomy-related insights
  autonomy_micromanagement: {
    type: 'why_feel' as const,
    title: "Why micromanagement feels unbearable",
    template: (profile: PsychologyProfile) => 
      `Autonomy is your ${profile.careerAnchor.primary === 'autonomy' ? 'primary career anchor' : 'core need'}. ` +
      `Micromanagement directly attacks this fundamental requirement. ` +
      `For someone with your profile, it's not just annoying—it's psychologically incompatible. ` +
      `The frustration you feel is a predictable response, not a personal failing.`,
    frameworkBasis: ['Self-Determination Theory', 'Career Anchors']
  },

  // Meeting-related insights
  meetings_drain: {
    type: 'why_hate' as const,
    title: "Why meetings feel draining",
    template: (profile: PsychologyProfile) => {
      const isIntrovert = profile.bigFive.extraversion === 'low';
      const isInvestigative = profile.holland.primary === 'I';
      
      let explanation = `Your ${HollandTypeNames[profile.holland.primary]} nature craves depth and focus. `;
      
      if (isInvestigative) {
        explanation += `Meetings are often surface-level, lacking the analytical depth you need. `;
      }
      if (isIntrovert) {
        explanation += `Combined with your preference for focused work over social interaction, meetings cost energy without providing satisfaction. `;
      }
      explanation += `This isn't antisocial—it's how you're wired.`;
      
      return explanation;
    },
    frameworkBasis: ['Holland RIASEC', 'Big Five']
  },

  // Flow-related insights
  flow_blocked: {
    type: 'why_feel' as const,
    title: "Why you can't remember the last time you felt engaged",
    template: (profile: PsychologyProfile) => 
      `Flow happens when your skills meet an appropriate challenge. ` +
      `You're likely either understimulated (work is too easy/routine) or overwhelmed (too much chaos, not enough resources). ` +
      `Your ${profile.burnout.level !== 'low' ? 'burnout signals suggest the latter' : 'profile suggests a skill-challenge mismatch'}. ` +
      `This blockage isn't about motivation—it's about alignment.`,
    frameworkBasis: ['Flow Theory', 'Job Demands-Resources']
  },

  // Burnout insights
  burnout_resource_depletion: {
    type: 'why_feel' as const,
    title: "Why you're exhausted even when workload seems manageable",
    template: (profile: PsychologyProfile) => {
      const missing = profile.jdr.missingResources.join(', ') || 'key resources';
      return `Your burnout is resource-depletion type: ${missing} are missing. ` +
        `This is different from demand overload. You can handle the work, but without ` +
        `${profile.sdt.primaryUnmetNeed || 'autonomy and support'}, even normal tasks become draining. ` +
        `More vacation won't fix this—you need the missing resources restored.`;
    },
    frameworkBasis: ['Job Demands-Resources', 'Self-Determination Theory']
  },

  // Career anchor conflicts
  anchor_conflict: {
    type: 'why_feel' as const,
    title: "Why 'good' opportunities still feel wrong",
    template: (profile: PsychologyProfile) => {
      const anchor = profile.careerAnchor.primary;
      const anchorDescriptions: Record<string, string> = {
        autonomy: "independence and control over your work",
        security: "stability and predictability",
        technical_competence: "deep expertise in your craft",
        management: "leading and running things",
        challenge: "solving difficult problems",
        lifestyle: "work-life integration",
        service: "helping others and making a difference",
        entrepreneurial: "building something new"
      };
      
      return `Your career anchor is ${anchor.replace('_', ' ')}—you prioritize ${anchorDescriptions[anchor]} above all else. ` +
        `When a job conflicts with this anchor, no amount of money or prestige will make it feel right. ` +
        `This isn't being picky—it's knowing what you fundamentally can't sacrifice.`;
    },
    frameworkBasis: ['Career Anchors (Schein)']
  },

  // Holland type insights
  holland_mismatch: {
    type: 'why_hate' as const,
    title: "Why certain tasks feel so wrong",
    template: (profile: PsychologyProfile) => {
      const primary = HollandTypeNames[profile.holland.primary];
      const drains = profile.flow.drains;
      
      return `As a primarily ${primary} type, you're energized by ${getHollandEnergizers(profile.holland.primary)}. ` +
        `Tasks like ${drains.length > 0 ? drains.join(', ') : 'routine administrative work'} conflict with this orientation. ` +
        `It's not laziness or bad attitude—it's a fundamental mismatch between the task and your natural inclinations.`;
    },
    frameworkBasis: ['Holland RIASEC']
  },

  // SDT insights
  sdt_competence_unmet: {
    type: 'why_feel' as const,
    title: "Why you doubt yourself even when you're skilled",
    template: () => 
      `Your competence need is unmet—not because you lack skill, but because you're not getting ` +
      `the feedback, challenges, or recognition that reinforce your sense of effectiveness. ` +
      `Self-doubt in this context is a symptom of environmental failure, not personal inadequacy.`,
    frameworkBasis: ['Self-Determination Theory']
  },

  // Boredom insights
  boredom_investigative: {
    type: 'why_feel' as const,
    title: "Why you're bored despite being busy",
    template: (profile: PsychologyProfile) => {
      const isHighChallenge = profile.flow.optimalChallenge === 'high';
      return `Your ${HollandTypeNames[profile.holland.primary]} orientation needs intellectual stimulation. ` +
        `${isHighChallenge ? 'You thrive on complex challenges that stretch your abilities. ' : ''}` +
        `Being busy with routine work doesn't satisfy this need. ` +
        `Boredom isn't about having nothing to do—it's about lacking meaningful challenge.`;
    },
    frameworkBasis: ['Holland RIASEC', 'Flow Theory']
  },

  // Stability vs growth tension
  stability_growth_tension: {
    type: 'why_feel' as const,
    title: "Why you feel stuck between safety and growth",
    template: (profile: PsychologyProfile) => {
      const hasSecurityAnchor = profile.careerAnchor.scores.security > 0.5;
      const hasChallengeAnchor = profile.careerAnchor.scores.challenge > 0.5;
      
      if (hasSecurityAnchor && hasChallengeAnchor) {
        return `You have competing needs: security (stability) and challenge (growth). ` +
          `This internal tension is real—you want to grow but not at the cost of stability. ` +
          `The solution isn't to pick one, but to find environments that offer ` +
          `challenge within a stable framework.`;
      }
      return `You're navigating the universal tension between security and growth. ` +
        `Your profile suggests you lean toward ${hasSecurityAnchor ? 'stability' : 'growth'}, ` +
        `but external pressures may push you toward the other. Honor your natural preference.`;
    },
    frameworkBasis: ['Career Anchors']
  }
};

// ============================================
// Helper Functions
// ============================================

function getHollandEnergizers(type: string): string {
  const energizers: Record<string, string> = {
    R: 'hands-on work, building tangible things',
    I: 'analysis, research, solving complex problems',
    A: 'creative expression, innovation, originality',
    S: 'helping others, teaching, collaboration',
    E: 'leading, persuading, driving toward goals',
    C: 'organization, systems, structure and order'
  };
  return energizers[type] || 'focused work';
}

// ============================================
// Generate Insights
// ============================================

export function generateInsights(
  profile: PsychologyProfile,
  answers: Record<string, string[]>,
  signals: Record<string, number>
): Insight[] {
  const insights: Insight[] = [];

  // Check for autonomy issues
  if (profile.sdt.autonomy === 'unmet' || signals.micromanagement > 0.5) {
    const template = insightTemplates.autonomy_micromanagement;
    insights.push({
      type: template.type,
      title: template.title,
      explanation: template.template(profile),
      frameworkBasis: template.frameworkBasis
    });
  }

  // Check for meeting drain
  if (signals.flow_drain_social > 0.3 || profile.bigFive.extraversion === 'low') {
    const q4Answers = answers.q4_drains || [];
    if (q4Answers.includes('meetings') || profile.bigFive.extraversion === 'low') {
      const template = insightTemplates.meetings_drain;
      insights.push({
        type: template.type,
        title: template.title,
        explanation: template.template(profile),
        frameworkBasis: template.frameworkBasis
      });
    }
  }

  // Check for flow blocked
  if (answers.q3_flow?.includes('been_a_while')) {
    const template = insightTemplates.flow_blocked;
    insights.push({
      type: template.type,
      title: template.title,
      explanation: template.template(profile),
      frameworkBasis: template.frameworkBasis
    });
  }

  // Check for resource depletion burnout
  if (profile.jdr.imbalanceType === 'resource_depletion' && profile.burnout.level !== 'low') {
    const template = insightTemplates.burnout_resource_depletion;
    insights.push({
      type: template.type,
      title: template.title,
      explanation: template.template(profile),
      frameworkBasis: template.frameworkBasis
    });
  }

  // Career anchor insight (always include)
  const anchorTemplate = insightTemplates.anchor_conflict;
  insights.push({
    type: anchorTemplate.type,
    title: anchorTemplate.title,
    explanation: anchorTemplate.template(profile),
    frameworkBasis: anchorTemplate.frameworkBasis
  });

  // Holland mismatch if there are drains
  if (profile.flow.drains.length > 0) {
    const hollandTemplate = insightTemplates.holland_mismatch;
    insights.push({
      type: hollandTemplate.type,
      title: hollandTemplate.title,
      explanation: hollandTemplate.template(profile),
      frameworkBasis: hollandTemplate.frameworkBasis
    });
  }

  // Check for boredom
  if (answers.q1_trigger?.includes('bored') || signals.flow_understimulated > 0.5) {
    const boredomTemplate = insightTemplates.boredom_investigative;
    insights.push({
      type: boredomTemplate.type,
      title: boredomTemplate.title,
      explanation: boredomTemplate.template(profile),
      frameworkBasis: boredomTemplate.frameworkBasis
    });
  }

  // Check for competence issues
  if (profile.sdt.competence === 'unmet') {
    const compTemplate = insightTemplates.sdt_competence_unmet;
    insights.push({
      type: compTemplate.type,
      title: compTemplate.title,
      explanation: compTemplate.template(),
      frameworkBasis: compTemplate.frameworkBasis
    });
  }

  return insights;
}

// ============================================
// Get Tradeoff Style Description
// ============================================

export function getTradeoffStyle(answers: Record<string, string[]>): string {
  const tradeoff = answers.q5_tradeoff?.[0];
  
  const styles: Record<string, string> = {
    salary_for_flexibility: "Time over Money - you'd sacrifice income for freedom",
    flexibility_for_salary: "Money over Time - financial security comes first",
    prestige_for_sanity: "Peace over Status - you prioritize wellbeing over recognition",
    sanity_for_prestige: "Status over Peace - you're willing to grind for recognition",
    growth_for_stability: "Stability over Growth - you prefer predictability",
    stability_for_growth: "Growth over Stability - you'll risk chaos for opportunity"
  };

  return styles[tradeoff || ''] || 'Balanced';
}

