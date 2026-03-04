import { PsychologyProfile, CareerProfile } from '../types';

// ============================================
// Ideal Job Profile Types
// ============================================

export interface IdealJobProfile {
  track: {
    recommended: CareerTrack;
    alternates: CareerTrack[];
    reason: string;
  };
  
  scope: {
    ideal: RoleScope;
    reason: string;
  };
  
  autonomyLevel: 'high' | 'medium' | 'low';
  
  idealTitles: TitleRecommendation[];
  avoidTitles: string[];
  
  lookFor: string[];      // What to look for in job descriptions
  avoid: string[];        // Red flags in job descriptions
  
  responsibilities: {
    seek: string[];
    avoid: string[];
  };
  
  interviewQuestions: string[];
}

export type CareerTrack = 'ic' | 'management' | 'hybrid' | 'specialist' | 'generalist';
export type RoleScope = 'deep_specialist' | 'broad_generalist' | 'strategic' | 'executional';

export interface TitleRecommendation {
  title: string;
  fit: 'excellent' | 'good' | 'worth_considering';
  reason: string;
}

// ============================================
// Track Descriptions
// ============================================

export const trackDescriptions: Record<CareerTrack, { label: string; description: string }> = {
  ic: {
    label: 'Individual Contributor',
    description: 'Solve problems directly. Deep in the work. Influence through expertise, not authority.'
  },
  management: {
    label: 'People Management',
    description: 'Lead through others. Build and grow teams. Multiply impact through people.'
  },
  hybrid: {
    label: 'Technical Lead / Hybrid',
    description: 'Stay technical while leading. Architecture + mentorship. Best of both worlds.'
  },
  specialist: {
    label: 'Deep Specialist',
    description: 'Become THE expert. Go deep, not wide. Known for one thing done brilliantly.'
  },
  generalist: {
    label: 'Strategic Generalist',
    description: 'Connect dots across domains. Versatile problem-solver. Thrive on variety.'
  }
};

export const scopeDescriptions: Record<RoleScope, { label: string; description: string }> = {
  deep_specialist: {
    label: 'Deep Specialist',
    description: 'Focus on one area. Become the expert. Depth over breadth.'
  },
  broad_generalist: {
    label: 'Broad Generalist',
    description: 'Touch many areas. Connect different domains. Versatility is strength.'
  },
  strategic: {
    label: 'Strategic / Planning',
    description: 'Think long-term. Shape direction. Less execution, more planning.'
  },
  executional: {
    label: 'Execution-Focused',
    description: 'Ship things. Make it happen. Visible, tangible output.'
  }
};

// ============================================
// Job Profile Generator
// ============================================

export function generateIdealJobProfile(
  profile: CareerProfile,
  answers: Record<string, string[]>
): IdealJobProfile {
  const { psychology } = profile;
  
  // Determine career track
  const track = determineTrack(psychology, answers);
  
  // Determine role scope
  const scope = determineScope(psychology, answers);
  
  // Determine autonomy level
  const autonomyLevel = determineAutonomyLevel(psychology, answers);
  
  // Generate title recommendations
  const idealTitles = generateTitleRecommendations(psychology, answers, track.recommended);
  const avoidTitles = generateAvoidTitles(psychology, answers);
  
  // Generate JD patterns
  const lookFor = generateLookFor(psychology);
  const avoid = generateAvoid(psychology, answers);
  
  // Generate responsibilities
  const responsibilities = generateResponsibilities(psychology, answers);
  
  // Generate interview questions
  const interviewQuestions = generateInterviewQuestions(psychology, answers);
  
  return {
    track,
    scope,
    autonomyLevel,
    idealTitles,
    avoidTitles,
    lookFor,
    avoid,
    responsibilities,
    interviewQuestions
  };
}

