'use client';

import { workstyleQuestions } from '@/lib/assessment/questions';
import { DeepDiveLayout } from '@/components/assessment/DeepDiveLayout';

export default function WorkStyleDeepDivePage() {
  return (
    <DeepDiveLayout
      title="Work Style"
      emoji="🧠"
      description="This assessment explores your personality traits as they relate to work preferences using the Big Five (OCEAN) model. Understanding whether you're more introverted or extraverted, how you handle change, and your preferred environment helps match you with compatible workplace cultures."
      questions={workstyleQuestions}
      phase="workstyle"
    />
  );
}

