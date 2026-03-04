import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================
// API Keys Management
// ============================================

export interface APIKeys {
  openai: string | null;
  anthropic: string | null;
}

export interface SessionState {
  userId: string | null;
  apiKeys: APIKeys;
  initSession: () => void;
  setAPIKey: (provider: 'openai' | 'anthropic', key: string | null) => void;
  setApiKey: (provider: 'openai' | 'anthropic', key: string) => void; // Alias
  removeApiKey: (provider: 'openai' | 'anthropic') => void;
  clearAPIKeys: () => void;
  hasAIKey: () => boolean;
  getPreferredProvider: () => 'openai' | 'anthropic' | null;
}

// Generate a unique user ID for this session
function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      userId: null,
      apiKeys: {
        openai: null,
        anthropic: null
      },

      initSession: () => {
        const state = get();
        if (!state.userId) {
          set({ userId: generateUserId() });
        }
      },

      setAPIKey: (provider, key) => {
        set((state) => ({
          apiKeys: {
            ...state.apiKeys,
            [provider]: key || null
          }
        }));
      },

      // Alias for settings page
      setApiKey: (provider, key) => {
        set((state) => ({
          apiKeys: {
            ...state.apiKeys,
            [provider]: key
          }
        }));
      },

      removeApiKey: (provider) => {
        set((state) => ({
          apiKeys: {
            ...state.apiKeys,
            [provider]: null
          }
        }));
      },

      clearAPIKeys: () => {
        set({
          apiKeys: {
            openai: null,
            anthropic: null
          }
        });
      },

      hasAIKey: () => {
        const { apiKeys } = get();
        return Boolean(apiKeys.openai || apiKeys.anthropic);
      },

      getPreferredProvider: () => {
        const { apiKeys } = get();
        if (apiKeys.anthropic) return 'anthropic';
        if (apiKeys.openai) return 'openai';
        return null;
      }
    }),
    {
      name: 'nextstep-session',
      partialize: (state) => ({
        userId: state.userId,
        apiKeys: state.apiKeys
      })
    }
  )
);

// ============================================
// AI Service Helper
// ============================================

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  content: string;
  provider: 'openai' | 'anthropic';
  error?: string;
}

export async function callAI(
  messages: AIMessage[],
  maxTokens: number = 1000
): Promise<AIResponse> {
  const { apiKeys, getPreferredProvider } = useSessionStore.getState();
  const provider = getPreferredProvider();

  if (!provider) {
    return {
      content: '',
      provider: 'openai',
      error: 'No API key configured. Please add your OpenAI or Claude key in settings.'
    };
  }

  const apiKey = apiKeys[provider];

  try {
    if (provider === 'openai') {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          max_tokens: maxTokens,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error?.message || `OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        content: data.choices[0]?.message?.content || '',
        provider: 'openai'
      };
    } else {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey!,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: maxTokens,
          system: messages.find(m => m.role === 'system')?.content,
          messages: messages
            .filter(m => m.role !== 'system')
            .map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error?.message || `Anthropic API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        content: data.content[0]?.text || '',
        provider: 'anthropic'
      };
    }
  } catch (error) {
    return {
      content: '',
      provider,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