function determineTrack(
  psychology: PsychologyProfile,
  answers: Record<string, string[]>
): IdealJobProfile['track'] {
  const anchor = psychology.careerAnchor?.primary;
  const holland = psychology.holland?.primary;
  const energizers = answers.q5_energy || [];
  
  let recommended: CareerTrack = 'ic';
  let alternates: CareerTrack[] = ['hybrid'];
  let reason = '';
  
  // Holland-based logic
  if (holland === 'E') { // Enterprising
    recommended = 'management';
    alternates = ['hybrid'];
    reason = 'Your Enterprising type thrives on influencing and leading others. You naturally gravitate toward leadership.';
  } else if (holland === 'I') { // Investigative
    recommended = 'ic';
    alternates = ['specialist'];
    reason = 'Your Investigative type loves solving hard problems directly. Stay IC until you genuinely want to lead.';
  } else if (holland === 'A') { // Artistic
    recommended = 'ic';
    alternates = ['specialist', 'generalist'];
    reason = 'Your Artistic type needs creative ownership. IC roles give you the freedom to craft your approach.';
  } else if (holland === 'S') { // Social
    recommended = 'management';
    alternates = ['hybrid', 'ic'];
    reason = 'Your Social type finds meaning in helping others grow. Management or mentorship-heavy roles fit well.';
  }
  
  // Anchor adjustments
  if (anchor === 'technical_competence') {
    recommended = 'specialist';
    alternates = ['ic', 'hybrid'];
    reason = 'Your Technical anchor means mastery matters most. Don\'t get promoted away from what you love.';
  } else if (anchor === 'management') {
    recommended = 'management';
    alternates = ['hybrid'];
    reason = 'Your Managerial anchor wants to run things. Leadership is your path, not a detour.';
  } else if (anchor === 'challenge') {
    recommended = 'ic';
    alternates = ['specialist', 'hybrid'];
    reason = 'Your Challenge anchor thrives on hard problems. IC keeps you close to the work that energizes you.';
  } else if (anchor === 'autonomy') {
    recommended = 'ic';
    alternates = ['hybrid', 'specialist'];
    reason = 'Your Autonomy anchor needs freedom. IC roles typically have more autonomy than management.';
  }
  
  // Energy adjustments
  if (energizers.includes('leading')) {
    if (recommended === 'ic') {
      recommended = 'hybrid';
      reason += ' Your energy from leading suggests a hybrid role could work well.';
    }
  } else if (energizers.includes('deep_work')) {
    if (recommended === 'management') {
      alternates = ['hybrid', ...alternates];
      reason += ' But your energy from deep work means hybrid might be better than pure management.';
    }
  }
  
  return { recommended, alternates, reason };
}

function determineScope(
  psychology: PsychologyProfile,
  answers: Record<string, string[]>
): IdealJobProfile['scope'] {
  const anchor = psychology.careerAnchor?.primary;
  const flow = psychology.flow;
  const frustrated = answers.q3_frustrated || [];
  
  let ideal: RoleScope = 'broad_generalist';
  let reason = '';
  
  // Flow-based logic
  if (flow?.triggers?.includes('solving complex problems')) {
    ideal = 'deep_specialist';
    reason = 'You enter flow when solving complex problems. Deep roles let you do that work you love.';
  } else if (flow?.triggers?.includes('variety and new challenges')) {
    ideal = 'broad_generalist';
    reason = 'You enter flow with variety. Generalist roles keep things fresh and engaging.';
  }
  
  // Anchor adjustments
  if (anchor === 'technical_competence') {
    ideal = 'deep_specialist';
    reason = 'Your Technical anchor wants mastery. Go deep, become the expert everyone consults.';
  } else if (anchor === 'entrepreneurial') {
    ideal = 'broad_generalist';
    reason = 'Your Entrepreneurial anchor needs to see the whole picture. Generalist scope feeds that.';
  } else if (anchor === 'management') {
    ideal = 'strategic';
    reason = 'Your Managerial anchor thinks big picture. Strategic scope lets you shape direction.';
  }
  
  // Frustration adjustments
  if (frustrated.includes('chaos')) {
    ideal = 'deep_specialist';
    reason = 'You\'re frustrated by chaos. Specialist roles have clearer boundaries and expectations.';
  } else if (frustrated.includes('dead_end')) {
    ideal = 'strategic';
    reason = 'You\'re frustrated by feeling stuck. Strategic scope gives you visibility and advancement paths.';
  }
  
  return { ideal, reason };
}

