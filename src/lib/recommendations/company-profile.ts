import { PsychologyProfile, CareerProfile } from '../types';

// ============================================
// Ideal Company Profile Types
// ============================================

export interface IdealCompanyProfile {
  stage: {
    ideal: CompanyStage;
    acceptable: CompanyStage[];
    reason: string;
  };
  
  culture: {
    ideal: CultureType;
    acceptable: CultureType[];
    reason: string;
  };
  
  managementStyle: {
    ideal: ManagementStyle;
    avoid: ManagementStyle[];
    reason: string;
  };
  
  teamSize: {
    ideal: TeamSize;
    reason: string;
  };
  
  industries: string[];
  
  redFlags: string[];
  greenFlags: string[];
  
  workMode: {
    ideal: WorkMode;
    acceptable: WorkMode[];
    reason: string;
  };
}

export type CompanyStage = 'early_startup' | 'growth' | 'scaleup' | 'enterprise';
export type CultureType = 'autonomous' | 'collaborative' | 'structured' | 'innovative' | 'results_oriented' | 'service' | 'mission_driven';
export type ManagementStyle = 'hands_off' | 'supportive' | 'directive' | 'coaching';
export type TeamSize = 'tiny' | 'small' | 'medium' | 'large';
export type WorkMode = 'remote_first' | 'remote_friendly' | 'hybrid' | 'onsite';

// ============================================
// Company Stage Descriptions
// ============================================

export const stageDescriptions: Record<CompanyStage, { label: string; description: string }> = {
  early_startup: {
    label: 'Early Startup (1-20 people)',
    description: 'High risk, high reward. Everything is being figured out. Wear many hats.'
  },
  growth: {
    label: 'Growth Stage (20-100 people)',
    description: 'Processes forming. Still moving fast but more structure. Real impact visible.'
  },
  scaleup: {
    label: 'Scale-up (100-500 people)',
    description: 'Established product-market fit. Professionalizing. Balance of agility and stability.'
  },
  enterprise: {
    label: 'Enterprise (500+ people)',
    description: 'Stable, mature, structured. Clear career paths but slower pace of change.'
  }
};

export const cultureDescriptions: Record<CultureType, { label: string; description: string }> = {
  autonomous: {
    label: 'Autonomous / Trust-based',
    description: '"We hire smart people and get out of their way." Outcome-focused, not hours-focused.'
  },
  collaborative: {
    label: 'Collaborative / Team-first',
    description: 'Strong team bonds, lots of pair work, shared ownership. "We succeed together."'
  },
  structured: {
    label: 'Structured / Process-driven',
    description: 'Clear procedures, defined roles, predictable workflows. Stability over speed.'
  },
  innovative: {
    label: 'Innovative / Experimental',
    description: 'Always trying new things. Fast iteration, tolerance for failure. Move fast mindset.'
  },
  results_oriented: {
    label: 'Results-Oriented / High Performance',
    description: 'Output matters above all. High standards, clear metrics, accountability culture.'
  },
  service: {
    label: 'Service-Oriented / People-First',
    description: 'Focus on helping others and making a positive impact. Empathy and care are core values.'
  },
  mission_driven: {
    label: 'Mission-Driven / Purpose-Led',
    description: 'Strong sense of purpose beyond profit. Work connects to larger societal impact.'
  }
};

export const managementDescriptions: Record<ManagementStyle, { label: string; description: string }> = {
  hands_off: {
    label: 'Hands-Off / Autonomous',
    description: 'Manager checks in periodically. You own your work end-to-end. Trust-based.'
  },
  supportive: {
    label: 'Supportive / Available',
    description: 'Manager is there when you need them. Regular 1:1s but not hovering.'
  },
  directive: {
    label: 'Directive / Clear Guidance',
    description: 'Clear direction and expectations. Manager involved in decisions.'
  },
  coaching: {
    label: 'Coaching / Growth-focused',
    description: 'Manager invests in your development. Regular feedback and stretch assignments.'
  }
};

