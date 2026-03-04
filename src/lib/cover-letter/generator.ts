import { callAI, useSessionStore } from '../session';
import { CareerProfile } from '../types';
import { Job } from '../jobs/api';
import { CoverLetterResult, CoverLetterInput } from '../resume/types';
import { generateFallbackCoverLetter } from './templates';

// ============================================
// Cover Letter Generation - Main Entry Point
// ============================================

export async function generateCoverLetter(
  job: Job,
  profile: CareerProfile,
  resumeText: string,
  userName?: string
): Promise<CoverLetterResult> {
  const { hasAIKey } = useSessionStore.getState();

  const input: CoverLetterInput = {
    jobTitle: job.title,
    company: job.company,
    jobDescription: job.description,
    jobRequirements: job.requirements
  };

  if (hasAIKey()) {
    return generateAICoverLetter(input, profile, resumeText, userName);
  }
  
  return generateFallbackCoverLetter(input, profile, resumeText, userName);
}

// ============================================
// AI-Powered Generation
// ============================================

async function generateAICoverLetter(
  input: CoverLetterInput,
  profile: CareerProfile,
  resumeText: string,
  userName?: string
): Promise<CoverLetterResult> {
  const systemPrompt = buildCoverLetterSystemPrompt(profile);
  const userPrompt = buildCoverLetterUserPrompt(input, profile, resumeText, userName);

  const response = await callAI([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ], 1200);

  if (response.error) {
    console.warn('AI cover letter failed, using fallback:', response.error);
    return generateFallbackCoverLetter(input, profile, resumeText, userName);
  }

  return {
    success: true,
    content: response.content.trim(),
    source: 'ai',
    metadata: {
      jobTitle: input.jobTitle,
      company: input.company,
      generatedAt: new Date()
    }
  };
}

function buildCoverLetterSystemPrompt(profile: CareerProfile): string {
  const anchor = profile.psychology.careerAnchor.primary;
  const anchorDescriptions: Record<string, string> = {
    'technical_competence': 'values deep expertise and technical mastery',
    'management': 'thrives in leadership and team coordination',
    'autonomy': 'values independence and self-direction',
    'security': 'values stability and long-term growth',
    'entrepreneurial': 'driven by innovation and building new things',
    'service': 'motivated by helping others and making impact',
    'challenge': 'energized by complex problems and obstacles',
    'lifestyle': 'prioritizes work-life balance and flexibility'
  };

  return `You are an expert career coach helping someone write a compelling, personalized cover letter.

CANDIDATE PROFILE:
- Career Anchor: ${anchor} - ${anchorDescriptions[anchor] || anchor}
- Holland Type: ${profile.psychology.holland.code}
- Flow Triggers: ${profile.psychology.flow.triggers.slice(0, 3).join(', ')}
- Key Priority: ${profile.priority || 'growth'}

WRITING GUIDELINES:
1. Keep it to 3 paragraphs maximum
2. Lead with genuine interest - connect their profile to the company/role
3. Highlight 2-3 relevant achievements from their resume
4. Show how their values (career anchor) align with the role
5. Close with enthusiasm but NOT desperation
6. Avoid clichés like "I'm a perfect fit" or "I'm passionate about"
7. Be specific and concrete, not generic
8. Use a professional but warm tone

OUTPUT:
Write ONLY the cover letter body (no headers, addresses, or signatures). The letter should flow naturally and feel authentic.`;
}

function buildCoverLetterUserPrompt(
  input: CoverLetterInput,
  profile: CareerProfile,
  resumeText: string,
  userName?: string
): string {
  return `Write a cover letter for this application:

JOB: ${input.jobTitle} at ${input.company}

JOB DESCRIPTION:
${input.jobDescription.slice(0, 1500)}

KEY REQUIREMENTS:
${input.jobRequirements.slice(0, 5).map(r => `- ${r}`).join('\n')}

RESUME HIGHLIGHTS:
${resumeText.slice(0, 1500)}

${userName ? `CANDIDATE NAME: ${userName}` : ''}

Write the cover letter body now. Remember: 3 paragraphs max, specific to this role, connect to their career profile.`;
}
