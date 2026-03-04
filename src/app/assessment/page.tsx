'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { coreQuestions, contextQuestions } from '@/lib/assessment/questions';
import { useAssessmentStore } from '@/lib/assessment/store';
import { QuestionCard } from '@/components/assessment/QuestionCard';
import { OptionSelector } from '@/components/assessment/OptionSelector';
import { ProgressBar } from '@/components/assessment/ProgressBar';
import { NavigationButtons } from '@/components/assessment/NavigationButtons';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AssessmentPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<'context' | 'core'>('context');
  const [localQuestionIndex, setLocalQuestionIndex] = useState(0);
  
  const {
    answers,
    textAnswers,
    toggleOption,
    setTextAnswer,
  } = useAssessmentStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const questions = phase === 'context' ? contextQuestions : coreQuestions;
  const currentQuestion = questions[localQuestionIndex];
  
  const selectedOptions = answers[currentQuestion?.id] || [];
  const textValue = textAnswers[currentQuestion?.id] || '';

  const canGoBack = localQuestionIndex > 0 || phase === 'core';
  const canGoNext = currentQuestion?.type === 'text' 
    ? textValue.trim().length > 0 
    : selectedOptions.length > 0;
  const isLastQuestion = localQuestionIndex === questions.length - 1;

  const handleNext = async () => {
    if (isLastQuestion && phase === 'core') {
      setIsLoading(true);
      // Navigate to AI opt-in page before profile
      router.push('/assessment/complete');
    } else if (isLastQuestion && phase === 'context') {
      // Transition to core questions
      setPhase('core');
      setLocalQuestionIndex(0);
    } else {
      setLocalQuestionIndex(localQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (localQuestionIndex > 0) {
      setLocalQuestionIndex(localQuestionIndex - 1);
    } else if (phase === 'core') {
      // Go back to last context question
      setPhase('context');
      setLocalQuestionIndex(contextQuestions.length - 1);
    }
  };

  const handleSelect = (optionId: string) => {
    toggleOption(
      currentQuestion.id,
      optionId,
      currentQuestion.type as 'single' | 'multi' | 'scale' | 'ranking',
      currentQuestion.maxSelections
    );
  };

  const handleTextChange = (value: string) => {
    setTextAnswer(currentQuestion.id, value);
  };

  // Don't render until mounted to avoid hydration issues with zustand persist
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Calculate total progress
  const totalQuestions = contextQuestions.length + coreQuestions.length;
  const currentProgress = phase === 'context' 
    ? localQuestionIndex + 1 
    : contextQuestions.length + localQuestionIndex + 1;

  const userName = textAnswers['ctx_name'] || '';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-4 border-b">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link 
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Exit</span>
          </Link>
          <span className="text-sm font-medium">NextStep</span>
          <div className="w-16" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center px-4 py-8">
        <div className="max-w-4xl mx-auto w-full">
          <ProgressBar
            current={currentProgress}
            total={totalQuestions}
            phase={phase}
          />

          {/* Phase indicator */}
          <div className="text-center mb-4">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              {phase === 'context' ? 'Getting to know you' : 'Understanding your situation'}
              {userName && phase === 'core' && ` • Hi ${userName}!`}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${phase}-${currentQuestion.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <QuestionCard
                question={currentQuestion}
                currentIndex={localQuestionIndex}
                totalQuestions={questions.length}
                userName={phase === 'core' ? userName : undefined}
              />

              {currentQuestion.type === 'text' ? (
                <div className="mt-8 max-w-md mx-auto">
                  <input
                    type="text"
                    value={textValue}
                    onChange={(e) => handleTextChange(e.target.value)}
                    placeholder={currentQuestion.placeholder || 'Type here...'}
                    className="w-full px-6 py-4 text-xl bg-background border-2 border-border rounded-xl focus:border-primary focus:outline-none transition-colors text-center"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && canGoNext) {
                        handleNext();
                      }
                    }}
                  />
                </div>
              ) : (
                <OptionSelector
                  options={currentQuestion.options || []}
                  selectedIds={selectedOptions}
                  onSelect={handleSelect}
                  type={currentQuestion.type as 'single' | 'multi'}
                  maxSelections={currentQuestion.maxSelections}
                />
              )}

              <NavigationButtons
                onBack={handleBack}
                onNext={handleNext}
                canGoBack={canGoBack}
                canGoNext={canGoNext}
                isLastQuestion={isLastQuestion && phase === 'core'}
                isLoading={isLoading}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer note */}
      <footer className="p-4 text-center">
        <p className="text-xs text-muted-foreground">
          Your answers are saved locally and never shared without your permission.
        </p>
      </footer>
    </div>
  );
}
