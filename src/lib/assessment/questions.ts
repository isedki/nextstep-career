import { Question } from '../types';

// ============================================
// Context Questions (Get to know them personally)
// ============================================

export const contextQuestions: Question[] = [
  {
    id: 'ctx_name',
    phase: 'context',
    text: "First, what should I call you?",
    subtext: "Just your first name or nickname is fine",
    type: 'text',
    placeholder: "Your name",
    required: true
  },
  {
    id: 'ctx_company_type',
    phase: 'context',
    text: "What kind of place are you at now?",
    type: 'single',
    required: true,
    options: [
      { id: 'early_startup', text: 'Early startup - exciting but chaotic', signals: { context_startup: 1 } },
      { id: 'growing_company', text: 'Growing company - things change fast', signals: { context_growth: 1 } },
      { id: 'established_corp', text: 'Established company - stable but slow', signals: { context_corp: 1 } },
      { id: 'agency_consulting', text: 'Agency/Consulting - client-driven', signals: { context_agency: 1 } },
      { id: 'between_jobs', text: 'Between jobs right now', signals: { context_between: 1 } }
    ]
  },
  {
    id: 'ctx_manager',
    phase: 'context',
    text: "How's your manager situation?",
    type: 'single',
    required: true,
    options: [
      { id: 'great_manager', text: 'Great manager, but other issues exist', signals: { manager_good: 1 } },
      { id: 'absent_manager', text: 'Manager is absent or too busy for me', signals: { manager_absent: 1, absent_direction: 0.5 } },
      { id: 'micromanager', text: 'Manager hovers and controls everything', signals: { manager_micro: 1, micromanagement: 0.8 } },
      { id: 'toxic_manager', text: 'Manager is part of the problem', signals: { manager_toxic: 1, toxic_manager: 0.8 } },
      { id: 'new_manager', text: 'New manager, still figuring it out', signals: { manager_new: 1 } },
      { id: 'no_manager', text: 'No direct manager right now', signals: { manager_none: 1 } }
    ]
  },
  {
    id: 'ctx_tenure',
    phase: 'context',
    text: "How long have you been dealing with this?",
    subtext: "Not your total tenure, but how long things have felt off",
    type: 'single',
    required: true,
    options: [
      { id: 'under_3mo', text: 'Less than 3 months', signals: { tenure_new: 1 } },
      { id: '3_6mo', text: '3-6 months', signals: { tenure_recent: 1 } },
      { id: '6mo_1yr', text: '6 months to 1 year', signals: { tenure_medium: 1 } },
      { id: '1_2yr', text: '1-2 years', signals: { tenure_long: 1, burnout_risk: 0.3 } },
      { id: '2_plus', text: 'More than 2 years', signals: { tenure_very_long: 1, burnout_risk: 0.5 } }
    ]
  }
];

// ============================================
// Core Assessment Questions (15 Questions, ~5 min)
// ============================================

