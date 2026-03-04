// ============================================
// Resume Types
// ============================================

export interface WorkExperience {
  title: string;
  company: string;
  duration?: string;
  highlights: string[];
}

export interface ResumeData {
  rawText: string;
  parsedSections?: {
    summary?: string;
    experience: WorkExperience[];
    skills: string[];
    education?: string[];
  };
  savedAt?: Date;
}

export interface ResumeAnalysis {
  strengths: string[];
  gaps: string[];
  suggestions: ResumeSuggestion[];
  keywordsToAdd: string[];
  alignmentScore: number;
  summary?: string;
  source: 'ai' | 'fallback';
}

export interface ResumeSuggestion {
  section: 'summary' | 'experience' | 'skills' | 'education' | 'general';
  priority: 'high' | 'medium' | 'low';
  advice: string;
  example?: string;
}

export interface ResumeAnalysisResult {
  success: boolean;
  analysis?: ResumeAnalysis;
  error?: string;
}

// ============================================
// Cover Letter Types
// ============================================

export interface CoverLetterResult {
  success: boolean;
  content?: string;
  error?: string;
  source: 'ai' | 'template';
  metadata?: {
    jobTitle: string;
    company: string;
    generatedAt: Date;
  };
}

export interface CoverLetterInput {
  jobTitle: string;
  company: string;
  jobDescription: string;
  jobRequirements: string[];
}

// ============================================
// What Matters Types
// ============================================

export interface WhatMattersGuidance {
  keyPoints: KeyPoint[];
  questionsToAsk: InterviewQuestion[];
  redFlags: Flag[];
  greenFlags: Flag[];
  salaryTips: string[];
  source: 'ai' | 'rule_based';
}

export interface KeyPoint {
  point: string;
  reason: string;
  priority: 'must_mention' | 'good_to_mention' | 'if_time';
}

export interface InterviewQuestion {
  question: string;
  why: string;
  category: 'autonomy' | 'growth' | 'culture' | 'workload' | 'management' | 'technical' | 'compensation';
}

export interface Flag {
  signal: string;
  explanation: string;
  severity: 'critical' | 'warning' | 'note';
}