export const teamSizeDescriptions: Record<TeamSize, { label: string; description: string }> = {
  tiny: {
    label: 'Tiny (2-5 people)',
    description: 'Maximum ownership. Everyone knows everything. Sink or swim together.'
  },
  small: {
    label: 'Small (5-15 people)',
    description: 'Close-knit, high visibility. Still intimate but with some specialization.'
  },
  medium: {
    label: 'Medium (15-50 people)',
    description: 'Sub-teams form. Some process needed. Balance of ownership and support.'
  },
  large: {
    label: 'Large (50+ people)',
    description: 'Specialized roles. Clear boundaries. Impact through systems, not just individual work.'
  }
};

// ============================================
// Company Profile Generator
// ============================================

export function generateIdealCompanyProfile(
  profile: CareerProfile,
  answers: Record<string, string[]>
): IdealCompanyProfile {
  const { psychology } = profile;
  
  // Determine ideal company stage
  const stage = determineStage(psychology, answers);
  
  // Determine culture fit
  const culture = determineCulture(psychology, answers);
  
  // Determine management style
  const managementStyle = determineManagementStyle(psychology, answers);
  
  // Determine team size
  const teamSize = determineTeamSize(psychology, answers);
  
  // Determine industries
  const industries = determineIndustries(psychology, answers);
  
  // Determine work mode
  const workMode = determineWorkMode(answers);
  
  // Generate flags
  const { redFlags, greenFlags } = generateFlags(psychology, answers);
  
  return {
    stage,
    culture,
    managementStyle,
    teamSize,
    industries,
    redFlags,
    greenFlags,
    workMode
  };
}

function determineStage(
  psychology: PsychologyProfile,
  answers: Record<string, string[]>
): IdealCompanyProfile['stage'] {
  const anchor = psychology.careerAnchor?.primary;
  const triggers = answers.q1_trigger || [];
  const currentCompanyType = answers.ctx_company_type?.[0];
  
  let ideal: CompanyStage = 'growth';
  let acceptable: CompanyStage[] = ['scaleup'];
  let reason = '';
  
  // Anchor-based logic
  if (anchor === 'entrepreneurial') {
    ideal = 'early_startup';
    acceptable = ['growth'];
    reason = 'Your entrepreneurial anchor thrives in environments where you can build from scratch and shape direction.';
  } else if (anchor === 'security') {
    ideal = 'enterprise';
    acceptable = ['scaleup'];
    reason = 'Your security anchor needs the stability and predictability that established companies provide.';
  } else if (anchor === 'autonomy') {
    ideal = 'growth';
    acceptable = ['scaleup', 'early_startup'];
    reason = 'Growth-stage companies offer autonomy without the chaos of early startups or bureaucracy of enterprises.';
  } else if (anchor === 'challenge') {
    ideal = 'growth';
    acceptable = ['early_startup', 'scaleup'];
    reason = 'Growth-stage companies face the hardest problems: scale, process, and product-market fit challenges.';
  } else if (anchor === 'lifestyle') {
    ideal = 'scaleup';
    acceptable = ['enterprise', 'growth'];
    reason = 'Scale-ups often have the processes for work-life balance without enterprise bureaucracy.';
  }
  
  // Adjust based on triggers
  if (triggers.includes('instability')) {
    if (ideal === 'early_startup') {
      ideal = 'growth';
    }
    reason += ' Given your concerns about instability, we\'ve weighted toward more established options.';
  }
  
  // Adjust based on current company type (escape logic)
  if (currentCompanyType === 'early_startup' && triggers.includes('chaos')) {
    ideal = 'scaleup';
    acceptable = ['enterprise', 'growth'];
    reason = 'You\'re escaping startup chaos. A scale-up or enterprise offers more structure while still being dynamic.';
  } else if (currentCompanyType === 'established_corp' && triggers.includes('bored')) {
    ideal = 'growth';
    acceptable = ['early_startup', 'scaleup'];
    reason = 'You\'re escaping corporate stagnation. Smaller, faster-moving companies will re-energize you.';
  }
  
  return { ideal, acceptable, reason };
}