export const coreQuestions: Question[] = [
  {
    id: 'q1_trigger',
    phase: 'core',
    text: "What's pushing you to think about a change?",
    subtext: "Select up to 2 that resonate most",
    type: 'multi',
    maxSelections: 2,
    required: true,
    options: [
      {
        id: 'burned_out',
        text: 'Burned out / exhausted',
        signals: {
          burnout_exhaustion: 0.8,
          jdr_demand_workload: 0.6,
          urgency: 0.7
        }
      },
      {
        id: 'underpaid',
        text: 'Underpaid or undervalued',
        signals: {
          sdt_competence: -0.5,
          jdr_missing_recognition: 0.8,
          anchor_security: 0.3
        }
      },
      {
        id: 'bad_manager',
        text: 'Bad manager or team dynamics',
        signals: {
          jdr_missing_support: 0.8,
          sdt_relatedness: -0.6,
          toxic_manager: 0.7
        }
      },
      {
        id: 'bored',
        text: 'Bored / unchallenged',
        signals: {
          flow_understimulated: 0.8,
          sdt_competence: -0.4,
          anchor_challenge: 0.5
        }
      },
      {
        id: 'no_growth',
        text: 'No growth path visible',
        signals: {
          jdr_missing_growth: 0.9,
          no_growth: 0.8,
          anchor_technical: 0.3
        }
      },
      {
        id: 'instability',
        text: 'Company instability / layoffs',
        signals: {
          chaos_instability: 0.8,
          anchor_security: 0.6,
          urgency: 0.6
        }
      },
      {
        id: 'life_change',
        text: 'Life change (family, location, health)',
        signals: {
          anchor_lifestyle: 0.7,
          external_trigger: 0.8
        }
      },
      {
        id: 'exploring',
        text: 'Just exploring options',
        signals: {
          urgency: -0.5,
          openness: 0.4
        }
      }
    ]
  },
  {
    id: 'q2_priority',
    phase: 'core',
    text: "Pick ONE thing that would make the biggest difference:",
    type: 'single',
    required: true,
    options: [
      {
        id: 'control',
        text: 'More control over my time and how I work',
        signals: {
          sdt_autonomy: 0.9,
          anchor_autonomy: 0.9,
          micromanagement: 0.6
        }
      },
      {
        id: 'pay_recognition',
        text: 'Better pay or recognition',
        signals: {
          jdr_missing_recognition: 0.7,
          anchor_security: 0.5,
          undervalued: 0.6
        }
      },
      {
        id: 'good_team',
        text: 'A manager/team I respect',
        signals: {
          sdt_relatedness: 0.8,
          jdr_missing_support: 0.6,
          toxic_manager: 0.5
        }
      },
      {
        id: 'challenge',
        text: 'Work that challenges me',
        signals: {
          flow_challenge: 0.8,
          anchor_challenge: 0.7,
          holland_I: 0.4
        }
      },
      {
        id: 'clear_path',
        text: 'A clear path forward',
        signals: {
          jdr_missing_growth: 0.7,
          no_growth: 0.6,
          absent_direction: 0.5
        }
      },
      {
        id: 'stability',
        text: 'Less chaos, more stability',
        signals: {
          anchor_security: 0.8,
          chaos_instability: 0.6,
          bigfive_neuroticism: 0.4
        }
      }
    ]
  },
  {
    id: 'q3_flow',
    phase: 'core',
    text: "When do you lose track of time at work (in a good way)?",
    type: 'single',
    required: true,
    options: [
      {
        id: 'solving_problems',
        text: 'Solving hard problems',
        signals: {
          holland_I: 0.9,
          flow_analytical: 0.8,
          anchor_challenge: 0.5
        }
      },
      {
        id: 'creating',
        text: 'Creating something new',
        signals: {
          holland_A: 0.9,
          flow_creative: 0.8,
          anchor_entrepreneurial: 0.4
        }
      },
      {
        id: 'helping',
        text: 'Helping someone succeed',
        signals: {
          holland_S: 0.9,
          anchor_service: 0.7,
          sdt_relatedness: 0.5
        }
      },
      {
        id: 'organizing',
        text: 'Organizing chaos into systems',
        signals: {
          holland_C: 0.8,
          bigfive_conscientiousness: 0.7,
          flow_systematic: 0.6
        }
      },
      {
        id: 'leading',
        text: 'Leading toward a goal',
        signals: {
          holland_E: 0.9,
          anchor_management: 0.7,
          bigfive_extraversion: 0.5
        }
      },
      {
        id: 'building',
        text: 'Building something tangible',
        signals: {
          holland_R: 0.9,
          anchor_technical: 0.6,
          flow_hands_on: 0.7
        }
      },
      {
        id: 'been_a_while',
        text: "Honestly, it's been a while",
        signals: {
          burnout_cynicism: 0.7,
          flow_blocked: 0.8,
          wrong_fit: 0.5
        }
      }
    ]
  },
  {
    id: 'q4_drains',
    phase: 'core',
    text: "What drains you fastest?",
    subtext: "Select up to 2",
    type: 'multi',
    maxSelections: 2,
    required: true,
    options: [
      {
        id: 'meetings',
        text: 'Meetings and small talk',
        signals: {
          bigfive_extraversion: -0.7,
          holland_I: 0.4, // Inverse - I types hate meetings
          flow_drain_social: 0.6
        }
      },
      {
        id: 'repetitive',
        text: 'Repetitive tasks',
        signals: {
          bigfive_openness: 0.6,
          flow_drain_monotony: 0.8,
          holland_A: 0.4
        }
      },
      {
        id: 'ambiguity',
        text: 'Ambiguity and chaos',
        signals: {
          bigfive_neuroticism: 0.5,
          absent_direction: 0.7,
          anchor_security: 0.5
        }
      },
      {
        id: 'rigid_processes',
        text: 'Rigid rules and processes',
        signals: {
          sdt_autonomy: -0.6,
          micromanagement: 0.7,
          bigfive_openness: 0.5
        }
      },
      {
        id: 'emotional_labor',
        text: "Managing people's emotions",
        signals: {
          jdr_demand_emotional: 0.8,
          bigfive_agreeableness: -0.3,
          burnout_exhaustion: 0.4
        }
      },
      {
        id: 'public_speaking',
        text: 'Public speaking / presenting',
        signals: {
          bigfive_extraversion: -0.6,
          bigfive_neuroticism: 0.4
        }
      }
    ]
  },
  {
    id: 'q5_tradeoff',
    phase: 'core',
    text: "If you HAD to sacrifice one, which goes?",
    type: 'single',
    required: true,
    options: [
      {
        id: 'salary_for_flexibility',
        text: 'Higher salary → to keep flexibility',
        signals: {
          anchor_lifestyle: 0.8,
          anchor_autonomy: 0.6,
          tradeoff_time_over_money: 0.9
        }
      },
      {
        id: 'flexibility_for_salary',
        text: 'Flexibility → to keep salary',
        signals: {
          anchor_security: 0.7,
          tradeoff_money_over_time: 0.8
        }
      },
      {
        id: 'prestige_for_sanity',
        text: 'Prestige → to keep sanity',
        signals: {
          anchor_lifestyle: 0.7,
          tradeoff_peace_over_status: 0.9,
          burnout_awareness: 0.5
        }
      },
      {
        id: 'sanity_for_prestige',
        text: 'Sanity → to keep prestige',
        signals: {
          anchor_management: 0.5,
          anchor_challenge: 0.4,
          tradeoff_status_over_peace: 0.8
        }
      },
      {
        id: 'growth_for_stability',
        text: 'Fast growth → to keep stability',
        signals: {
          anchor_security: 0.8,
          bigfive_neuroticism: 0.4,
          tradeoff_stability_over_growth: 0.9
        }
      },
      {
        id: 'stability_for_growth',
        text: 'Stability → to keep fast growth',
        signals: {
          anchor_challenge: 0.6,
          anchor_entrepreneurial: 0.5,
          tradeoff_growth_over_stability: 0.8
        }
      }
    ]
  },
  {
    id: 'q6_role',
    phase: 'core',
    text: "Your primary field?",
    type: 'single',
    required: true,
    options: [
      { id: 'engineering', text: 'Engineering / Technical', signals: { role_engineering: 1 } },
      { id: 'design', text: 'Design / Creative', signals: { role_design: 1 } },
      { id: 'product', text: 'Product / Project Management', signals: { role_product: 1 } },
      { id: 'marketing', text: 'Marketing / Sales / BD', signals: { role_marketing: 1 } },
      { id: 'operations', text: 'Operations / Admin', signals: { role_operations: 1 } },
      { id: 'data', text: 'Data / Analytics', signals: { role_data: 1 } },
      { id: 'leadership', text: 'Leadership / Executive', signals: { role_leadership: 1 } },
      { id: 'other', text: 'Other', signals: { role_other: 1 } }
    ]
  },
  {
    id: 'q7_urgency',
    phase: 'core',
    text: "Where are you at?",
    type: 'single',
    required: true,
    options: [
      {
        id: 'active',
        text: 'Actively looking - need change soon',
        signals: { urgency_active: 1, urgency: 0.9 }
      },
      {
        id: 'open',
        text: 'Open to the right opportunity',
        signals: { urgency_open: 1, urgency: 0.5 }
      },
      {
        id: 'exploring',
        text: 'Exploring / learning about myself',
        signals: { urgency_exploring: 1, urgency: 0.2 }
      },
      {
        id: 'stable',
        text: 'Stable but curious',
        signals: { urgency_stable: 1, urgency: 0.1 }
      }
    ]
  },
  {
    id: 'q8_experience',
    phase: 'core',
    text: "Total years in this field?",
    type: 'single',
    required: true,
    options: [
      { id: 'y0_2', text: '0-2 years (Early career)', signals: { experience_early: 1, seniority_multiplier: 0.6 } },
      { id: 'y3_5', text: '3-5 years (Mid-level)', signals: { experience_mid: 1, seniority_multiplier: 0.85 } },
      { id: 'y6_10', text: '6-10 years (Senior)', signals: { experience_senior: 1, seniority_multiplier: 1.0 } },
      { id: 'y11_15', text: '11-15 years (Staff/Principal)', signals: { experience_staff: 1, seniority_multiplier: 1.35 } },
      { id: 'y15_plus', text: '15+ years (Director+)', signals: { experience_director: 1, seniority_multiplier: 1.8 } }
    ]
  },
  {
    id: 'q9_industry',
    phase: 'core',
    text: "What industry are you in (or targeting)?",
    type: 'single',
    required: true,
    options: [
      { id: 'big_tech', text: 'Big Tech (FAANG, Microsoft, etc.)', signals: { industry_big_tech: 1, industry_multiplier: 1.3 } },
      { id: 'startup', text: 'Startup / Scale-up', signals: { industry_startup: 1, industry_multiplier: 0.9 } },
      { id: 'fintech', text: 'Fintech / Finance', signals: { industry_fintech: 1, industry_multiplier: 1.15 } },
      { id: 'healthcare', text: 'Healthcare / Biotech', signals: { industry_healthcare: 1, industry_multiplier: 1.05 } },
      { id: 'enterprise', text: 'Enterprise / B2B SaaS', signals: { industry_enterprise: 1, industry_multiplier: 1.0 } },
      { id: 'agency', text: 'Agency / Consulting', signals: { industry_agency: 1, industry_multiplier: 0.75 } },
      { id: 'ecommerce', text: 'E-commerce / Retail', signals: { industry_ecommerce: 1, industry_multiplier: 0.95 } },
      { id: 'other', text: 'Other', signals: { industry_other: 1, industry_multiplier: 0.9 } }
    ]
  },
  {
    id: 'q10_company_stage',
    phase: 'core',
    text: "What company stage fits you best?",
    subtext: "Select up to 2",
    type: 'multi',
    maxSelections: 2,
    required: true,
    options: [
      { id: 'early_startup', text: 'Early startup (< 50 people)', signals: { stage_early: 1, stage_multiplier: 0.8 } },
      { id: 'growth', text: 'Growth stage (50-500)', signals: { stage_growth: 1, stage_multiplier: 0.95 } },
      { id: 'scaleup', text: 'Scale-up (500-2000)', signals: { stage_scaleup: 1, stage_multiplier: 1.0 } },
      { id: 'enterprise', text: 'Large enterprise (2000+)', signals: { stage_enterprise: 1, stage_multiplier: 1.05 } },
      { id: 'public', text: 'Public company', signals: { stage_public: 1, stage_multiplier: 1.15 } }
    ]
  },
  {
    id: 'q11_work_mode',
    phase: 'core',
    text: "How do you want to work?",
    type: 'single',
    required: true,
    options: [
      { id: 'remote_global', text: 'Fully remote (work from anywhere)', signals: { work_remote_global: 1 } },
      { id: 'remote_region', text: 'Remote within my timezone/region', signals: { work_remote_region: 1 } },
      { id: 'hybrid', text: 'Hybrid (2-3 days office)', signals: { work_hybrid: 1 } },
      { id: 'onsite', text: 'On-site preferred', signals: { work_onsite: 1 } }
    ]
  },
  {
    id: 'q12_regions',
    phase: 'core',
    text: "Which job markets interest you?",
    subtext: "Select all that apply",
    type: 'multi',
    required: true,
    options: [
      { id: 'us', text: 'United States', signals: { region_us: 1 } },
      { id: 'canada', text: 'Canada', signals: { region_canada: 1 } },
      { id: 'uk', text: 'United Kingdom', signals: { region_uk: 1 } },
      { id: 'eu', text: 'Western Europe (EU)', signals: { region_eu: 1 } },
      { id: 'apac', text: 'Asia-Pacific', signals: { region_apac: 1 } },
      { id: 'latam', text: 'Latin America', signals: { region_latam: 1 } },
      { id: 'mena', text: 'Middle East / Africa', signals: { region_mena: 1 } },
      { id: 'remote_global', text: 'Remote-first companies (global)', signals: { region_remote: 1 } }
    ]
  },
  {
    id: 'q13_prev_company',
    phase: 'core',
    text: "Your most notable previous employer?",
    subtext: "This affects perceived market value",
    type: 'single',
    required: true,
    options: [
      { id: 'faang', text: 'FAANG / Big Tech', signals: { prev_faang: 1, prev_premium: 1.1 } },
      { id: 'unicorn', text: 'Well-known unicorn/startup', signals: { prev_unicorn: 1, prev_premium: 1.05 } },
      { id: 'consulting', text: 'Top consulting (McKinsey, BCG, etc.)', signals: { prev_consulting: 1, prev_premium: 1.05 } },
      { id: 'fortune500', text: 'Fortune 500', signals: { prev_fortune500: 1, prev_premium: 1.0 } },
      { id: 'other', text: 'Other / First job', signals: { prev_other: 1, prev_premium: 1.0 } }
    ]
  },
  {
    id: 'q14_certs',
    phase: 'core',
    text: "Relevant certifications?",
    subtext: "Optional - select any you have",
    type: 'multi',
    required: false,
    options: [
      { id: 'aws', text: 'AWS Certified (any level)', signals: { cert_aws: 1, cert_premium: 1.05 } },
      { id: 'gcp_azure', text: 'GCP / Azure Certified', signals: { cert_cloud: 1, cert_premium: 1.05 } },
      { id: 'kubernetes', text: 'Kubernetes (CKA/CKAD)', signals: { cert_k8s: 1, cert_premium: 1.05 } },
      { id: 'pmp', text: 'PMP / PMI-ACP', signals: { cert_pmp: 1, cert_premium: 1.03 } },
      { id: 'scrum', text: 'Certified Scrum Master', signals: { cert_scrum: 1, cert_premium: 1.02 } },
      { id: 'ml', text: 'ML/AI Certification', signals: { cert_ml: 1, cert_premium: 1.05 } },
      { id: 'data', text: 'Data/Analytics Certification', signals: { cert_data: 1, cert_premium: 1.03 } },
      { id: 'none', text: 'None / Not relevant', signals: { cert_none: 1 } }
    ]
  },
  {
    id: 'q15_title',
    phase: 'core',
    text: "Your current or target title level?",
    type: 'single',
    required: true,
    options: [
      { id: 'junior', text: 'Junior / Associate / Entry', signals: { title_junior: 1, title_level: 1 } },
      { id: 'mid', text: 'Mid-level / Standard', signals: { title_mid: 1, title_level: 2 } },
      { id: 'senior', text: 'Senior', signals: { title_senior: 1, title_level: 3 } },
      { id: 'staff', text: 'Staff / Principal / Lead', signals: { title_staff: 1, title_level: 4 } },
      { id: 'manager', text: 'Manager', signals: { title_manager: 1, title_level: 4, anchor_management: 0.3 } },
      { id: 'senior_manager', text: 'Senior Manager / Director', signals: { title_director: 1, title_level: 5, anchor_management: 0.5 } },
      { id: 'vp', text: 'VP / Executive', signals: { title_vp: 1, title_level: 6, anchor_management: 0.7 } }
    ]
  }
];

