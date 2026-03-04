import { CareerProfile } from '../types';

interface NarrativeSection {
  title: string;
  content: string;
  icon: string;
}

export interface UserNarrative {
  greeting: string;
  headline: string;
  story: NarrativeSection[];
  callToAction: string;
}

/**
 * Generate a personalized narrative based on the user's profile
 */
export function generateNarrative(
  profile: CareerProfile,
  userName: string,
  contextAnswers: Record<string, string[]>,
  textAnswers: Record<string, string>
): UserNarrative {
  const name = textAnswers['ctx_name'] || userName || 'there';
  
  // Get context info
  const companyType = contextAnswers['ctx_company_type']?.[0] || '';
  const managerSituation = contextAnswers['ctx_manager']?.[0] || '';
  const tenureSituation = contextAnswers['ctx_tenure']?.[0] || '';
  
  // Build the opening
  const greeting = `${name}, let me tell you what I see.`;
  
  // Build headline based on primary diagnosis
  const headline = buildHeadline(profile);
  
  // Build story sections
  const story: NarrativeSection[] = [];
  
  // Section 1: The Current Situation
  story.push({
    title: 'Your Current Reality',
    content: buildCurrentSituation(profile, companyType, managerSituation, tenureSituation, name),
    icon: '📍'
  });
  
  // Section 2: What's Actually Going On
  story.push({
    title: 'What\'s Really Happening',
    content: buildWhatGoingOn(profile, name),
    icon: '🔍'
  });
  
  // Section 3: What You Need
  story.push({
    title: 'What You Actually Need',
    content: buildWhatYouNeed(profile, name),
    icon: '💡'
  });
  
  // Section 4: Your Superpowers
  story.push({
    title: 'Your Hidden Strengths',
    content: buildSuperpowers(profile, name),
    icon: '⚡'
  });
  
  // Section 5: The Path Forward
  story.push({
    title: 'The Path Forward',
    content: buildPathForward(profile, name),
    icon: '🛤️'
  });
  
  const callToAction = buildCallToAction(profile, name);
  
  return { greeting, headline, story, callToAction };
}

function buildHeadline(
  profile: CareerProfile
): string {
  const { diagnoses, psychology } = profile;
  const primaryDiagnosis = diagnoses[0];
  
  if (primaryDiagnosis?.category === 'burnout') {
    return "You're not lazy or broken. You're burned out, and that's not your fault.";
  }
  
  if (primaryDiagnosis?.category === 'stagnation') {
    return "You've outgrown where you are. That restlessness is telling you something.";
  }
  
  if (primaryDiagnosis?.category === 'toxic_environment') {
    return "It's not all in your head. The environment is the problem.";
  }
  
  if (primaryDiagnosis?.category === 'undervalued') {
    return "You deserve to be recognized. The right place will see your worth.";
  }
  
  if (psychology?.sdt?.primaryUnmetNeed === 'autonomy') {
    return "You're being held back by too much control. You need space to thrive.";
  }
  
  if (psychology?.sdt?.primaryUnmetNeed === 'competence') {
    return "You're capable of so much more. You just need the right challenge.";
  }
  
  return "Something's off, and now we know exactly what. Let's fix it.";
}

