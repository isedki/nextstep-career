'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Sparkles, User, Loader2 } from 'lucide-react';
import { useAssessmentStore } from '@/lib/assessment/store';
import { useSessionStore, callAI, AIMessage } from '@/lib/session';
import { generateCareerProfile } from '@/lib/profile/generator';
import { getCoachingSystemPrompt, getSuggestedQuestions } from '@/lib/ai/insights';
import { CareerProfile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<CareerProfile | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { answers } = useAssessmentStore();
  const { hasAIKey, initSession, getPreferredProvider } = useSessionStore();

  useEffect(() => {
    setMounted(true);
    initSession();
  }, [initSession]);

  useEffect(() => {
    if (mounted) {
      const hasAnswers = Object.keys(answers).length >= 7;
      
      if (!hasAnswers) {
        router.push('/assessment');
        return;
      }

      if (!hasAIKey()) {
        router.push('/settings');
        return;
      }

      const generatedProfile = generateCareerProfile(answers);
      setProfile(generatedProfile);

      // Add welcome message
      setMessages([{
        role: 'assistant',
        content: `Hi! I'm your AI career coach. I've analyzed your profile and I'm here to help you think through your next steps.\n\nI noticed you're dealing with ${generatedProfile.diagnoses[0]?.issue || 'some challenges'} and prioritizing ${generatedProfile.priority.replace('_', ' ')}. What would you like to explore first?`,
        timestamp: new Date()
      }]);
    }
  }, [mounted, answers, router, hasAIKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !profile) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const systemPrompt = getCoachingSystemPrompt(profile);
      
      // Build conversation history
      const conversationHistory: AIMessage[] = [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage.content }
      ];

      const response = await callAI(conversationHistory, 1000);

      if (response.error) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `I'm having trouble connecting to the AI service. Error: ${response.error}\n\nPlease check your API key in settings or try again later.`,
          timestamp: new Date()
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: response.content,
          timestamp: new Date()
        }]);
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I encountered an error. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  if (!mounted || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const suggestedQuestions = getSuggestedQuestions(profile);
  const provider = getPreferredProvider();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link 
            href="/profile"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Profile</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-semibold">Career Coach</span>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Powered by {provider === 'anthropic' ? 'Claude' : 'ChatGPT'}
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card className={`p-4 ${
                  message.role === 'user' 
                    ? 'bg-primary/5 border-primary/20 ml-12' 
                    : 'bg-card mr-12'
                }`}>
                  <div className="flex gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user' 
                        ? 'bg-primary/10' 
                        : 'bg-accent/10'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="w-4 h-4 text-primary" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-accent" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground mb-1">
                        {message.role === 'user' ? 'You' : 'AI Coach'}
                      </p>
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        {message.content.split('\n').map((paragraph, i) => (
                          <p key={i} className={i > 0 ? 'mt-2' : ''}>
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-muted-foreground ml-4"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Thinking...</span>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Suggested Questions - show only when few messages */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs text-muted-foreground mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <footer className="sticky bottom-0 border-t bg-background p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Ask about your career transition..."
              className="flex-1 px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              disabled={isLoading}
            />
            <Button onClick={handleSend} disabled={!input.trim() || isLoading}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-2">
            AI responses are for guidance only. Always verify important career decisions.
          </p>
        </div>
      </footer>
    </div>
  );
}