// ============================================
// Deep Dive: Burnout (Optional, ~2 min)
// ============================================

export const burnoutQuestions: Question[] = [
  {
    id: 'burnout_demands',
    phase: 'burnout',
    text: "Which demands feel too high?",
    subtext: "Select all that apply",
    type: 'multi',
    options: [
      { id: 'workload', text: 'Workload - too much to do', signals: { jdr_demand_workload: 0.9 } },
      { id: 'time_pressure', text: 'Time pressure - constant deadlines', signals: { jdr_demand_time: 0.9 } },
      { id: 'emotional', text: 'Emotional labor - managing feelings', signals: { jdr_demand_emotional: 0.9 } },
      { id: 'cognitive', text: 'Cognitive load - complex decisions', signals: { jdr_demand_cognitive: 0.8 } },
      { id: 'role_confusion', text: 'Role confusion - unclear expectations', signals: { jdr_demand_ambiguity: 0.8, absent_direction: 0.6 } },
      { id: 'work_life', text: 'Work bleeding into life', signals: { jdr_demand_work_life: 0.9, anchor_lifestyle: 0.5 } }
    ]
  },
  {
    id: 'burnout_resources',
    phase: 'burnout',
    text: "Which resources are missing?",
    subtext: "Select all that apply",
    type: 'multi',
    options: [
      { id: 'autonomy', text: 'Autonomy - control over how I work', signals: { jdr_missing_autonomy: 0.9, sdt_autonomy: -0.7 } },
      { id: 'support', text: 'Support - from manager or team', signals: { jdr_missing_support: 0.9, sdt_relatedness: -0.5 } },
      { id: 'feedback', text: 'Feedback - knowing if I\'m doing well', signals: { jdr_missing_feedback: 0.8 } },
      { id: 'growth', text: 'Growth - learning opportunities', signals: { jdr_missing_growth: 0.9, no_growth: 0.7 } },
      { id: 'recognition', text: 'Recognition - feeling valued', signals: { jdr_missing_recognition: 0.9, undervalued: 0.7 } },
      { id: 'purpose', text: 'Purpose - meaningful work', signals: { jdr_missing_purpose: 0.8, sdt_competence: -0.4 } }
    ]
  },
  {
    id: 'burnout_frequency',
    phase: 'burnout',
    text: "How often do you feel...",
    type: 'scale',
    options: [
      { id: 'exhausted_never', text: 'Emotionally drained - Never', signals: { burnout_exhaustion: 0 } },
      { id: 'exhausted_sometimes', text: 'Emotionally drained - Sometimes', signals: { burnout_exhaustion: 0.33 } },
      { id: 'exhausted_often', text: 'Emotionally drained - Often', signals: { burnout_exhaustion: 0.66 } },
      { id: 'exhausted_always', text: 'Emotionally drained - Always', signals: { burnout_exhaustion: 1 } }
    ]
  },
  {
    id: 'burnout_cynicism',
    phase: 'burnout',
    text: "How often do you feel cynical about whether your work matters?",
    type: 'scale',
    options: [
      { id: 'cynical_never', text: 'Never', signals: { burnout_cynicism: 0 } },
      { id: 'cynical_sometimes', text: 'Sometimes', signals: { burnout_cynicism: 0.33 } },
      { id: 'cynical_often', text: 'Often', signals: { burnout_cynicism: 0.66 } },
      { id: 'cynical_always', text: 'Always', signals: { burnout_cynicism: 1 } }
    ]
  }
];