function determineCulture(
  psychology: PsychologyProfile,
  answers: Record<string, string[]>
): IdealCompanyProfile['culture'] {
  const anchor = psychology.careerAnchor?.primary;
  const sdt = psychology.sdt;
  const energizers = answers.q5_energy || [];
  
  let ideal: CultureType = 'autonomous';
  let acceptable: CultureType[] = ['results_oriented'];
  let reason = '';
  
  // SDT-based logic
  if (sdt?.primaryUnmetNeed === 'autonomy') {
    ideal = 'autonomous';
    acceptable = ['results_oriented', 'innovative'];
    reason = 'You need a culture that trusts you to work independently. Avoid "we\'re like a family" cultures (often means no boundaries).';
  } else if (sdt?.primaryUnmetNeed === 'relatedness') {
    ideal = 'collaborative';
    acceptable = ['service', 'structured'];
    reason = 'You need genuine connection and teamwork. Look for "we succeed together" cultures with strong team bonds.';
  } else if (sdt?.primaryUnmetNeed === 'competence') {
    ideal = 'innovative';
    acceptable = ['results_oriented', 'autonomous'];
    reason = 'You need to feel challenged and growing. Cultures that encourage experimentation and learning fit best.';
  }
  
  // Anchor adjustments
  if (anchor === 'security') {
    ideal = 'structured';
    acceptable = ['collaborative'];
    reason = 'Your security anchor prefers predictability. Structured cultures with clear expectations work best.';
  } else if (anchor === 'challenge') {
    ideal = 'results_oriented';
    acceptable = ['innovative', 'autonomous'];
    reason = 'Your challenge anchor needs high-performance cultures where excellence is expected and rewarded.';
  }
  
  // Energy adjustments
  if (energizers.includes('collaboration')) {
    if (ideal === 'autonomous') {
      acceptable = ['collaborative', ...acceptable];
    }
    reason += ' Your energy from collaboration means some team interaction is valuable.';
  }
  
  return { ideal, acceptable, reason };
}

function determineManagementStyle(
  psychology: PsychologyProfile,
  answers: Record<string, string[]>
): IdealCompanyProfile['managementStyle'] {
  const anchor = psychology.careerAnchor?.primary;
  const frustrated = answers.q3_frustrated || [];
  const currentManager = answers.ctx_manager?.[0];
  
  let ideal: ManagementStyle = 'supportive';
  let avoid: ManagementStyle[] = [];
  let reason = '';
  
  // Frustration-based
  if (frustrated.includes('micromanagement')) {
    ideal = 'hands_off';
    avoid = ['directive'];
    reason = 'You need space to work. Look for managers who check outcomes, not methods. Skip roles mentioning "daily standups" or "regular check-ins."';
  } else if (frustrated.includes('no_feedback')) {
    ideal = 'coaching';
    avoid = ['hands_off'];
    reason = 'You need feedback to know you\'re on track. Look for managers who invest in development and give regular input.';
  } else if (frustrated.includes('isolation')) {
    ideal = 'supportive';
    avoid = ['hands_off'];
    reason = 'You need an accessible manager. Look for "open door policy" and regular 1:1 cultures.';
  }
  
  // Anchor-based
  if (anchor === 'autonomy') {
    ideal = 'hands_off';
    avoid = ['directive'];
    reason = 'Your autonomy anchor needs a manager who trusts completely. Weekly syncs, not daily oversight.';
  } else if (anchor === 'technical_competence') {
    ideal = 'coaching';
    avoid = [];
    reason = 'Your technical anchor benefits from managers who can help you grow technically and advocate for your work.';
  }
  
  // Current manager escape
  if (currentManager === 'micromanager') {
    ideal = 'hands_off';
    avoid = ['directive'];
    reason = 'You\'re escaping micromanagement. Prioritize autonomy in your next role. Ask about management style in interviews.';
  } else if (currentManager === 'absent_manager') {
    ideal = 'supportive';
    avoid = ['hands_off'];
    reason = 'You\'ve had an absent manager. You need someone present who removes blockers and provides direction when needed.';
  }
  
  return { ideal, avoid, reason };
}

