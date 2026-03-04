// ============================================
// Expectations Questions - Guided preferences for job search
// ============================================

export interface ExpectationQuestion {
  id: string;
  category: 'salary' | 'work_life' | 'role_level';
  text: string;
  subtext?: string;
  type: 'number' | 'select' | 'scale' | 'multi';
  options?: { id: string; text: string; value?: number | string }[];
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

// ============================================
// Salary Expectations
// ============================================

export const salaryQuestions: ExpectationQuestion[] = [
  {
    id: 'salary_currency',
    category: 'salary',
    text: "What currency do you think in?",
    type: 'select',
    options: [
      { id: 'usd', text: 'USD ($)', value: 'USD' },
      { id: 'eur', text: 'EUR (€)', value: 'EUR' },
      { id: 'gbp', text: 'GBP (£)', value: 'GBP' },
      { id: 'cad', text: 'CAD (C$)', value: 'CAD' },
      { id: 'aud', text: 'AUD (A$)', value: 'AUD' },
      { id: 'chf', text: 'CHF (Fr)', value: 'CHF' },
      { id: 'inr', text: 'INR (₹)', value: 'INR' },
      { id: 'sgd', text: 'SGD (S$)', value: 'SGD' }
    ]
  },
  {
    id: 'salary_min',
    category: 'salary',
    text: "What's your minimum acceptable salary?",
    subtext: "The floor - you wouldn't consider anything below this",
    type: 'number',
    placeholder: "e.g., 80000",
    min: 0,
    step: 5000,
    unit: '/year'
  },
  {
    id: 'salary_target',
    category: 'salary',
    text: "What's your target salary?",
    subtext: "A fair number you'd be happy with",
    type: 'number',
    placeholder: "e.g., 120000",
    min: 0,
    step: 5000,
    unit: '/year'
  },
  {
    id: 'salary_stretch',
    category: 'salary',
    text: "What's your stretch goal?",
    subtext: "If everything aligned perfectly",
    type: 'number',
    placeholder: "e.g., 150000",
    min: 0,
    step: 5000,
    unit: '/year'
  },
  {
    id: 'salary_flexibility',
    category: 'salary',
    text: "How flexible are you on salary?",
    type: 'select',
    options: [
      { id: 'firm', text: "Firm - won't go below minimum", value: 'firm' },
      { id: 'negotiable', text: "Negotiable - depends on other factors", value: 'negotiable' },
      { id: 'flexible', text: "Flexible - willing to trade for right fit", value: 'flexible' }
    ]
  }
];

// ============================================
// Work-Life Balance Expectations
// ============================================

export const workLifeQuestions: ExpectationQuestion[] = [
  {
    id: 'hours_max',
    category: 'work_life',
    text: "Maximum hours per week you're willing to work?",
    subtext: "Be honest - sustainable pace matters",
    type: 'scale',
    options: [
      { id: 'h35', text: '35 hours (strict boundaries)', value: 35 },
      { id: 'h40', text: '40 hours (standard)', value: 40 },
      { id: 'h45', text: '45 hours (some flexibility)', value: 45 },
      { id: 'h50', text: '50 hours (dedicated)', value: 50 },
      { id: 'h55plus', text: '55+ hours (mission-driven)', value: 55 }
    ]
  },
  {
    id: 'flexibility_need',
    category: 'work_life',
    text: "How important is schedule flexibility?",
    subtext: "Ability to set your own hours, take breaks, etc.",
    type: 'scale',
    options: [
      { id: 'critical', text: 'Critical - need full control', value: 'critical' },
      { id: 'important', text: 'Important - need some flexibility', value: 'important' },
      { id: 'nice', text: 'Nice to have - can work fixed hours', value: 'nice_to_have' },
      { id: 'indifferent', text: 'Indifferent - doesn\'t matter much', value: 'indifferent' }
    ]
  },
  {
    id: 'remote_preference',
    category: 'work_life',
    text: "Remote work preference?",
    type: 'select',
    options: [
      { id: 'fully_remote', text: 'Fully remote - non-negotiable', value: 'required' },
      { id: 'mostly_remote', text: 'Mostly remote (1-2 office days max)', value: 'preferred' },
      { id: 'hybrid', text: 'Hybrid is fine (2-3 office days)', value: 'flexible' },
      { id: 'onsite_ok', text: 'On-site is fine', value: 'onsite_ok' },
      { id: 'onsite_prefer', text: 'Prefer on-site actually', value: 'onsite_preferred' }
    ]
  },
  {
    id: 'travel_tolerance',
    category: 'work_life',
    text: "Travel tolerance?",
    type: 'select',
    options: [
      { id: 'none', text: 'No travel', value: 'none' },
      { id: 'minimal', text: 'Minimal (1-2 trips/year)', value: 'minimal' },
      { id: 'occasional', text: 'Occasional (monthly or so)', value: 'occasional' },
      { id: 'regular', text: 'Regular travel is fine', value: 'regular' }
    ]
  },
  {
    id: 'timezone_flexibility',
    category: 'work_life',
    text: "Can you handle async/cross-timezone work?",
    subtext: "Meetings at odd hours, async communication",
    type: 'select',
    options: [
      { id: 'own_tz', text: 'Prefer my timezone only', value: 'own_tz' },
      { id: 'nearby', text: 'Nearby timezones (+/- 3 hours)', value: 'nearby' },
      { id: 'some_overlap', text: 'Some overlap needed', value: 'some_overlap' },
      { id: 'any', text: 'Fully async is fine', value: 'any' }
    ]
  }
];

// ============================================
// Role Level Expectations
// ============================================

export const roleLevelQuestions: ExpectationQuestion[] = [
  {
    id: 'seniority_target',
    category: 'role_level',
    text: "What seniority level are you targeting?",
    type: 'select',
    options: [
      { id: 'same', text: 'Same level as now', value: 'same' },
      { id: 'up_one', text: 'One level up (promotion)', value: 'up_one' },
      { id: 'skip', text: 'Skip level (ambitious)', value: 'skip' },
      { id: 'down_ok', text: 'Down is OK for right role', value: 'down_ok' },
      { id: 'flexible', text: 'Flexible - title doesn\'t matter', value: 'flexible' }
    ]
  },
  {
    id: 'management_interest',
    category: 'role_level',
    text: "Interest in people management?",
    type: 'select',
    options: [
      { id: 'ic_only', text: 'IC only - no reports', value: 'ic_only' },
      { id: 'lead_ok', text: 'Tech lead (1-3 reports) is OK', value: 'lead_ok' },
      { id: 'manager', text: 'Want to manage a team', value: 'manager' },
      { id: 'senior_mgmt', text: 'Senior management / director', value: 'senior_mgmt' },
      { id: 'either', text: 'Either IC or management', value: 'either' }
    ]
  },
  {
    id: 'scope_preference',
    category: 'role_level',
    text: "Preferred scope of impact?",
    type: 'select',
    options: [
      { id: 'deep_narrow', text: 'Deep focus on one area', value: 'deep_narrow' },
      { id: 'broad_shallow', text: 'Broad, cross-functional', value: 'broad_shallow' },
      { id: 'strategic', text: 'Strategic, high-level', value: 'strategic' },
      { id: 'tactical', text: 'Tactical, hands-on execution', value: 'tactical' },
      { id: 'varies', text: 'Depends on the role', value: 'varies' }
    ]
  },
  {
    id: 'team_size_pref',
    category: 'role_level',
    text: "Preferred team size?",
    type: 'select',
    options: [
      { id: 'tiny', text: 'Tiny (2-5 people)', value: 'tiny' },
      { id: 'small', text: 'Small (5-15 people)', value: 'small' },
      { id: 'medium', text: 'Medium (15-50 people)', value: 'medium' },
      { id: 'large', text: 'Large (50+ people)', value: 'large' },
      { id: 'any', text: 'No preference', value: 'any' }
    ]
  },
  {
    id: 'ownership_level',
    category: 'role_level',
    text: "Level of ownership you want?",
    type: 'select',
    options: [
      { id: 'full', text: 'Full ownership - end-to-end responsibility', value: 'full' },
      { id: 'shared', text: 'Shared ownership - collaborative', value: 'shared' },
      { id: 'contributor', text: 'Contributor - clear boundaries', value: 'contributor' },
      { id: 'support', text: 'Support role - help others succeed', value: 'support' }
    ]
  }
];

// ============================================
// All Questions Export
// ============================================

export const allExpectationQuestions = [
  ...salaryQuestions,
  ...workLifeQuestions,
  ...roleLevelQuestions
];

export const expectationCategories = [
  { id: 'salary', name: 'Compensation', icon: 'DollarSign', questions: salaryQuestions },
  { id: 'work_life', name: 'Work-Life Balance', icon: 'Clock', questions: workLifeQuestions },
  { id: 'role_level', name: 'Role & Level', icon: 'TrendingUp', questions: roleLevelQuestions }
];

export function getExpectationQuestion(id: string): ExpectationQuestion | undefined {
  return allExpectationQuestions.find(q => q.id === id);
}
