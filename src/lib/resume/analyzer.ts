import { callAI, useSessionStore } from '../session';
import { CareerProfile } from '../types';
import { IdealJobProfile } from '../recommendations/job-profile';
import { 
  ResumeAnalysis, 
  ResumeAnalysisResult, 
  ResumeSuggestion 
} from './types';

// ============================================
// Resume Analysis - Main Entry Point
// ============================================

export async function analyzeResume(
  resumeText: string,
  profile: CareerProfile,
  jobProfile?: IdealJobProfile
): Promise<ResumeAnalysisResult> {
  if (!resumeText.trim()) {
    return {
      success: false,
      error: 'Please paste your resume text to analyze.'
    };
  }

  const { hasAIKey } = useSessionStore.getState();

  if (hasAIKey()) {
    return analyzeResumeWithAI(resumeText, profile, jobProfile);
  }
  
  return analyzeResumeFallback(resumeText, profile, jobProfile);
}

// ============================================
// AI-Powered Analysis
// ============================================

async function analyzeResumeWithAI(
  resumeText: string,
  profile: CareerProfile,
  jobProfile?: IdealJobProfile
): Promise<ResumeAnalysisResult> {
  const systemPrompt = buildAnalysisSystemPrompt(profile, jobProfile);
  const userPrompt = buildAnalysisUserPrompt(resumeText, profile, jobProfile);

  const response = await callAI([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ], 1500);

  if (response.error) {
    // Fallback to rule-based if AI fails
    console.warn('AI analysis failed, using fallback:', response.error);
    return analyzeResumeFallback(resumeText, profile, jobProfile);
  }

  try {
    const parsed = parseAIResponse(response.content);
    return {
      success: true,
      analysis: {
        ...parsed,
        source: 'ai'
      }
    };
  } catch {
    console.warn('Failed to parse AI response, using fallback');
    return analyzeResumeFallback(resumeText, profile, jobProfile);
  }
}

function buildAnalysisSystemPrompt(
  profile: CareerProfile,
  jobProfile?: IdealJobProfile
): string {
  return `You are an expert career coach and resume analyst. Analyze resumes for alignment with the candidate's career profile and target roles.

CANDIDATE PROFILE:
- Career Anchor: ${profile.psychology.careerAnchor.primary}
- Holland Type: ${profile.psychology.holland.code} (${profile.psychology.holland.primary})
- Primary Need: ${profile.psychology.sdt.primaryUnmetNeed || 'balanced'}
- Flow Triggers: ${profile.psychology.flow.triggers.join(', ')}

${jobProfile ? `TARGET ROLES: ${jobProfile.idealTitles.map(t => t.title).join(', ')}

WHAT TO LOOK FOR IN JD: ${jobProfile.lookFor.slice(0, 3).join(', ')}
WHAT TO AVOID: ${jobProfile.avoid.slice(0, 3).join(', ')}` : ''}

Respond in valid JSON with this exact structure:
{
  "strengths": ["string", "string", ...],
  "gaps": ["string", "string", ...],
  "suggestions": [
    {"section": "summary|experience|skills|general", "priority": "high|medium|low", "advice": "string"}
  ],
  "keywordsToAdd": ["string", ...],
  "alignmentScore": 0-100,
  "summary": "One sentence summary of resume fit"
}`;
}

function buildAnalysisUserPrompt(
  resumeText: string,
  _profile: CareerProfile,
  _jobProfile?: IdealJobProfile
): string {
  return `Analyze this resume:

---
${resumeText.slice(0, 4000)}
---

Provide:
1. 3-5 strengths that align with my profile
2. 2-4 gaps or missing elements for my target roles
3. 3-5 specific suggestions with priority and section
4. 5-10 keywords I should add based on target roles
5. Overall alignment score (0-100)
6. One sentence summary`;
}

function parseAIResponse(content: string): Omit<ResumeAnalysis, 'source'> {
  // Try to extract JSON from the response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON found in response');
  }

  const parsed = JSON.parse(jsonMatch[0]);

  return {
    strengths: parsed.strengths || [],
    gaps: parsed.gaps || [],
    suggestions: (parsed.suggestions || []).map((s: { section: string; priority: string; advice: string }) => ({
      section: s.section || 'general',
      priority: s.priority || 'medium',
      advice: s.advice
    })),
    keywordsToAdd: parsed.keywordsToAdd || [],
    alignmentScore: Math.min(100, Math.max(0, parsed.alignmentScore || 50)),
    summary: parsed.summary
  };
}