function buildCurrentSituation(
  profile: CareerProfile,
  companyType: string,
  managerSituation: string,
  tenureSituation: string,
  name: string
): string {
  const parts: string[] = [];
  
  // Company type context
  const companyDescriptions: Record<string, string> = {
    'early_startup': `You're at an early-stage startup — exciting, yes, but also unpredictable. Things move fast, maybe too fast.`,
    'growing_company': `You're at a growing company where change is constant. What worked yesterday might not work tomorrow.`,
    'established_corp': `You're at an established company. Stable, sure, but stability can feel like stagnation.`,
    'agency_consulting': `You're in agency or consulting work — constantly context-switching between client needs.`,
    'between_jobs': `You're between opportunities right now, which means you have clarity that full-timers don't.`
  };
  
  if (companyType && companyDescriptions[companyType]) {
    parts.push(companyDescriptions[companyType]);
  }
  
  // Manager context
  const managerDescriptions: Record<string, string> = {
    'great_manager': `Your manager is actually good, which means the issues run deeper than just leadership.`,
    'absent_manager': `Your manager is checked out or too busy — you're essentially flying solo without the support you need.`,
    'micromanager': `Your manager watches everything you do. That level of control is suffocating your ability to do great work.`,
    'toxic_manager': `Your manager is part of the problem. That's exhausting in ways that are hard to explain to others.`,
    'new_manager': `Your manager is new, so you're both still figuring out how to work together.`,
    'no_manager': `Without a direct manager, you're navigating alone — which can be freeing or frustrating.`
  };
  
  if (managerSituation && managerDescriptions[managerSituation]) {
    parts.push(managerDescriptions[managerSituation]);
  }
  
  // Tenure context
  const tenureDescriptions: Record<string, string> = {
    'under_3mo': `This started recently — you're not overreacting, you're noticing early.`,
    '3_6mo': `You've been feeling this for months now. It's not a phase.`,
    '6mo_1yr': `Almost a year of this. That's too long to keep pushing through.`,
    '1_2yr': `After more than a year, you're not complaining — you're surviving. That takes a toll.`,
    '2_plus': `More than two years of this. ${name}, you've been incredibly resilient, but resilience has a cost.`
  };
  
  if (tenureSituation && tenureDescriptions[tenureSituation]) {
    parts.push(tenureDescriptions[tenureSituation]);
  }
  
  return parts.join('\n\n') || `You're at a crossroads, and that's okay. Let's figure out where you go from here.`;
}

function buildWhatGoingOn(profile: CareerProfile, name: string): string {
  const { diagnoses, psychology } = profile;
  const parts: string[] = [];
  
  // Primary diagnosis explanation
  if (diagnoses.length > 0) {
    const primary = diagnoses[0];
    
    const diagnosisNarratives: Record<string, string> = {
      'burnout': `${name}, what you're experiencing is classic burnout. It's not about working hard — it's about working hard without seeing the point. Your battery isn't just low; the charger is broken.`,
      'stagnation': `You've stopped growing, and for someone like you, that's devastating. You're not bored because you're lazy — you're bored because your brain is hungry for real challenges.`,
      'toxic_environment': `The environment around you is the problem. It's like trying to run a marathon in quicksand — no matter how hard you try, the surroundings pull you down.`,
      'undervalued': `You're giving more than you're getting back. That gap between contribution and recognition wears you down in ways that are hard to pinpoint.`,
      'misalignment': `There's a mismatch between who you are and what you're being asked to do. It's like being a fish asked to climb trees.`,
      'autonomy_crisis': `You need space to think, decide, and own your work. Right now, you don't have that. And for you, that's not a preference — it's a requirement.`
    };
    
    if (primary.category && diagnosisNarratives[primary.category]) {
      parts.push(diagnosisNarratives[primary.category]);
    }
  }
  
  // Psychology-based insights
  if (psychology?.sdt?.primaryUnmetNeed) {
    const sdtNarratives: Record<string, string> = {
      'autonomy': `Psychologically, you have a strong need for autonomy — the freedom to make decisions and control your work. When that's missing, everything feels harder.`,
      'competence': `You have a deep need to feel capable and effective. When your work doesn't challenge you or when you're not growing, it creates a void.`,
      'relatedness': `Connection matters to you. You need to feel part of something, to belong. Without that, work becomes lonely.`
    };
    
    if (sdtNarratives[psychology.sdt.primaryUnmetNeed]) {
      parts.push(sdtNarratives[psychology.sdt.primaryUnmetNeed]);
    }
  }
  
  return parts.join('\n\n') || `Something is out of alignment, and your instincts are picking up on it.`;
}

