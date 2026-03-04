// ============================================
// Assessment Types
// ============================================

export interface QuestionOption {
  id: string;
  text: string;
  signals: Record<string, number>; // Maps to psychology framework dimensions
}

export interface Question {
  id: string;
  phase: 'context' | 'core' | 'burnout' | 'workstyle' | 'motivators' | 'skills';
  text: string;
  subtext?: string;
  type: 'single' | 'multi' | 'scale' | 'ranking' | 'text';
  options?: QuestionOption[];
  maxSelections?: number; // For multi-select
  required?: boolean;
  placeholder?: string; // For text inputs
  conditionalOn?: {
    questionId: string;
    answerIds: string[];
  };
}

export interface Answer {
  questionId: string;
  selectedOptions: string[];
  timestamp: Date;
}

export interface AssessmentState {
  currentPhase: 'context' | 'core' | 'burnout' | 'workstyle' | 'motivators' | 'skills' | 'complete';
  answers: Record<string, string[]>; // questionId -> selected option ids
  textAnswers: Record<string, string>; // For text inputs like name
  startedAt: Date;
  completedPhases: string[];
}

// ============================================
// Psychology Framework Types
// ============================================

// Self-Determination Theory
export interface SDTProfile {
  autonomy: 'unmet' | 'partial' | 'met';
  competence: 'unmet' | 'partial' | 'met';
  relatedness: 'unmet' | 'partial' | 'met';
  primaryUnmetNeed: 'autonomy' | 'competence' | 'relatedness' | null;
}

// Job Demands-Resources Model
export interface JDRProfile {
  demands: string[]; // High demands
  missingResources: string[]; // Missing resources
  imbalanceScore: number; // 0-100
  imbalanceType: 'demand_overload' | 'resource_depletion' | 'balanced';
}

// Maslach Burnout
export interface BurnoutProfile {
  exhaustion: number; // 0-100
  cynicism: number; // 0-100
  inefficacy: number; // 0-100
  level: 'low' | 'moderate' | 'high' | 'severe';
  primaryDimension: 'exhaustion' | 'cynicism' | 'inefficacy' | null;
}

// Career Anchors (Schein)
export type CareerAnchor = 
  | 'technical_competence'
  | 'management'
  | 'autonomy'
  | 'security'
  | 'entrepreneurial'
  | 'service'
  | 'challenge'
  | 'lifestyle';

export interface CareerAnchorProfile {
  primary: CareerAnchor;
  secondary: CareerAnchor | null;
  scores: Record<CareerAnchor, number>;
}

// Holland RIASEC
export type HollandType = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
export const HollandTypeNames: Record<HollandType, string> = {
  R: 'Realistic',
  I: 'Investigative',
  A: 'Artistic',
  S: 'Social',
  E: 'Enterprising',
  C: 'Conventional'
};

export interface HollandProfile {
  primary: HollandType;
  secondary: HollandType;
  tertiary: HollandType;
  code: string; // e.g., "ISA"
  scores: Record<HollandType, number>;
}

// Big Five (simplified for work context)
export interface BigFiveProfile {
  extraversion: 'low' | 'moderate' | 'high';
  openness: 'low' | 'moderate' | 'high';
  conscientiousness: 'low' | 'moderate' | 'high';
  agreeableness: 'low' | 'moderate' | 'high';
  neuroticism: 'low' | 'moderate' | 'high';
}

// Flow Theory
export interface FlowProfile {
  triggers: string[]; // What puts them in flow
  drains: string[]; // What exhausts them
  optimalChallenge: 'low' | 'medium' | 'high';
}

// ============================================
// Diagnosis Types
// ============================================

export interface DiagnosisEvidence {
  signal: string;
  source: string; // Question ID or deep dive name
  userAnswer: string;
}

export interface Diagnosis {
  issue: string;
  issueId: string;
  category: string; // Category for matching with user quotes
  severity?: 'critical' | 'moderate' | 'low';
  confidence: 'high' | 'medium' | 'low';
  evidence: DiagnosisEvidence[];
  explanation: string; // Psychology-backed explanation
  screeningQuestions: string[]; // Interview questions to avoid this issue
}

export type DiagnosisCategory = 
  | 'micromanagement'
  | 'absent_direction'
  | 'toxic_manager'
  | 'no_growth'
  | 'burnout'
  | 'undervalued'
  | 'wrong_fit'
  | 'culture_mismatch'
  | 'chaos_instability';

// ============================================
// Profile Types
// ============================================

export interface Insight {
  type: 'why_hate' | 'why_love' | 'why_feel';
  title: string;
  explanation: string;
  frameworkBasis: string[];
}

export interface PsychologyProfile {
  sdt: SDTProfile;
  jdr: JDRProfile;
  burnout: BurnoutProfile;
  careerAnchor: CareerAnchorProfile;
  holland: HollandProfile;
  bigFive: BigFiveProfile;
  flow: FlowProfile;
}

export interface CareerProfile {
  // Core data
  trigger: string[];
  priority: string;
  tradeoffStyle: string;
  role: string;
  urgency: string;
  
  // Psychology profile
  psychology: PsychologyProfile;
  
  // Diagnoses
  diagnoses: Diagnosis[];
  notDiagnosed: string[]; // Issues we checked but didn't find
  
  // Insights
  insights: Insight[];
  
  // Completion
  completedSections: string[];
  completionPercentage: number;
}

// ============================================
// Skills Types
// ============================================

export type SkillLevel = 'learning' | 'working' | 'proven' | 'expert';
export type SkillDifficulty = 'quick' | 'medium' | 'showstopper';

export interface Skill {
  name: string;
  level: SkillLevel;
  evidence: string[];
  difficulty: SkillDifficulty;
  category: string;
}

export interface SkillsProfile {
  skills: Skill[];
  wantToDevelop: string[];
  gaps: { skill: string; difficulty: SkillDifficulty; timeToAcquire: string }[];
}

// ============================================
// Benchmarks Types
// ============================================

export interface MarketBenchmark {
  matchingDomains: { name: string; fit: 'high' | 'moderate' | 'low'; openRoles: number }[];
  salaryRange: { min: number; max: number; currency: string };
  remotePercentage: number;
  topLocations: string[];
  trendingRoles: { title: string; growth: number; fit: 'high' | 'moderate' | 'low'; skillGap: string | null }[];
}

