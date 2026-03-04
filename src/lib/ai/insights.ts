import { CareerProfile } from '../types';
import { callAI, AIMessage } from '../session';
import { getTriggerLabel, getPriorityLabel } from '../profile/generator';

// ============================================
// AI Insight Generation
// ============================================

export interface AIInsight {
  title: string;
  content: string;
  category: 'diagnosis' | 'psychology' | 'career' | 'action';
}

export async function generateAIInsights(profile: CareerProfile): Promise<AIInsight[]> {
  const systemPrompt = `You are a career psychologist and coach. Analyze the user's career profile and provide personalized, actionable insights.

Be warm but direct. Use psychology research to back up observations. Focus on practical next steps.

Format your response as JSON array with exactly 3 insights:
[
  { "title": "Short Title", "content": "2-3 sentence insight with practical advice", "category": "diagnosis|psychology|career|action" }
]

Only return the JSON array, no other text.`;

  const userPrompt = `Career Profile Summary:
- Triggers for change: ${profile.trigger.map(t => getTriggerLabel(t)).join(', ')}
- Top priority: ${getPriorityLabel(profile.priority)}
- Tradeoff style: ${profile.tradeoffStyle}
- Career anchor: ${profile.psychology.careerAnchor.primary.replace('_', ' ')}
- Holland type: ${profile.psychology.holland.code}
- Primary unmet need: ${profile.psychology.sdt.primaryUnmetNeed || 'None identified'}
- Burnout level: ${profile.psychology.burnout?.level || 'Unknown'}
- Key diagnoses: ${profile.diagnoses.map(d => d.issue).join(', ') || 'None'}

Generate 3 personalized insights that would help this person in their career transition.`;

  const messages: AIMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];

  try {
    const response = await callAI(messages, 800);
    
    if (response.error) {
      console.error('AI Error:', response.error);
      return getDefaultInsights(profile);
    }

    const parsed = JSON.parse(response.content);
    return parsed as AIInsight[];
  } catch (error) {
    console.error('Failed to parse AI insights:', error);
    return getDefaultInsights(profile);
  }
}

// Fallback insights when AI is unavailable
function getDefaultInsights(profile: CareerProfile): AIInsight[] {
  const insights: AIInsight[] = [];

  // Diagnosis-based insight
  if (profile.diagnoses.length > 0) {
    insights.push({
      title: 'Address the Root Cause',
      content: `Your profile suggests ${profile.diagnoses[0].issue} may be a primary concern. Rather than just finding a new job, consider interviewing companies specifically about how they handle this issue. Use the screening questions we provided to dig deeper.`,
      category: 'diagnosis'
    });
  }

  // Psychology-based insight
  if (profile.psychology.careerAnchor.primary) {
    const anchorInsight: Record<string, string> = {
      autonomy: "You value independence highly - look for roles with remote options, flexible hours, or results-based evaluation rather than time-tracking.",
      security: "Stability matters to you - prioritize established companies with clear processes, even if it means slower growth.",
      challenge: "You thrive on hard problems - seek roles where you'll be pushed, even if they feel intimidating at first.",
      lifestyle: "Work-life integration is key for you - be explicit about boundaries in interviews; the right company will respect them.",
      technical: "Deep expertise drives you - look for companies that value IC tracks as much as management paths.",
      management: "Leading teams energizes you - consider companies with clear leadership development programs.",
      service: "Meaningful impact motivates you - research company mission and real-world outcomes, not just perks.",
      entrepreneurial: "Building new things excites you - consider early-stage startups or innovation teams within larger companies."
    };

    insights.push({
      title: `Your Career Anchor: ${profile.psychology.careerAnchor.primary.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
      content: anchorInsight[profile.psychology.careerAnchor.primary] || "Understanding your career anchor helps prioritize what matters most in your next role.",
      category: 'psychology'
    });
  }

  // Action-based insight
  insights.push({
    title: 'Your Next Step',
    content: `Based on your priority of "${getPriorityLabel(profile.priority)}", start by making a list of 10 companies known for this. Research on Glassdoor, Blind, and LinkedIn. Quality over quantity - you want 3-5 strong applications, not 50 spray-and-pray ones.`,
    category: 'action'
  });

  return insights;
}

// ============================================
// Career Coaching Prompts
// ============================================

export function getCoachingSystemPrompt(profile: CareerProfile): string {
  return `You are an empathetic career coach with expertise in organizational psychology. You're helping someone navigate a career transition.

Their profile:
- Triggers: ${profile.trigger.map(t => getTriggerLabel(t)).join(', ')}
- Priority: ${getPriorityLabel(profile.priority)}
- Career anchor: ${profile.psychology.careerAnchor.primary.replace('_', ' ')}
- Holland type: ${profile.psychology.holland.code} (${getHollandDescription(profile.psychology.holland.primary)})
- Diagnosed issues: ${profile.diagnoses.map(d => d.issue).join(', ') || 'None major'}

Guidelines:
1. Be warm but direct - don't sugarcoat, but be supportive
2. Reference their specific profile data when relevant
3. Use psychology research to back observations
4. Keep responses concise (2-4 paragraphs max)
5. End with a question or actionable next step
6. If they ask about salaries, remind them to check the salary benchmarks in their profile

You're having a conversation, not giving a lecture. Ask clarifying questions if needed.`;
}

function getHollandDescription(type: string): string {
  const descriptions: Record<string, string> = {
    R: 'Realistic - practical, hands-on',
    I: 'Investigative - analytical, curious',
    A: 'Artistic - creative, expressive',
    S: 'Social - helping, teaching',
    E: 'Enterprising - leading, persuading',
    C: 'Conventional - organizing, detailed'
  };
  return descriptions[type] || type;
}

// ============================================
// Coaching Conversation Starters
// ============================================

export function getSuggestedQuestions(profile: CareerProfile): string[] {
  const questions: string[] = [
    "What should I focus on in my job search?",
    "How do I explain my reason for leaving to recruiters?",
    "What questions should I ask in interviews?",
  ];

  if (profile.diagnoses.length > 0) {
    questions.push(`How do I avoid ${profile.diagnoses[0].issue} in my next role?`);
  }

  if (profile.psychology.burnout?.level === 'high' || profile.psychology.burnout?.level === 'severe') {
    questions.push("Should I take a break before job searching?");
  }

  if (profile.priority === 'pay_recognition') {
    questions.push("How do I negotiate a higher salary?");
  }

  return questions.slice(0, 4);
}