function determineAutonomyLevel(
  psychology: PsychologyProfile,
  answers: Record<string, string[]>
): 'high' | 'medium' | 'low' {
  const anchor = psychology.careerAnchor?.primary;
  const sdt = psychology.sdt;
  const frustrated = answers.q3_frustrated || [];
  
  // Strong autonomy need
  if (anchor === 'autonomy' || sdt?.primaryUnmetNeed === 'autonomy') {
    return 'high';
  }
  
  // Frustrated by micromanagement
  if (frustrated.includes('micromanagement')) {
    return 'high';
  }
  
  // Security anchor prefers guidance
  if (anchor === 'security') {
    return 'low';
  }
  
  // Frustrated by isolation might want more guidance
  if (frustrated.includes('isolation') || frustrated.includes('no_feedback')) {
    return 'medium';
  }
  
  return 'medium';
}

function generateTitleRecommendations(
  psychology: PsychologyProfile,
  answers: Record<string, string[]>,
  track: CareerTrack
): TitleRecommendation[] {
  const titles: TitleRecommendation[] = [];
  const yearsExp = answers.q9_years?.[0];
  const anchor = psychology.careerAnchor?.primary;
  
  // Map years to seniority
  const getSeniority = (): 'junior' | 'mid' | 'senior' | 'staff' | 'principal' => {
    if (!yearsExp) return 'mid';
    if (yearsExp === '0_2') return 'junior';
    if (yearsExp === '2_5') return 'mid';
    if (yearsExp === '5_10') return 'senior';
    if (yearsExp === '10_15') return 'staff';
    return 'principal';
  };
  
  const seniority = getSeniority();
  
  // IC Track titles
  if (track === 'ic' || track === 'specialist') {
    if (seniority === 'senior' || seniority === 'staff') {
      titles.push({
        title: 'Staff Engineer',
        fit: 'excellent',
        reason: 'IC leadership without managing people. Technical decision-making and mentorship.'
      });
      titles.push({
        title: 'Senior Software Engineer',
        fit: 'good',
        reason: 'Solid IC role with ownership. Choose smaller companies for more scope.'
      });
    }
    if (seniority === 'staff' || seniority === 'principal') {
      titles.push({
        title: 'Principal Engineer',
        fit: 'excellent',
        reason: 'Top of IC ladder. Architecture-level decisions, org-wide impact.'
      });
    }
    titles.push({
      title: 'Tech Lead (IC-flavored)',
      fit: 'good',
      reason: 'Technical leadership without full management. Best of both if done right.'
    });
  }
  
  // Management track
  if (track === 'management') {
    titles.push({
      title: 'Engineering Manager',
      fit: 'excellent',
      reason: 'People leadership. Build teams, grow engineers, remove blockers.'
    });
    if (seniority === 'staff' || seniority === 'principal') {
      titles.push({
        title: 'Director of Engineering',
        fit: 'good',
        reason: 'Lead managers, set strategy. More organizational influence.'
      });
      titles.push({
        title: 'VP of Engineering',
        fit: 'worth_considering',
        reason: 'Executive scope. Big org impact but further from the work.'
      });
    }
  }
  
  // Hybrid track
  if (track === 'hybrid') {
    titles.push({
      title: 'Tech Lead',
      fit: 'excellent',
      reason: 'Technical leadership with some people aspects. Hands-on but influential.'
    });
    titles.push({
      title: 'Staff Engineer',
      fit: 'excellent',
      reason: 'High IC impact with mentorship. Technical decisions without full management.'
    });
    titles.push({
      title: 'Engineering Lead',
      fit: 'good',
      reason: 'Varies by company. Usually tech-leaning management or management-leaning IC.'
    });
  }
  
  // Anchor-specific additions
  if (anchor === 'challenge') {
    titles.push({
      title: 'Platform Engineer',
      fit: 'good',
      reason: 'Hard infrastructure problems. Deep technical work with wide impact.'
    });
  }
  
  if (anchor === 'autonomy') {
    titles.push({
      title: 'Independent Consultant',
      fit: 'worth_considering',
      reason: 'Maximum autonomy. Trade stability for freedom. Not for everyone.'
    });
  }
  
  return titles.slice(0, 5);
}

