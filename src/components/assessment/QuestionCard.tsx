'use client';

import { motion } from 'framer-motion';
import { Question } from '@/lib/types';

interface QuestionCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  userName?: string;
}

export function QuestionCard({ question, currentIndex, totalQuestions, userName }: QuestionCardProps) {
  // Personalize question text if userName is available
  const personalizedText = userName 
    ? question.text.replace(/\{name\}/g, userName)
    : question.text;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="text-center mb-8"
    >
      <div className="text-sm text-muted-foreground mb-4">
        Question {currentIndex + 1} of {totalQuestions}
      </div>
      
      <h2 className="text-2xl md:text-3xl font-semibold mb-3">
        {personalizedText}
      </h2>
      
      {question.subtext && (
        <p className="text-muted-foreground">
          {question.subtext}
        </p>
      )}
    </motion.div>
  );
}

