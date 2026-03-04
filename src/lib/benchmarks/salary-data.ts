// ============================================
// Static Salary Data Engine
// Based on levels.fyi, Glassdoor, LinkedIn Salary data (2024)
// ============================================

export interface SalaryRange {
  p25: number;
  p50: number;  // Median
  p75: number;
}

export interface SalaryEstimate extends SalaryRange {
  region: string;
  regionLabel: string;
  currency: string;
  currencySymbol: string;
  factors: SalaryFactor[];
  confidence: 'high' | 'medium' | 'low';
}

export interface SalaryFactor {
  label: string;
  impact: string;
  positive: boolean;
}

// ============================================
// Base Salaries by Role and Title (US, USD)
// ============================================

export const baseSalaries: Record<string, Record<string, SalaryRange>> = {
  engineering: {
    junior: { p25: 75000, p50: 95000, p75: 120000 },
    mid: { p25: 110000, p50: 140000, p75: 175000 },
    senior: { p25: 150000, p50: 185000, p75: 230000 },
    staff: { p25: 200000, p50: 250000, p75: 320000 },
    manager: { p25: 170000, p50: 210000, p75: 270000 },
    senior_manager: { p25: 220000, p50: 280000, p75: 360000 },
    vp: { p25: 300000, p50: 400000, p75: 550000 }
  },
  data: {
    junior: { p25: 65000, p50: 80000, p75: 100000 },
    mid: { p25: 95000, p50: 120000, p75: 150000 },
    senior: { p25: 140000, p50: 175000, p75: 220000 },
    staff: { p25: 190000, p50: 240000, p75: 300000 },
    manager: { p25: 160000, p50: 200000, p75: 250000 },
    senior_manager: { p25: 210000, p50: 270000, p75: 340000 },
    vp: { p25: 280000, p50: 370000, p75: 480000 }
  },
  design: {
    junior: { p25: 55000, p50: 70000, p75: 90000 },
    mid: { p25: 85000, p50: 110000, p75: 140000 },
    senior: { p25: 130000, p50: 160000, p75: 200000 },
    staff: { p25: 170000, p50: 210000, p75: 260000 },
    manager: { p25: 150000, p50: 190000, p75: 240000 },
    senior_manager: { p25: 200000, p50: 250000, p75: 320000 },
    vp: { p25: 260000, p50: 340000, p75: 450000 }
  },
  product: {
    junior: { p25: 70000, p50: 90000, p75: 115000 },
    mid: { p25: 110000, p50: 140000, p75: 175000 },
    senior: { p25: 160000, p50: 200000, p75: 250000 },
    staff: { p25: 210000, p50: 260000, p75: 330000 },
    manager: { p25: 180000, p50: 225000, p75: 280000 },
    senior_manager: { p25: 240000, p50: 300000, p75: 380000 },
    vp: { p25: 320000, p50: 420000, p75: 550000 }
  },
  marketing: {
    junior: { p25: 50000, p50: 65000, p75: 85000 },
    mid: { p25: 75000, p50: 95000, p75: 120000 },
    senior: { p25: 110000, p50: 140000, p75: 180000 },
    staff: { p25: 150000, p50: 190000, p75: 240000 },
    manager: { p25: 130000, p50: 165000, p75: 210000 },
    senior_manager: { p25: 180000, p50: 230000, p75: 300000 },
    vp: { p25: 250000, p50: 330000, p75: 450000 }
  },
  operations: {
    junior: { p25: 45000, p50: 55000, p75: 70000 },
    mid: { p25: 65000, p50: 80000, p75: 100000 },
    senior: { p25: 90000, p50: 115000, p75: 145000 },
    staff: { p25: 120000, p50: 150000, p75: 190000 },
    manager: { p25: 110000, p50: 140000, p75: 175000 },
    senior_manager: { p25: 150000, p50: 190000, p75: 240000 },
    vp: { p25: 200000, p50: 270000, p75: 360000 }
  },
  leadership: {
    junior: { p25: 100000, p50: 130000, p75: 165000 },
    mid: { p25: 150000, p50: 190000, p75: 240000 },
    senior: { p25: 200000, p50: 260000, p75: 330000 },
    staff: { p25: 260000, p50: 330000, p75: 420000 },
    manager: { p25: 220000, p50: 280000, p75: 360000 },
    senior_manager: { p25: 300000, p50: 380000, p75: 500000 },
    vp: { p25: 400000, p50: 550000, p75: 750000 }
  },
  other: {
    junior: { p25: 45000, p50: 58000, p75: 75000 },
    mid: { p25: 65000, p50: 85000, p75: 110000 },
    senior: { p25: 95000, p50: 120000, p75: 155000 },
    staff: { p25: 130000, p50: 165000, p75: 210000 },
    manager: { p25: 120000, p50: 150000, p75: 190000 },
    senior_manager: { p25: 160000, p50: 205000, p75: 260000 },
    vp: { p25: 220000, p50: 290000, p75: 380000 }
  }
};

