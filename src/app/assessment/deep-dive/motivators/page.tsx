'use client';

import { motivatorsQuestions } from '@/lib/assessment/questions';
import { DeepDiveLayout } from '@/components/assessment/DeepDiveLayout';

export default function MotivatorsDeepDivePage() {
  return (
    <DeepDiveLayout
      title="Motivators"
      emoji="⚓"
      description="This assessment uses Self-Determination Theory (SDT) and Edgar Schein's Career Anchors model to identify what truly drives you. Your career anchor is the one thing you would be least willing to give up in your career - understanding this helps predict job satisfaction and make better career decisions."
      questions={motivatorsQuestions}
      phase="motivators"
    />
  );
}

