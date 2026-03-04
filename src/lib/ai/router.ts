// AI Router - Routes requests to the appropriate AI provider based on available keys

export type AIProvider = 'openai' | 'anthropic' | 'none';

interface AIConfig {
  provider: AIProvider;
  model: string;
  apiKey: string;
}

export function getAIConfig(apiKeys: { openai?: string; anthropic?: string }): AIConfig | null {
  // Prefer OpenAI if available
  if (apiKeys.openai) {
    return {
      provider: 'openai',
      model: 'gpt-4-turbo-preview',
      apiKey: apiKeys.openai
    };
  }
  
  // Fall back to Anthropic
  if (apiKeys.anthropic) {
    return {
      provider: 'anthropic',
      model: 'claude-3-sonnet-20240229',
      apiKey: apiKeys.anthropic
    };
  }
  
  return null;
}

// System prompts for different use cases
export const systemPrompts = {
  careerCoach: `You are an expert career coach with deep knowledge of organizational psychology. 
You help people understand their work-related challenges using frameworks like:
- Self-Determination Theory (autonomy, competence, relatedness)
- Job Demands-Resources model
- Career Anchors (Schein)
- Holland RIASEC
- Maslach Burnout Inventory
- Big Five personality traits

Be warm, insightful, and educational. Help users understand WHY they feel the way they do about work.
Keep responses concise but meaningful. Use plain language while teaching psychological concepts.`,

  insightEnhancer: `You are a career psychology expert. Given a user's assessment results, 
generate a personalized, insightful explanation for why they feel a certain way about work.
Be specific to their profile. Reference relevant psychological frameworks.
Keep it to 2-3 sentences. Be empathetic but direct.`,

  questionGenerator: `You are a career assessment expert. Based on the user's previous answers,
generate a relevant follow-up question that helps dig deeper into their work situation.
The question should be scenario-based, not abstract. Provide 3-4 answer options.
Format as JSON: { "question": "...", "options": ["...", "...", "..."] }`
};

// Placeholder for actual API calls - would be implemented with the respective SDKs
export async function generateAIResponse(
  config: AIConfig,
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  // This would make actual API calls
  // For now, return a placeholder indicating AI is available
  console.log(`AI Request to ${config.provider}:`, { systemPrompt, userMessage });
  
  return `[AI-enhanced response would appear here using ${config.provider}]`;
}

// Check if AI is available
export function isAIAvailable(apiKeys: { openai?: string; anthropic?: string }): boolean {
  return !!apiKeys.openai || !!apiKeys.anthropic;
}