// ============================================
// Deep Dive: Work Style (Optional, ~2 min)
// ============================================

export const workstyleQuestions: Question[] = [
  {
    id: 'workstyle_groups',
    phase: 'workstyle',
    text: "In group settings, you...",
    type: 'single',
    options: [
      { id: 'energized', text: 'Energized, speak up easily', signals: { bigfive_extraversion: 0.9 } },
      { id: 'selective', text: 'Contribute when I have something', signals: { bigfive_extraversion: 0.4 } },
      { id: 'small_groups', text: 'Prefer small groups or 1:1', signals: { bigfive_extraversion: -0.3 } },
      { id: 'draining', text: 'Find most group work draining', signals: { bigfive_extraversion: -0.8 } }
    ]
  },
  {
    id: 'workstyle_change',
    phase: 'workstyle',
    text: "When plans change suddenly...",
    type: 'single',
    options: [
      { id: 'adapt_easily', text: 'Adapt easily - variety is good', signals: { bigfive_openness: 0.8, bigfive_neuroticism: -0.5 } },
      { id: 'adjust_warning', text: 'Adjust fine with some warning', signals: { bigfive_openness: 0.3 } },
      { id: 'need_time', text: 'Need time to recalibrate', signals: { bigfive_neuroticism: 0.4 } },
      { id: 'stressful', text: 'Find it very stressful', signals: { bigfive_neuroticism: 0.8, anchor_security: 0.5 } }
    ]
  },
  {
    id: 'workstyle_environment',
    phase: 'workstyle',
    text: "Your ideal work environment:",
    type: 'single',
    options: [
      { id: 'dynamic', text: 'Dynamic, creative chaos', signals: { bigfive_openness: 0.9, anchor_entrepreneurial: 0.5 } },
      { id: 'structured_flex', text: 'Structured with some flexibility', signals: { bigfive_conscientiousness: 0.6, bigfive_openness: 0.3 } },
      { id: 'predictable', text: 'Clear processes, predictable', signals: { bigfive_conscientiousness: 0.8, anchor_security: 0.6 } },
      { id: 'depends_people', text: 'Depends on the people', signals: { sdt_relatedness: 0.7 } }
    ]
  }
];

