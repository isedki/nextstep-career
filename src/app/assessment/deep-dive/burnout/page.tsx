'use client';

import { burnoutQuestions } from '@/lib/assessment/questions';
import { DeepDiveLayout } from '@/components/assessment/DeepDiveLayout';

export default function BurnoutDeepDivePage() {
  return (
    <DeepDiveLayout
      title="Burnout Analysis"
      emoji="🔥"
      description="This assessment measures your current burnout level using the Job Demands-Resources model and Maslach Burnout Inventory principles. Understanding your demands and available resources helps identify what's driving exhaustion and what interventions might help."
      questions={burnoutQuestions}
      phase="burnout"
    />
  );
}

