'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================
// Expectations Types
// ============================================

export interface SalaryExpectations {
  currency: string;
  min: number | null;
  target: number | null;
  stretch: number | null;
  flexibility: 'firm' | 'negotiable' | 'flexible';
}

export interface WorkLifeExpectations {
  maxHours: number;
  flexibilityNeed: 'critical' | 'important' | 'nice_to_have' | 'indifferent';
  remotePreference: 'required' | 'preferred' | 'flexible' | 'onsite_ok' | 'onsite_preferred';
  travelTolerance: 'none' | 'minimal' | 'occasional' | 'regular';
  timezoneFlexibility: 'own_tz' | 'nearby' | 'some_overlap' | 'any';
}

export interface RoleLevelExpectations {
  seniorityTarget: 'same' | 'up_one' | 'skip' | 'down_ok' | 'flexible';
  managementInterest: 'ic_only' | 'lead_ok' | 'manager' | 'senior_mgmt' | 'either';
  scopePreference: 'deep_narrow' | 'broad_shallow' | 'strategic' | 'tactical' | 'varies';
  teamSizePreference: 'tiny' | 'small' | 'medium' | 'large' | 'any';
  ownershipLevel: 'full' | 'shared' | 'contributor' | 'support';
}

export interface Expectations {
  salary: SalaryExpectations;
  workLife: WorkLifeExpectations;
  roleLevel: RoleLevelExpectations;
  completedAt: Date | null;
}

interface ExpectationsState {
  expectations: Expectations;
  currentStep: number;
  isComplete: boolean;
}

interface ExpectationsActions {
  setSalaryExpectation: <K extends keyof SalaryExpectations>(
    key: K,
    value: SalaryExpectations[K]
  ) => void;
  setWorkLifeExpectation: <K extends keyof WorkLifeExpectations>(
    key: K,
    value: WorkLifeExpectations[K]
  ) => void;
  setRoleLevelExpectation: <K extends keyof RoleLevelExpectations>(
    key: K,
    value: RoleLevelExpectations[K]
  ) => void;
  setCurrentStep: (step: number) => void;
  completeExpectations: () => void;
  resetExpectations: () => void;
  getExpectations: () => Expectations;
  hasExpectations: () => boolean;
}

type ExpectationsStore = ExpectationsState & ExpectationsActions;

// ============================================
// Default Values
// ============================================

const defaultSalary: SalaryExpectations = {
  currency: 'USD',
  min: null,
  target: null,
  stretch: null,
  flexibility: 'negotiable'
};

const defaultWorkLife: WorkLifeExpectations = {
  maxHours: 40,
  flexibilityNeed: 'important',
  remotePreference: 'flexible',
  travelTolerance: 'minimal',
  timezoneFlexibility: 'nearby'
};

const defaultRoleLevel: RoleLevelExpectations = {
  seniorityTarget: 'same',
  managementInterest: 'either',
  scopePreference: 'varies',
  teamSizePreference: 'any',
  ownershipLevel: 'shared'
};

const initialState: ExpectationsState = {
  expectations: {
    salary: defaultSalary,
    workLife: defaultWorkLife,
    roleLevel: defaultRoleLevel,
    completedAt: null
  },
  currentStep: 0,
  isComplete: false
};

// ============================================
// Store
// ============================================

export const useExpectationsStore = create<ExpectationsStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setSalaryExpectation: (key, value) => {
        set((state) => ({
          expectations: {
            ...state.expectations,
            salary: {
              ...state.expectations.salary,
              [key]: value
            }
          }
        }));
      },

      setWorkLifeExpectation: (key, value) => {
        set((state) => ({
          expectations: {
            ...state.expectations,
            workLife: {
              ...state.expectations.workLife,
              [key]: value
            }
          }
        }));
      },

      setRoleLevelExpectation: (key, value) => {
        set((state) => ({
          expectations: {
            ...state.expectations,
            roleLevel: {
              ...state.expectations.roleLevel,
              [key]: value
            }
          }
        }));
      },

      setCurrentStep: (step) => {
        set({ currentStep: step });
      },

      completeExpectations: () => {
        set((state) => ({
          expectations: {
            ...state.expectations,
            completedAt: new Date()
          },
          isComplete: true
        }));
      },

      resetExpectations: () => {
        set(initialState);
      },

      getExpectations: () => {
        return get().expectations;
      },

      hasExpectations: () => {
        const { expectations } = get();
        return expectations.completedAt !== null;
      }
    }),
    {
      name: 'nextstep-expectations',
      partialize: (state) => ({
        expectations: state.expectations,
        currentStep: state.currentStep,
        isComplete: state.isComplete
      })
    }
  )
);

// ============================================
// Helper Functions
// ============================================

export function formatSalary(amount: number | null, currency: string): string {
  if (amount === null) return 'Not set';
  
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$',
    CHF: 'Fr',
    INR: '₹',
    SGD: 'S$'
  };
  
  const symbol = symbols[currency] || currency;
  return `${symbol}${amount.toLocaleString()}`;
}

export function getRemoteLabel(pref: WorkLifeExpectations['remotePreference']): string {
  const labels: Record<typeof pref, string> = {
    required: 'Fully Remote (Required)',
    preferred: 'Remote Preferred',
    flexible: 'Hybrid OK',
    onsite_ok: 'On-site OK',
    onsite_preferred: 'On-site Preferred'
  };
  return labels[pref];
}

export function getSeniorityLabel(target: RoleLevelExpectations['seniorityTarget']): string {
  const labels: Record<typeof target, string> = {
    same: 'Same Level',
    up_one: 'One Level Up',
    skip: 'Skip Level',
    down_ok: 'Down OK',
    flexible: 'Flexible'
  };
  return labels[target];
}
