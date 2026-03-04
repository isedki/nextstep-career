import { callAI, useSessionStore } from '../session';
import { CareerProfile, Diagnosis } from '../types';
import { Job } from '../jobs/api';
import { Expectations } from '../expectations/store';
import { 
  WhatMattersGuidance, 
  KeyPoint, 
  InterviewQuestion, 
  Flag 
} from '../resume/types';
import { generateFallbackWhatMatters } from './question-bank';

// ============================================
// What Matters Generation - Main Entry Point
// ============================================

export async function generateWhatMatters(
  job: Job,
  profile: CareerProfile,
  expectations?: Expectations
): Promise<WhatMattersGuidance> {
  const { hasAIKey } = useSessionStore.getState();

  if (hasAIKey()) {
    return generateAIWhatMatters(job, profile, expectations);
  }
  
  return generateFallbackWhatMatters(job, profile, expectations);
}

// ============================================
// AI-Powered Generation
// ============================================

async function generateAIWhatMatters(
  job: Job,
  profile: CareerProfile,
  expectations?: Expectations
): Promise<WhatMattersGuidance> {
  const systemPrompt = buildWhatMattersSystemPrompt(profile, expectations);
  const userPrompt = buildWhatMattersUserPrompt(job, profile);

  const response = await callAI([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ], 1500);

  if (response.error) {
    console.warn('AI what-matters failed, using fallback:', response.error);
    return generateFallbackWhatMatters(job, profile, expectations);
  }

  try {
    return parseAIWhatMatters(response.content);
  } catch {
    console.warn('Failed to parse AI what-matters, using fallback');
    return generateFallbackWhatMatters(job, profile, expectations);
  }
}

function buildWhatMattersSystemPrompt(
  profile: CareerProfile,
  expectations?: Expectations
): string {
  const diagnoses = profile.diagnoses.map(d => d.issue).join(', ');
  const anchor = profile.psychology.careerAnchor.primary;
  const sdt = profile.psychology.sdt;

  return `You are a career coach helping someone prepare for a job interview. Create personalized guidance based on their profile.

CANDIDATE PROFILE:
- Career Anchor: ${anchor}
- Holland Type: ${profile.psychology.holland.code}
- Diagnosed Issues: ${diagnoses || 'None identified'}
- Primary Unmet Need: ${sdt.primaryUnmetNeed || 'balanced'}
- Autonomy: ${sdt.autonomy}, Competence: ${sdt.competence}, Relatedness: ${sdt.relatedness}
${expectations ? `
EXPECTATIONS:
- Remote Preference: ${expectations.workLife.remotePreference}
- Max Hours: ${expectations.workLife.maxHours}
- Management Interest: ${expectations.roleLevel.managementInterest}
- Salary Target: ${expectations.salary.target ? '$' + expectations.salary.target : 'Not specified'}
` : ''}

Respond in valid JSON:
{
  "keyPoints": [{"point": "...", "reason": "...", "priority": "must_mention|good_to_mention|if_time"}],
  "questionsToAsk": [{"question": "...", "why": "...", "category": "autonomy|growth|culture|workload|management|technical|compensation"}],
  "redFlags": [{"signal": "...", "explanation": "...", "severity": "critical|warning|note"}],
  "greenFlags": [{"signal": "...", "explanation": "...", "severity": "critical|warning|note"}],
  "salaryTips": ["..."]
}`;
}

function buildWhatMattersUserPrompt(
  job: Job,
  profile: CareerProfile
): string {
  return `Generate interview guidance for this job:

JOB: ${job.title} at ${job.company}
DESCRIPTION: ${job.description.slice(0, 1000)}
REQUIREMENTS: ${job.requirements.slice(0, 5).join(', ')}

Based on my diagnosed issues (${profile.diagnoses.map(d => d.issue).join(', ') || 'none'}), what should I watch out for?

Provide:
1. 3-4 key points to emphasize about myself
2. 5-6 questions to ask them (based on my concerns)
3. 3-4 red flags to watch for
4. 3-4 green flags to look for
5. 2-3 salary negotiation tips`;
}

function parseAIWhatMatters(content: string): WhatMattersGuidance {
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON found');
  }

  const parsed = JSON.parse(jsonMatch[0]);

  return {
    keyPoints: (parsed.keyPoints || []).map((k: { point: string; reason: string; priority: string }) => ({
      point: k.point,
      reason: k.reason,
      priority: k.priority || 'good_to_mention'
    })),
    questionsToAsk: (parsed.questionsToAsk || []).map((q: { question: string; why: string; category: string }) => ({
      question: q.question,
      why: q.why,
      category: q.category || 'culture'
    })),
    redFlags: (parsed.redFlags || []).map((f: { signal: string; explanation: string; severity: string }) => ({
      signal: f.signal,
      explanation: f.explanation,
      severity: f.severity || 'warning'
    })),
    greenFlags: (parsed.greenFlags || []).map((f: { signal: string; explanation: string; severity: string }) => ({
      signal: f.signal,
      explanation: f.explanation,
      severity: f.severity || 'note'
    })),
    salaryTips: parsed.salaryTips || [],
    source: 'ai'
  };
}