function determineTeamSize(
  psychology: PsychologyProfile,
  answers: Record<string, string[]>
): IdealCompanyProfile['teamSize'] {
  const anchor = psychology.careerAnchor?.primary;
  const energizers = answers.q5_energy || [];
  const holland = psychology.holland?.primary;
  
  let ideal: TeamSize = 'small';
  let reason = '';
  
  if (anchor === 'autonomy') {
    ideal = 'small';
    reason = 'Small teams (5-15) give you ownership without being overwhelming. Big enough for support, small enough for autonomy.';
  } else if (anchor === 'entrepreneurial') {
    ideal = 'tiny';
    reason = 'Tiny teams let you shape everything. Maximum impact, maximum responsibility.';
  } else if (anchor === 'security') {
    ideal = 'medium';
    reason = 'Medium-sized teams have stability and defined roles while still offering meaningful work.';
  } else if (anchor === 'management') {
    ideal = 'medium';
    reason = 'Medium teams give you scope to lead while building meaningful relationships with reports.';
  }
  
  // Holland adjustments
  if (holland === 'S') { // Social
    ideal = 'medium';
    reason = 'Your social nature thrives in medium teams where you can build relationships across the group.';
  } else if (holland === 'I') { // Investigative
    ideal = 'small';
    reason = 'Your investigative nature prefers smaller teams with less context-switching and more focus time.';
  }
  
  // Energy adjustments
  if (energizers.includes('collaboration')) {
    if (ideal === 'tiny') {
      ideal = 'small';
      reason += ' Your collaboration energy means some team interaction is valuable.';
    }
  } else if (energizers.includes('autonomy')) {
    if (ideal === 'medium') {
      ideal = 'small';
      reason += ' Your autonomy preference means smaller teams where you can own more.';
    }
  }
  
  return { ideal, reason };
}

function determineIndustries(
  psychology: PsychologyProfile,
  answers: Record<string, string[]>
): string[] {
  const anchor = psychology.careerAnchor?.primary;
  const holland = psychology.holland?.primary;
  const currentIndustry = answers.q10_industry?.[0];
  
  const industries: string[] = [];
  
  // Base industries that work for most tech workers
  industries.push('Technology', 'Software', 'SaaS');
  
  // Anchor-based additions
  if (anchor === 'autonomy') {
    industries.push('Remote-first companies', 'Developer tools', 'Consulting');
  } else if (anchor === 'challenge') {
    industries.push('AI/ML', 'Fintech', 'Infrastructure', 'Security');
  } else if (anchor === 'service') {
    industries.push('Healthcare tech', 'EdTech', 'Non-profit tech', 'Climate tech');
  } else if (anchor === 'security') {
    industries.push('Enterprise software', 'Government tech', 'Insurance tech');
  } else if (anchor === 'entrepreneurial') {
    industries.push('Venture-backed startups', 'Creator economy', 'Web3');
  }
  
  // Holland-based additions
  if (holland === 'A') { // Artistic
    industries.push('Design tools', 'Media tech', 'Gaming');
  } else if (holland === 'S') { // Social
    industries.push('HR tech', 'Community platforms', 'EdTech');
  }
  
  // Add current industry if not leaving
  if (currentIndustry && !answers.q1_trigger?.includes('industry_mismatch')) {
    const industryLabels: Record<string, string> = {
      tech: 'Technology',
      finance: 'Fintech',
      healthcare: 'Healthcare tech',
      ecommerce: 'E-commerce',
      media: 'Media tech',
      education: 'EdTech',
      other: ''
    };
    const label = industryLabels[currentIndustry];
    if (label && !industries.includes(label)) {
      industries.unshift(label); // Put current industry first
    }
  }
  
  return Array.from(new Set(industries)).slice(0, 6);
}

function determineWorkMode(
  answers: Record<string, string[]>
): IdealCompanyProfile['workMode'] {
  const workMode = answers.q12_work_mode?.[0];
  const targetRegions = answers.q13_regions || [];
  
  let ideal: WorkMode = 'remote_friendly';
  let acceptable: WorkMode[] = ['hybrid'];
  let reason = '';
  
  if (workMode === 'full_remote') {
    ideal = 'remote_first';
    acceptable = ['remote_friendly'];
    reason = 'You want remote-first culture where async is the default, not the exception.';
  } else if (workMode === 'remote_flex') {
    ideal = 'remote_friendly';
    acceptable = ['hybrid', 'remote_first'];
    reason = 'You want flexibility to work from home but value occasional in-person time.';
  } else if (workMode === 'hybrid') {
    ideal = 'hybrid';
    acceptable = ['remote_friendly', 'onsite'];
    reason = 'You want a balance of in-office collaboration and remote flexibility.';
  } else if (workMode === 'onsite') {
    ideal = 'onsite';
    acceptable = ['hybrid'];
    reason = 'You prefer or need in-office work. Look for companies with strong office culture.';
  }
  
  // Adjust based on regions
  if (targetRegions.includes('global') || targetRegions.length > 2) {
    ideal = 'remote_first';
    acceptable = ['remote_friendly'];
    reason += ' With multiple target regions, remote-first companies offer the most flexibility.';
  }
  
  return { ideal, acceptable, reason };
}