function generateAvoidTitles(
  psychology: PsychologyProfile,
  answers: Record<string, string[]>
): string[] {
  const avoid: string[] = [];
  const anchor = psychology.careerAnchor?.primary;
  const frustrated = answers.q3_frustrated || [];
  
  // Autonomy anchor avoids oversight roles
  if (anchor === 'autonomy') {
    avoid.push('Support Engineer (reactive, ticket-driven)');
    avoid.push('Program Manager (coordination-heavy)');
  }
  
  // Technical anchor avoids people-heavy roles
  if (anchor === 'technical_competence') {
    avoid.push('Engineering Manager (unless you want it)');
    avoid.push('Solutions Engineer (often too client-facing)');
  }
  
  // Challenge anchor avoids maintenance
  if (anchor === 'challenge') {
    avoid.push('Maintenance/Support roles');
    avoid.push('Roles with "support multiple teams" in JD');
  }
  
  // Frustration-based avoids
  if (frustrated.includes('meetings')) {
    avoid.push('Program Manager');
    avoid.push('Technical Program Manager');
    avoid.push('Roles mentioning "stakeholder management"');
  }
  
  if (frustrated.includes('politics')) {
    avoid.push('Roles with unclear reporting structures');
    avoid.push('Matrix organization roles');
  }
  
  return Array.from(new Set(avoid)).slice(0, 5);
}

function generateLookFor(
  psychology: PsychologyProfile
): string[] {
  const lookFor: string[] = [];
  const anchor = psychology.careerAnchor?.primary;
  const sdt = psychology.sdt;
  
  // Universal positives
  lookFor.push('"Own end-to-end" - you own the full problem');
  
  // Anchor-based
  if (anchor === 'autonomy') {
    lookFor.push('"Work autonomously" or "self-directed"');
    lookFor.push('"Results-oriented" or "outcome-focused"');
    lookFor.push('"Minimal meetings" or "async-first"');
  } else if (anchor === 'challenge') {
    lookFor.push('"Hard problems" or "technical challenges"');
    lookFor.push('"Greenfield" or "build from scratch"');
    lookFor.push('"Architecture decisions" or "system design"');
  } else if (anchor === 'security') {
    lookFor.push('"Established processes" or "stable team"');
    lookFor.push('"Long-term roadmap" or "clear priorities"');
    lookFor.push('"Work-life balance" or "sustainable pace"');
  } else if (anchor === 'technical_competence') {
    lookFor.push('"Technical leadership" or "technical direction"');
    lookFor.push('"Deep expertise" or "specialization"');
    lookFor.push('"Engineering excellence" or "craft"');
  } else if (anchor === 'lifestyle') {
    lookFor.push('"Flexible schedule" or "remote-friendly"');
    lookFor.push('"No on-call" or "sustainable hours"');
    lookFor.push('"Unlimited PTO" (check if actually used)');
  }
  
  // SDT-based
  if (sdt?.primaryUnmetNeed === 'competence') {
    lookFor.push('"Growth opportunities" or "learning budget"');
    lookFor.push('"Mentorship" or "career development"');
  } else if (sdt?.primaryUnmetNeed === 'relatedness') {
    lookFor.push('"Collaborative team" or "pair programming"');
    lookFor.push('"Team-first culture" or "we succeed together"');
  }
  
  return Array.from(new Set(lookFor)).slice(0, 6);
}

function generateAvoid(
  psychology: PsychologyProfile,
  answers: Record<string, string[]>
): string[] {
  const avoid: string[] = [];
  const anchor = psychology.careerAnchor?.primary;
  const frustrated = answers.q3_frustrated || [];
  
  // Anchor-based
  if (anchor === 'autonomy') {
    avoid.push('"Daily standups" or "frequent check-ins"');
    avoid.push('"Structured environment" or "process-heavy"');
    avoid.push('"Collaborative decision-making" (code for slow)');
  } else if (anchor === 'challenge') {
    avoid.push('"Support multiple teams" or "cross-functional"');
    avoid.push('"Maintain existing systems" or "legacy"');
  } else if (anchor === 'lifestyle') {
    avoid.push('"Fast-paced" or "hustle"');
    avoid.push('"Passionate team" (often means long hours)');
    avoid.push('"24/7" or "on-call rotation"');
  }
  
  // Frustration-based
  if (frustrated.includes('meetings')) {
    avoid.push('"Heavy stakeholder interaction"');
    avoid.push('"Cross-functional coordination"');
  }
  
  if (frustrated.includes('micromanagement')) {
    avoid.push('"Detailed documentation required"');
    avoid.push('"Regular status updates"');
  }
  
  if (frustrated.includes('chaos')) {
    avoid.push('"Rapidly changing priorities"');
    avoid.push('"Wear many hats"');
  }
  
  return Array.from(new Set(avoid)).slice(0, 6);
}

