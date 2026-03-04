'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles, Key, ArrowRight, Shield, MessageSquare, Lightbulb, Target, DollarSign, Clock, TrendingUp } from 'lucide-react';
import { useAssessmentStore } from '@/lib/assessment/store';
import { useSessionStore } from '@/lib/session';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function AssessmentCompletePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { answers, completePhase } = useAssessmentStore();
  const { apiKeys, initSession } = useSessionStore();

  useEffect(() => {
    setMounted(true);
    initSession();
    completePhase('core');
  }, [initSession, completePhase]);

  const hasAIKey = apiKeys.openai || apiKeys.anthropic;
  const questionCount = Object.keys(answers).length;

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Redirect if no answers
  if (questionCount < 7) {
    router.push('/assessment');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="p-4 border-b">
        <div className="max-w-2xl mx-auto flex items-center justify-center">
          <span className="font-semibold">NextStep</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full space-y-8">
          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-2xl font-bold">Core Assessment Complete!</h1>
            <p className="text-muted-foreground">
              You answered {questionCount} questions. Your basic profile is ready.
            </p>
          </motion.div>

          {/* View Profile Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/profile">
              <Button className="w-full py-6 text-lg" size="lg">
                View My Profile
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>

          {/* Set Expectations CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Target className="w-4 h-4 text-primary" />
                  Ready to find jobs?
                </div>
              </div>
              <CardContent className="p-4 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Set your expectations to get better job matches:
                </p>
                
                <div className="grid gap-2">
                  <div className="flex items-center gap-3 text-sm">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span>Salary expectations</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>Work-life balance preferences</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span>Role level and growth goals</span>
                  </div>
                </div>

                <Link href="/expectations">
                  <Button className="w-full" variant="outline">
                    Set Your Expectations
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* AI Enhancement Section */}
          {!hasAIKey && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    or enhance with AI
                  </span>
                </div>
              </div>

              <Card className="mt-6 overflow-hidden">
                <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Unlock AI-Enhanced Experience
                  </div>
                </div>
                <CardContent className="p-4 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Add your OpenAI or Claude API key to unlock:
                  </p>
                  
                  <div className="grid gap-3">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-4 h-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Personalized Insights</p>
                        <p className="text-xs text-muted-foreground">
                          AI explains your psychology profile in your context
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-4 h-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Career Coaching Chat</p>
                        <p className="text-xs text-muted-foreground">
                          Ask follow-up questions about your results
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Target className="w-4 h-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Job Search Advice</p>
                        <p className="text-xs text-muted-foreground">
                          Tailored recommendations based on your diagnosis
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link href="/settings">
                    <Button variant="outline" className="w-full">
                      <Key className="w-4 h-4 mr-2" />
                      Add API Key
                    </Button>
                  </Link>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                    <Shield className="w-3 h-3" />
                    Your key stays in your browser. We never see it.
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Already has AI key */}
          {hasAIKey && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-4 rounded-xl bg-accent/10 border border-accent/20 text-center"
            >
              <div className="flex items-center justify-center gap-2 text-accent">
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">AI Features Enabled</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Your profile will include AI-enhanced insights
              </p>
            </motion.div>
          )}

          {/* Skip link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <Link 
              href="/profile" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Continue without AI →
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