// ============================================
// Deep Dive: Motivators (Optional, ~2 min)
// ============================================

export const motivatorsQuestions: Question[] = [
  {
    id: 'motivators_sdt',
    phase: 'motivators',
    text: "Rate these in your current work:",
    subtext: "How satisfied are these core needs?",
    type: 'scale',
    options: [
      { id: 'autonomy_unmet', text: 'Autonomy - Unmet', signals: { sdt_autonomy: -0.9 } },
      { id: 'autonomy_partial', text: 'Autonomy - Partial', signals: { sdt_autonomy: -0.3 } },
      { id: 'autonomy_met', text: 'Autonomy - Met', signals: { sdt_autonomy: 0.7 } },
      { id: 'competence_unmet', text: 'Competence - Unmet', signals: { sdt_competence: -0.9 } },
      { id: 'competence_partial', text: 'Competence - Partial', signals: { sdt_competence: -0.3 } },
      { id: 'competence_met', text: 'Competence - Met', signals: { sdt_competence: 0.7 } },
      { id: 'relatedness_unmet', text: 'Relatedness - Unmet', signals: { sdt_relatedness: -0.9 } },
      { id: 'relatedness_partial', text: 'Relatedness - Partial', signals: { sdt_relatedness: -0.3 } },
      { id: 'relatedness_met', text: 'Relatedness - Met', signals: { sdt_relatedness: 0.7 } }
    ]
  },
  {
    id: 'motivators_anchor_r1',
    phase: 'motivators',
    text: "Forced choice: Keep ONE, lose the other",
    subtext: "Round 1 of 3",
    type: 'single',
    options: [
      { id: 'technical', text: 'Technical mastery (being the expert)', signals: { anchor_technical: 0.8 } },
      { id: 'management', text: 'Management path (running things)', signals: { anchor_management: 0.8 } }
    ]
  },
  {
    id: 'motivators_anchor_r2',
    phase: 'motivators',
    text: "Forced choice: Keep ONE, lose the other",
    subtext: "Round 2 of 3",
    type: 'single',
    options: [
      { id: 'autonomy', text: 'Autonomy (freedom and independence)', signals: { anchor_autonomy: 0.9 } },
      { id: 'security', text: 'Security (stability and predictability)', signals: { anchor_security: 0.9 } }
    ]
  },
  {
    id: 'motivators_anchor_r3',
    phase: 'motivators',
    text: "Forced choice: Keep ONE, lose the other",
    subtext: "Final round",
    type: 'single',
    options: [
      { id: 'challenge', text: 'Pure challenge (solving hard problems)', signals: { anchor_challenge: 0.9 } },
      { id: 'lifestyle', text: 'Lifestyle (work-life integration)', signals: { anchor_lifestyle: 0.9 } }
    ]
  }
];