// ============================================
// Industry Multipliers
// ============================================

export const industryMultipliers: Record<string, { multiplier: number; label: string }> = {
  big_tech: { multiplier: 1.30, label: 'Big Tech premium' },
  fintech: { multiplier: 1.15, label: 'Fintech premium' },
  startup: { multiplier: 0.90, label: 'Startup (+ equity)' },
  healthcare: { multiplier: 1.05, label: 'Healthcare' },
  enterprise: { multiplier: 1.00, label: 'Enterprise (baseline)' },
  agency: { multiplier: 0.75, label: 'Agency discount' },
  ecommerce: { multiplier: 0.95, label: 'E-commerce' },
  other: { multiplier: 0.90, label: 'Other industries' }
};

// ============================================
// Region Multipliers (vs US base)
// ============================================

export const regionMultipliers: Record<string, {
  multiplier: number;
  currency: string;
  currencySymbol: string;
  label: string;
}> = {
  us: { multiplier: 1.00, currency: 'USD', currencySymbol: '$', label: 'United States' },
  canada: { multiplier: 0.75, currency: 'CAD', currencySymbol: 'C$', label: 'Canada' },
  uk: { multiplier: 0.80, currency: 'GBP', currencySymbol: '£', label: 'United Kingdom' },
  eu: { multiplier: 0.70, currency: 'EUR', currencySymbol: '€', label: 'Western Europe' },
  apac: { multiplier: 0.55, currency: 'USD', currencySymbol: '$', label: 'Asia-Pacific' },
  latam: { multiplier: 0.45, currency: 'USD', currencySymbol: '$', label: 'Latin America' },
  mena: { multiplier: 0.55, currency: 'USD', currencySymbol: '$', label: 'Middle East / Africa' },
  remote_global: { multiplier: 0.85, currency: 'USD', currencySymbol: '$', label: 'Remote (Global)' }
};

// ============================================
// Company Stage Multipliers
// ============================================

export const stageMultipliers: Record<string, { multiplier: number; label: string }> = {
  early_startup: { multiplier: 0.80, label: 'Early startup (lower cash)' },
  growth: { multiplier: 0.95, label: 'Growth stage' },
  scaleup: { multiplier: 1.00, label: 'Scale-up (baseline)' },
  enterprise: { multiplier: 1.05, label: 'Enterprise' },
  public: { multiplier: 1.15, label: 'Public company' }
};

// ============================================
// Premium Adjustments
// ============================================

export const premiums: Record<string, { multiplier: number; label: string }> = {
  faang_background: { multiplier: 1.10, label: 'FAANG background' },
  unicorn_background: { multiplier: 1.05, label: 'Unicorn experience' },
  consulting_background: { multiplier: 1.05, label: 'Top consulting' },
  top_certs: { multiplier: 1.05, label: 'Key certifications' }
};

// ============================================
// Salary Profile Input
// ============================================

export interface SalaryProfile {
  role: string;           // engineering, data, etc.
  title: string;          // junior, mid, senior, staff, etc.
  experience: string;     // y0_2, y3_5, y6_10, etc.
  industry: string;       // big_tech, fintech, etc.
  companyStages: string[]; // early_startup, growth, etc.
  regions: string[];      // us, uk, eu, etc.
  prevCompany: string;    // faang, unicorn, etc.
  hasCerts: boolean;
}

// ============================================
// Calculate Salary Ranges
// ============================================