function buildWhatYouNeed(profile: CareerProfile, name: string): string {
  const { psychology } = profile;
  const needs: string[] = [];
  
  // Based on career anchor
  if (psychology?.careerAnchor?.primary) {
    const anchorNeeds: Record<string, string> = {
      'autonomy': `You need a role where you set your own direction. "Just do it your way" should be music to your ears.`,
      'security': `You need stability and predictability. Not boring — sustainable. There's a difference.`,
      'technical': `You need to stay close to the craft. Don't let anyone promote you away from what you love.`,
      'managerial': `You need to lead. Influence, decisions, impact at scale — that's your arena.`,
      'entrepreneurial': `You need to build. Whether inside a company or on your own, creation is your fuel.`,
      'service': `You need work that helps others. Purpose isn't a nice-to-have for you — it's everything.`,
      'challenge': `You need hard problems. Easy wins don't satisfy you the way they do others.`,
      'lifestyle': `You need balance. Not because you're not ambitious, but because you're ambitious about your whole life.`
    };
    
    if (anchorNeeds[psychology.careerAnchor.primary]) {
      needs.push(anchorNeeds[psychology.careerAnchor.primary]);
    }
  }
  
  // Based on Holland code
  if (psychology?.holland?.primary) {
    const hollandNeeds: Record<string, string> = {
      'R': `You need hands-on, practical work. Abstract meetings and strategy documents drain you.`,
      'I': `You need time to think, research, and solve puzzles. Interruptions are your kryptonite.`,
      'A': `You need creative freedom. Rules and rigid processes kill your spark.`,
      'S': `You need human connection in your work. Isolated tasks miss the point for you.`,
      'E': `You need influence and leadership opportunities. Supporting from the sidelines isn't your style.`,
      'C': `You need structure and clarity. Chaos isn't exciting for you — it's exhausting.`
    };
    
    if (hollandNeeds[psychology.holland.primary]) {
      needs.push(hollandNeeds[psychology.holland.primary]);
    }
  }
  
  if (needs.length === 0) {
    return `${name}, you need a role that respects your strengths and addresses your frustrations. Let's define exactly what that looks like.`;
  }
  
  return needs.join('\n\n');
}

function buildSuperpowers(profile: CareerProfile, name: string): string {
  const { psychology } = profile;
  const strengths: string[] = [];
  
  // Big Five based strengths
  if (psychology?.bigFive) {
    const { openness, conscientiousness, extraversion } = psychology.bigFive;
    
    if (openness === 'high') {
      strengths.push(`You're highly creative and open to new ideas. Where others see risk, you see possibility.`);
    }
    
    if (conscientiousness === 'high') {
      strengths.push(`You're reliable and detail-oriented. People trust you to deliver quality.`);
    }
    
    if (extraversion === 'high') {
      strengths.push(`You energize rooms. Your presence lifts teams and moves conversations forward.`);
    } else if (extraversion === 'low') {
      strengths.push(`You think deeply before acting. Your considered approach catches things others miss.`);
    }
  }
  
  // Flow-based strengths
  if (psychology?.flow?.triggers?.length > 0) {
    const flowStrength = `You come alive when ${psychology.flow.triggers.slice(0, 2).join(' or ')}. That's not just preference — that's where you do your best work.`;
    strengths.push(flowStrength);
  }
  
  if (strengths.length === 0) {
    return `${name}, you have strengths you might be taking for granted. The right environment will recognize what you bring.`;
  }
  
  return strengths.join('\n\n');
}

function buildPathForward(profile: CareerProfile, name: string): string {
  const { diagnoses, psychology } = profile;
  const parts: string[] = [];
  
  parts.push(`Here's what I'd suggest, ${name}:`);
  
  // Based on urgency
  if (diagnoses.some(d => d.severity === 'critical')) {
    parts.push(`First, acknowledge that this is urgent. You're not overthinking — you need change soon. Start exploring quietly, even if you're not ready to jump.`);
  }
  
  // Based on career anchor
  if (psychology?.careerAnchor?.primary === 'autonomy') {
    parts.push(`Look for roles with "end-to-end ownership" or "work autonomously." Avoid anything with daily standups or heavy process.`);
  } else if (psychology?.careerAnchor?.primary === 'challenge') {
    parts.push(`Target companies known for hard problems — not glamorous perks, but genuine technical or strategic depth.`);
  } else if (psychology?.careerAnchor?.primary === 'lifestyle') {
    parts.push(`Filter hard for remote-friendly, async-first, or results-only cultures. Your next role should respect boundaries.`);
  }
  
  parts.push(`I can help you find companies and roles that match this profile. That's what the recommendations section is for.`);
  
  return parts.join('\n\n');
}

function buildCallToAction(profile: CareerProfile, name: string): string {
  const { diagnoses } = profile;
  
  if (diagnoses.some(d => d.severity === 'critical')) {
    return `${name}, you've been patient long enough. Let's find something better.`;
  }
  
  return `${name}, you deserve a role that fits. Let's make it happen.`;
}