function generateResponsibilities(
  psychology: PsychologyProfile,
  answers: Record<string, string[]>
): IdealJobProfile['responsibilities'] {
  const seek: string[] = [];
  const avoid: string[] = [];
  const anchor = psychology.careerAnchor?.primary;
  const energizers = answers.q5_energy || [];
  
  // Energy-based seeking
  if (energizers.includes('deep_work')) {
    seek.push('Focus time for complex problem-solving');
    avoid.push('Constant context-switching');
  }
  if (energizers.includes('collaboration')) {
    seek.push('Team projects and pair programming');
  }
  if (energizers.includes('learning')) {
    seek.push('Exposure to new technologies and domains');
  }
  if (energizers.includes('leading')) {
    seek.push('Mentorship and technical leadership');
  }
  if (energizers.includes('autonomy')) {
    seek.push('End-to-end ownership of projects');
    avoid.push('Ticket-driven work');
  }
  if (energizers.includes('helping')) {
    seek.push('Enabling other engineers to succeed');
  }
  
  // Anchor-based
  if (anchor === 'technical_competence') {
    seek.push('Architecture and design decisions');
    avoid.push('Heavy people management');
  }
  if (anchor === 'challenge') {
    seek.push('Novel, unsolved problems');
    avoid.push('Routine maintenance');
  }
  if (anchor === 'autonomy') {
    seek.push('Freedom to choose approach and tools');
    avoid.push('Prescribed methodologies');
  }
  
  return {
    seek: Array.from(new Set(seek)).slice(0, 5),
    avoid: Array.from(new Set(avoid)).slice(0, 4)
  };
}

function generateInterviewQuestions(
  psychology: PsychologyProfile,
  answers: Record<string, string[]>
): string[] {
  const questions: string[] = [];
  const anchor = psychology.careerAnchor?.primary;
  const frustrated = answers.q3_frustrated || [];
  const currentManager = answers.ctx_manager?.[0];
  
  // Universal questions
  questions.push('What does a typical week look like for someone in this role?');
  questions.push('How do you measure success in this position?');
  
  // Anchor-based
  if (anchor === 'autonomy') {
    questions.push('How much freedom do engineers have in choosing their approach to problems?');
    questions.push('What decisions can I make without getting approval?');
  } else if (anchor === 'challenge') {
    questions.push('What\'s the hardest technical problem your team has solved recently?');
    questions.push('How do you prioritize technical excellence vs. shipping speed?');
  } else if (anchor === 'security') {
    questions.push('What\'s the average tenure on this team?');
    questions.push('How often do priorities change significantly?');
  } else if (anchor === 'lifestyle') {
    questions.push('How often do people work outside of regular hours?');
    questions.push('What does "flexibility" actually look like day-to-day?');
  }
  
  // Frustration-based
  if (frustrated.includes('meetings')) {
    questions.push('How much of the day is typically spent in meetings?');
    questions.push('Do you have any meeting-free days?');
  }
  
  if (frustrated.includes('micromanagement') || currentManager === 'micromanager') {
    questions.push('How do managers here balance oversight with autonomy?');
    questions.push('How often would I be checking in with my manager?');
  }
  
  if (frustrated.includes('no_feedback')) {
    questions.push('How does feedback work here? How will I know if I\'m doing well?');
  }
  
  if (frustrated.includes('dead_end')) {
    questions.push('What does career growth look like for this role?');
    questions.push('Can you tell me about someone who\'s grown in this team?');
  }
  
  return Array.from(new Set(questions)).slice(0, 6);
}