export function calculateSalaryRanges(profile: SalaryProfile): SalaryEstimate[] {
  const roleKey = profile.role || 'other';
  const titleKey = profile.title || 'mid';
  
  // Get base salary
  const roleSalaries = baseSalaries[roleKey] || baseSalaries.other;
  const base = roleSalaries[titleKey] || roleSalaries.mid;
  
  // Get multipliers
  const industryMult = industryMultipliers[profile.industry] || industryMultipliers.other;
  
  // Use highest company stage multiplier if multiple selected
  const stageMult = profile.companyStages.reduce((max, stage) => {
    const mult = stageMultipliers[stage]?.multiplier || 1.0;
    return mult > max ? mult : max;
  }, 1.0);
  
  // Calculate for each region
  return profile.regions.map(regionId => {
    const region = regionMultipliers[regionId] || regionMultipliers.us;
    
    let totalMultiplier = 1.0;
    const factors: SalaryFactor[] = [];
    
    // Industry
    totalMultiplier *= industryMult.multiplier;
    if (industryMult.multiplier !== 1.0) {
      factors.push({
        label: industryMult.label,
        impact: `${industryMult.multiplier > 1 ? '+' : ''}${Math.round((industryMult.multiplier - 1) * 100)}%`,
        positive: industryMult.multiplier > 1
      });
    }
    
    // Region
    totalMultiplier *= region.multiplier;
    if (region.multiplier !== 1.0) {
      factors.push({
        label: `${region.label} market`,
        impact: `${region.multiplier > 1 ? '+' : ''}${Math.round((region.multiplier - 1) * 100)}%`,
        positive: region.multiplier > 1
      });
    }
    
    // Company stage
    if (stageMult !== 1.0) {
      totalMultiplier *= stageMult;
      factors.push({
        label: 'Company stage',
        impact: `${stageMult > 1 ? '+' : ''}${Math.round((stageMult - 1) * 100)}%`,
        positive: stageMult > 1
      });
    }
    
    // Previous company premium
    if (profile.prevCompany === 'faang') {
      totalMultiplier *= premiums.faang_background.multiplier;
      factors.push({
        label: premiums.faang_background.label,
        impact: '+10%',
        positive: true
      });
    } else if (profile.prevCompany === 'unicorn' || profile.prevCompany === 'consulting') {
      totalMultiplier *= premiums.unicorn_background.multiplier;
      factors.push({
        label: profile.prevCompany === 'unicorn' ? premiums.unicorn_background.label : premiums.consulting_background.label,
        impact: '+5%',
        positive: true
      });
    }
    
    // Certification premium
    if (profile.hasCerts) {
      totalMultiplier *= premiums.top_certs.multiplier;
      factors.push({
        label: premiums.top_certs.label,
        impact: '+5%',
        positive: true
      });
    }
    
    // Calculate confidence based on data points
    const dataPoints = [
      profile.role,
      profile.title,
      profile.experience,
      profile.industry,
      profile.companyStages.length > 0,
      profile.regions.length > 0,
      profile.prevCompany
    ].filter(Boolean).length;
    
    let confidence: 'high' | 'medium' | 'low' = 'low';
    if (dataPoints >= 6) confidence = 'high';
    else if (dataPoints >= 4) confidence = 'medium';
    
    return {
      region: regionId,
      regionLabel: region.label,
      currency: region.currency,
      currencySymbol: region.currencySymbol,
      p25: Math.round(base.p25 * totalMultiplier / 1000) * 1000,
      p50: Math.round(base.p50 * totalMultiplier / 1000) * 1000,
      p75: Math.round(base.p75 * totalMultiplier / 1000) * 1000,
      factors,
      confidence
    };
  });
}

// ============================================
// Extract Salary Profile from Answers
// ============================================

export function extractSalaryProfile(answers: Record<string, string[]>): SalaryProfile {
  const getFirst = (key: string) => answers[key]?.[0] || '';
  
  return {
    role: getFirst('q6_role'),
    title: getFirst('q15_title'),
    experience: getFirst('q8_experience'),
    industry: getFirst('q9_industry'),
    companyStages: answers['q10_company_stage'] || [],
    regions: answers['q12_regions'] || ['us'],
    prevCompany: getFirst('q13_prev_company'),
    hasCerts: (answers['q14_certs'] || []).some(c => c !== 'none')
  };
}

// ============================================
// Format Salary for Display
// ============================================

export function formatSalary(amount: number, currencySymbol: string): string {
  if (amount >= 1000000) {
    return `${currencySymbol}${(amount / 1000000).toFixed(1)}M`;
  }
  return `${currencySymbol}${Math.round(amount / 1000)}k`;
}

// ============================================
// Get Title Label
// ============================================

export function getTitleLabel(titleId: string): string {
  const labels: Record<string, string> = {
    junior: 'Junior / Associate',
    mid: 'Mid-level',
    senior: 'Senior',
    staff: 'Staff / Principal',
    manager: 'Manager',
    senior_manager: 'Senior Manager / Director',
    vp: 'VP / Executive'
  };
  return labels[titleId] || titleId;
}

// ============================================
// Get Industry Label
// ============================================

export function getIndustryLabel(industryId: string): string {
  const labels: Record<string, string> = {
    big_tech: 'Big Tech',
    startup: 'Startup',
    fintech: 'Fintech',
    healthcare: 'Healthcare',
    enterprise: 'Enterprise',
    agency: 'Agency',
    ecommerce: 'E-commerce',
    other: 'Other'
  };
  return labels[industryId] || industryId;
}