function generateFlags(
  psychology: PsychologyProfile,
  answers: Record<string, string[]>
): { redFlags: string[]; greenFlags: string[] } {
  const anchor = psychology.careerAnchor?.primary;
  const frustrated = answers.q3_frustrated || [];
  const triggers = answers.q1_trigger || [];
  const currentManager = answers.ctx_manager?.[0];
  
  const redFlags: string[] = [];
  const greenFlags: string[] = [];
  
  // Universal green flags
  greenFlags.push('Clear career ladder and growth path');
  greenFlags.push('Transparent compensation philosophy');
  
  // Anchor-based flags
  if (anchor === 'autonomy') {
    greenFlags.push('"We hire smart people and get out of their way"');
    greenFlags.push('Async-first communication');
    greenFlags.push('Results-only work environment (ROWE)');
    redFlags.push('"We\'re like a family" (often means poor boundaries)');
    redFlags.push('Daily standups or constant check-ins');
    redFlags.push('Time tracking or presence monitoring');
  } else if (anchor === 'security') {
    greenFlags.push('Long average employee tenure');
    greenFlags.push('Clear policies and procedures');
    greenFlags.push('Predictable release cycles');
    redFlags.push('Frequent pivots or strategy changes');
    redFlags.push('High turnover rate');
    redFlags.push('"Fast-paced" or "rapidly changing"');
  } else if (anchor === 'challenge') {
    greenFlags.push('Hard technical problems');
    greenFlags.push('Senior engineering culture');
    greenFlags.push('"We tackle problems others avoid"');
    redFlags.push('Mostly maintenance work');
    redFlags.push('Outdated tech stack');
    redFlags.push('"Support multiple legacy systems"');
  } else if (anchor === 'lifestyle') {
    greenFlags.push('Unlimited PTO (actually used)');
    greenFlags.push('No after-hours expectations');
    greenFlags.push('Flexible schedule');
    redFlags.push('"Work hard, play hard" culture');
    redFlags.push('24/7 on-call expectations');
    redFlags.push('"We\'re passionate about what we do"');
  }
  
  // Frustration-based flags
  if (frustrated.includes('meetings')) {
    greenFlags.push('Meeting-free days or limited meeting culture');
    redFlags.push('Heavy meeting culture');
  }
  
  if (frustrated.includes('bureaucracy')) {
    greenFlags.push('Fast decision-making');
    greenFlags.push('Empowered teams');
    redFlags.push('Multiple approval layers');
    redFlags.push('"Process-oriented" culture');
  }
  
  if (frustrated.includes('politics')) {
    greenFlags.push('Transparent promotion criteria');
    greenFlags.push('Direct feedback culture');
    redFlags.push('Unclear advancement criteria');
    redFlags.push('Executive favoritism');
  }
  
  // Manager-based flags
  if (currentManager === 'micromanager') {
    greenFlags.push('Trust-based management');
    greenFlags.push('"We measure outcomes, not hours"');
    redFlags.push('Detailed progress tracking');
    redFlags.push('Daily status updates required');
  }
  
  // Trigger-based flags
  if (triggers.includes('burned_out')) {
    greenFlags.push('Sustainable pace');
    greenFlags.push('Mental health benefits');
    redFlags.push('Startup intensity culture');
    redFlags.push('"Hustle" in company values');
  }
  
  return {
    redFlags: Array.from(new Set(redFlags)).slice(0, 6),
    greenFlags: Array.from(new Set(greenFlags)).slice(0, 6)
  };
}

