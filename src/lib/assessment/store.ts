'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AssessmentState } from '../types';
import { coreQuestions, contextQuestions } from './questions';

interface AssessmentStore extends AssessmentState {
  // Actions
  setAnswer: (questionId: string, optionIds: string[]) => void;
  setTextAnswer: (questionId: string, text: string) => void;
  toggleOption: (questionId: string, optionId: string, type: 'single' | 'multi' | 'scale' | 'ranking', maxSelections?: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  completePhase: (phase: string) => void;
  reset: () => void;
  
  // Computed
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  
  // Helpers
  getUserName: () => string;
}

const initialState: AssessmentState = {
  currentPhase: 'context',
  answers: {},
  textAnswers: {},
  startedAt: new Date(),
  completedPhases: []
};

export const useAssessmentStore = create<AssessmentStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      currentQuestionIndex: 0,

      setAnswer: (questionId: string, optionIds: string[]) => {
        set((state) => ({
          answers: {
            ...state.answers,
            [questionId]: optionIds
          }
        }));
      },

      setTextAnswer: (questionId: string, text: string) => {
        set((state) => ({
          textAnswers: {
            ...state.textAnswers,
            [questionId]: text
          }
        }));
      },

      toggleOption: (questionId: string, optionId: string, type: 'single' | 'multi' | 'scale' | 'ranking', maxSelections?: number) => {
        set((state) => {
          const currentSelections = state.answers[questionId] || [];
          
          if (type === 'single' || type === 'scale') {
            return {
              answers: {
                ...state.answers,
                [questionId]: [optionId]
              }
            };
          }
          
          // Multi-select
          if (currentSelections.includes(optionId)) {
            // Remove
            return {
              answers: {
                ...state.answers,
                [questionId]: currentSelections.filter(id => id !== optionId)
              }
            };
          } else {
            // Add if under limit
            if (!maxSelections || currentSelections.length < maxSelections) {
              return {
                answers: {
                  ...state.answers,
                  [questionId]: [...currentSelections, optionId]
                }
              };
            }
          }
          
          return state;
        });
      },

      setCurrentQuestionIndex: (index: number) => {
        set({ currentQuestionIndex: index });
      },

      nextQuestion: () => {
        const { currentQuestionIndex, currentPhase } = get();
        const questions = currentPhase === 'context' ? contextQuestions : 
                         currentPhase === 'core' ? coreQuestions : [];
        
        if (currentQuestionIndex < questions.length - 1) {
          set({ currentQuestionIndex: currentQuestionIndex + 1 });
        }
      },

      previousQuestion: () => {
        const { currentQuestionIndex } = get();
        if (currentQuestionIndex > 0) {
          set({ currentQuestionIndex: currentQuestionIndex - 1 });
        }
      },

      completePhase: (phase: string) => {
        set((state) => ({
          completedPhases: [...state.completedPhases, phase]
        }));
      },

      reset: () => {
        set({
          ...initialState,
          startedAt: new Date(),
          currentQuestionIndex: 0
        });
      },

      getUserName: () => {
        const { textAnswers } = get();
        return textAnswers['ctx_name'] || 'there';
      }
    }),
    {
      name: 'nextstep-assessment',
      partialize: (state) => ({
        answers: state.answers,
        textAnswers: state.textAnswers,
        currentPhase: state.currentPhase,
        completedPhases: state.completedPhases,
        currentQuestionIndex: state.currentQuestionIndex
      })
    }
  )
);

