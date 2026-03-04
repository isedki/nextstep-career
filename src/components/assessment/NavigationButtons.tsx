'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

interface NavigationButtonsProps {
  onBack: () => void;
  onNext: () => void;
  canGoBack: boolean;
  canGoNext: boolean;
  isLastQuestion: boolean;
  isLoading?: boolean;
}

export function NavigationButtons({
  onBack,
  onNext,
  canGoBack,
  canGoNext,
  isLastQuestion,
  isLoading = false
}: NavigationButtonsProps) {
  return (
    <div className="flex justify-between items-center mt-8 max-w-2xl mx-auto">
      <Button
        variant="ghost"
        onClick={onBack}
        disabled={!canGoBack}
        className="gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      <Button
        onClick={onNext}
        disabled={!canGoNext || isLoading}
        className="gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing...
          </>
        ) : isLastQuestion ? (
          <>
            See My Profile
            <ArrowRight className="w-4 h-4" />
          </>
        ) : (
          <>
            Continue
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </Button>
    </div>
  );
}

