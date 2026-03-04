'use client';

import { skillsQuestions } from '@/lib/assessment/questions';
import { DeepDiveLayout } from '@/components/assessment/DeepDiveLayout';

export default function SkillsDeepDivePage() {
  return (
    <DeepDiveLayout
      title="Skills Assessment"
      emoji="🛠️"
      description="This assessment helps map your current skills and identify areas for growth. Understanding both your strengths and skill gaps helps prioritize learning and find roles that match your capabilities while offering growth opportunities."
      questions={skillsQuestions}
      phase="skills"
    />
  );
}

