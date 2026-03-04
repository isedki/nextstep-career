'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Question } from '@/lib/types';
import { useAssessmentStore } from '@/lib/assessment/store';
import { QuestionCard } from './QuestionCard';
import { OptionSelector } from './OptionSelector';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface DeepDiveLayoutProps {
  title: string;
  emoji: string;
  description: string;
  questions: Question[];
  phase: string;
}

export function DeepDiveLayout({ title, emoji, description, questions, phase }: DeepDiveLayoutProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  const { answers, toggleOption, completePhase } = useAssessmentStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentQuestion = questions[currentIndex];
  const selectedOptions = answers[currentQuestion?.id] || [];
  const isLastQuestion = currentIndex === questions.length - 1;
  const canProceed = selectedOptions.length > 0 || !currentQuestion?.required;

  const handleSelect = (optionId: string) => {
    toggleOption(
      currentQuestion.id,
      optionId,
      currentQuestion.type as 'single' | 'multi' | 'scale' | 'ranking',
      currentQuestion.maxSelections
    );
  };

  const handleNext = () => {
    if (isLastQuestion) {
      completePhase(phase);
      router.push('/profile');
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSkip = () => {
    if (isLastQuestion) {
      completePhase(phase);
      router.push('/profile');
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="p-4 border-b">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link 
            href="/profile"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Profile</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xl">{emoji}</span>
            <span className="font-semibold">{title}</span>
          </div>
          <div className="w-24" />
        </div>
      </header>

      {/* Progress */}
      <div className="max-w-3xl mx-auto w-full px-4 py-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>{title} Assessment</span>
          <span>{currentIndex + 1} / {questions.length}</span>
        </div>
        <Progress value={((currentIndex + 1) / questions.length) * 100} className="h-2" />
      </div>

      {/* Intro (on first question) */}
      {currentIndex === 0 && (
        <div className="max-w-3xl mx-auto w-full px-4 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground"
          >
            {description}
          </motion.div>
        </div>
      )}

      {/* Question Content */}
      <main className="flex-1 flex flex-col justify-center px-4 py-8">
        <div className="max-w-3xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <QuestionCard
                question={currentQuestion}
                currentIndex={currentIndex}
                totalQuestions={questions.length}
              />

              <OptionSelector
                options={currentQuestion.options || []}
                selectedIds={selectedOptions}
                onSelect={handleSelect}
                type={currentQuestion.type as 'single' | 'multi'}
                maxSelections={currentQuestion.maxSelections}
              />

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={currentIndex === 0}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>

                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className="text-muted-foreground"
                >
                  Skip
                </Button>

                <Button onClick={handleNext} disabled={!canProceed}>
                  {isLastQuestion ? 'Finish' : 'Next'}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center border-t">
        <p className="text-xs text-muted-foreground">
          Your answers are stored locally and help personalize your profile.
        </p>
      </footer>
    </div>
  );
}