// ============================================
// Rule-Based Fallback Analysis
// ============================================

function analyzeResumeFallback(
  resumeText: string,
  profile: CareerProfile,
  jobProfile?: IdealJobProfile
): ResumeAnalysisResult {
  const textLower = resumeText.toLowerCase();
  const strengths: string[] = [];
  const gaps: string[] = [];
  const suggestions: ResumeSuggestion[] = [];
  const keywordsToAdd: string[] = [];
  let alignmentScore = 50;

  // ========================================
  // Extract Keywords from Job Profile
  // ========================================
  const targetKeywords = jobProfile?.lookFor
    .flatMap(l => l.toLowerCase().split(/\s+/))
    .filter(w => w.length > 3) || [];

  const avoidKeywords = jobProfile?.avoid
    .flatMap(a => a.toLowerCase().split(/\s+/))
    .filter(w => w.length > 3) || [];

  // ========================================
  // Check for Presence of Key Sections
  // ========================================
  const hasSummary = /summary|objective|profile|about/i.test(resumeText);
  const _hasExperience = /experience|employment|work history/i.test(resumeText);
  const hasSkills = /skills|technologies|tools|proficiencies/i.test(resumeText);
  const _hasEducation = /education|degree|university|college/i.test(resumeText);

  if (!hasSummary) {
    suggestions.push({
      section: 'summary',
      priority: 'high',
      advice: 'Add a professional summary highlighting your key strengths and career focus'
    });
    gaps.push('Missing professional summary');
  }

  if (!hasSkills) {
    suggestions.push({
      section: 'skills',
      priority: 'high',
      advice: 'Add a dedicated skills section with relevant technologies and competencies'
    });
    gaps.push('Missing dedicated skills section');
  }

  // ========================================
  // Career Anchor Alignment
  // ========================================
  const anchor = profile.psychology.careerAnchor.primary;
  const anchorKeywords: Record<string, string[]> = {
    'technical_competence': ['expert', 'specialist', 'technical', 'architecture', 'deep dive'],
    'management': ['led', 'managed', 'team', 'stakeholders', 'cross-functional'],
    'autonomy': ['independent', 'self-directed', 'owned', 'end-to-end'],
    'security': ['stable', 'consistent', 'reliable', 'long-term'],
    'entrepreneurial': ['founded', 'launched', 'built', 'startup', 'initiative'],
    'service': ['helped', 'mentored', 'supported', 'enabled', 'customer'],
    'challenge': ['complex', 'difficult', 'challenging', 'innovative', 'solved'],
    'lifestyle': ['remote', 'flexible', 'balance']
  };

  const relevantKeywords = anchorKeywords[anchor] || [];
  const foundAnchorKeywords = relevantKeywords.filter(k => textLower.includes(k));
  
  if (foundAnchorKeywords.length > 0) {
    strengths.push(`Resume shows ${anchor.replace('_', ' ')} focus: ${foundAnchorKeywords.join(', ')}`);
    alignmentScore += 5;
  } else {
    const missingKeywords = relevantKeywords.slice(0, 3);
    keywordsToAdd.push(...missingKeywords);
    suggestions.push({
      section: 'experience',
      priority: 'medium',
      advice: `Add language that reflects your ${anchor.replace('_', ' ')} career anchor. Try words like: ${missingKeywords.join(', ')}`
    });
  }

  // ========================================
  // Holland Type Alignment
  // ========================================
  const holland = profile.psychology.holland.primary;
  const hollandKeywords: Record<string, string[]> = {
    'R': ['built', 'implemented', 'deployed', 'configured', 'installed'],
    'I': ['analyzed', 'researched', 'investigated', 'designed', 'developed'],
    'A': ['created', 'designed', 'innovated', 'conceptualized'],
    'S': ['trained', 'mentored', 'collaborated', 'facilitated'],
    'E': ['led', 'negotiated', 'persuaded', 'sold', 'pitched'],
    'C': ['organized', 'documented', 'maintained', 'tracked', 'processed']
  };

  const hollandWords = hollandKeywords[holland] || [];
  const foundHollandWords = hollandWords.filter(w => textLower.includes(w));
  
  if (foundHollandWords.length >= 2) {
    strengths.push(`Strong action verbs matching your ${holland} profile`);
    alignmentScore += 5;
  }

  // ========================================
  // Job Profile Keywords
  // ========================================
  if (jobProfile) {
    const foundTargetKeywords = targetKeywords.filter(k => textLower.includes(k));
    const foundAvoidKeywords = avoidKeywords.filter(k => textLower.includes(k));

    if (foundTargetKeywords.length >= 3) {
      strengths.push(`Resume includes key terms for target roles: ${foundTargetKeywords.slice(0, 3).join(', ')}`);
      alignmentScore += 10;
    } else {
      const missing = targetKeywords.filter(k => !textLower.includes(k)).slice(0, 5);
      keywordsToAdd.push(...missing);
    }

    if (foundAvoidKeywords.length > 0) {
      gaps.push(`Resume mentions areas you want to avoid: ${foundAvoidKeywords.slice(0, 2).join(', ')}`);
      alignmentScore -= 5;
    }

    // Check for ideal titles
    const mentionedTitles = jobProfile.idealTitles.filter(t => 
      textLower.includes(t.title.toLowerCase())
    );
    if (mentionedTitles.length > 0) {
      strengths.push(`Mentions relevant roles: ${mentionedTitles.map(t => t.title).join(', ')}`);
      alignmentScore += 5;
    }
  }

  // ========================================
  // Quantified Achievements
  // ========================================
  const hasNumbers = /\d+%|\d+x|\$\d+|\d+\s*(users|customers|team|people|million|k\b)/i.test(resumeText);
  if (hasNumbers) {
    strengths.push('Includes quantified achievements');
    alignmentScore += 5;
  } else {
    suggestions.push({
      section: 'experience',
      priority: 'high',
      advice: 'Add quantified achievements (e.g., "increased performance by 40%", "led team of 5")'
    });
    gaps.push('Missing quantified achievements');
  }

  // ========================================
  // Length Check
  // ========================================
  const wordCount = resumeText.split(/\s+/).length;
  if (wordCount < 150) {
    suggestions.push({
      section: 'general',
      priority: 'high',
      advice: 'Resume appears too short. Expand on your experiences and achievements.'
    });
    gaps.push('Resume too brief');
    alignmentScore -= 10;
  } else if (wordCount > 1500) {
    suggestions.push({
      section: 'general',
      priority: 'medium',
      advice: 'Consider condensing - aim for 1-2 pages of focused content'
    });
  }

  // ========================================
  // Standard Suggestions
  // ========================================
  if (!textLower.includes('impact') && !textLower.includes('result')) {
    suggestions.push({
      section: 'experience',
      priority: 'medium',
      advice: 'Focus bullet points on impact and results, not just responsibilities'
    });
  }

  // Normalize score
  alignmentScore = Math.min(100, Math.max(0, alignmentScore));

  // Generate summary
  const summaryParts = [];
  if (alignmentScore >= 70) {
    summaryParts.push('Good alignment with your profile');
  } else if (alignmentScore >= 50) {
    summaryParts.push('Moderate alignment');
  } else {
    summaryParts.push('Needs improvement for target roles');
  }
  
  if (gaps.length > 0) {
    summaryParts.push(`${gaps.length} areas to improve`);
  }

  return {
    success: true,
    analysis: {
      strengths: strengths.slice(0, 5),
      gaps: gaps.slice(0, 4),
      suggestions: suggestions.slice(0, 5),
      keywordsToAdd: Array.from(new Set(keywordsToAdd)).slice(0, 10),
      alignmentScore,
      summary: summaryParts.join('. ') + '.',
      source: 'fallback'
    }
  };
}

// ============================================
// Resume Store
// ============================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ResumeData } from './types';

interface ResumeStore {
  resume: ResumeData | null;
  setResume: (text: string) => void;
  clearResume: () => void;
  hasResume: () => boolean;
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      resume: null,

      setResume: (text: string) => {
        set({
          resume: {
            rawText: text,
            savedAt: new Date()
          }
        });
      },

      clearResume: () => {
        set({ resume: null });
      },

      hasResume: () => {
        return Boolean(get().resume?.rawText);
      }
    }),
    {
      name: 'nextstep-resume',
      partialize: (state) => ({
        resume: state.resume
      })
    }
  )
);