// ============================================
// Deep Dive: Skills (Optional, ~3 min)
// ============================================

export const skillsQuestions: Question[] = [
  {
    id: 'skills_inventory',
    phase: 'skills',
    text: "Select your top skills and rate them:",
    subtext: "We'll show relevant skills based on your role",
    type: 'multi',
    options: [] // Dynamically populated based on role
  },
  {
    id: 'skills_develop',
    phase: 'skills',
    text: "Skills you want to develop?",
    subtext: "Select any that interest you",
    type: 'multi',
    options: [
      { id: 'ai_ml', text: 'AI / Machine Learning', signals: { skill_interest_ai: 1 } },
      { id: 'cloud', text: 'Cloud / Infrastructure', signals: { skill_interest_cloud: 1 } },
      { id: 'leadership', text: 'Leadership / Management', signals: { skill_interest_leadership: 1, anchor_management: 0.3 } },
      { id: 'product', text: 'Product sense', signals: { skill_interest_product: 1 } },
      { id: 'communication', text: 'Communication / Influence', signals: { skill_interest_communication: 1, holland_E: 0.3 } },
      { id: 'data', text: 'Data / Analytics', signals: { skill_interest_data: 1, holland_I: 0.3 } },
      { id: 'design', text: 'Design / UX', signals: { skill_interest_design: 1, holland_A: 0.3 } }
    ]
  }
];

// ============================================
// All Questions Export
// ============================================

export const allQuestions = {
  core: coreQuestions,
  burnout: burnoutQuestions,
  workstyle: workstyleQuestions,
  motivators: motivatorsQuestions,
  skills: skillsQuestions
};

export function getQuestionById(id: string): Question | undefined {
  const all = [
    ...coreQuestions,
    ...burnoutQuestions,
    ...workstyleQuestions,
    ...motivatorsQuestions,
    ...skillsQuestions
  ];
  return all.find(q => q.id === id);
}

