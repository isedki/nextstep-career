import { CareerProfile, MarketBenchmark, HollandType } from '../types';

// ============================================
// Role-based Domain Mapping
// ============================================

const roleToDomains: Record<string, { name: string; baseRoles: number }[]> = {
  engineering: [
    { name: 'Software Engineering', baseRoles: 45000 },
    { name: 'DevOps / Platform', baseRoles: 15000 },
    { name: 'Data Engineering', baseRoles: 12000 },
    { name: 'Security Engineering', baseRoles: 8000 }
  ],
  design: [
    { name: 'Product Design', baseRoles: 18000 },
    { name: 'UX Research', baseRoles: 6000 },
    { name: 'Brand Design', baseRoles: 8000 },
    { name: 'Design Systems', baseRoles: 3000 }
  ],
  product: [
    { name: 'Product Management', baseRoles: 25000 },
    { name: 'Technical Product Management', baseRoles: 8000 },
    { name: 'Program Management', baseRoles: 12000 }
  ],
  marketing: [
    { name: 'Growth Marketing', baseRoles: 15000 },
    { name: 'Content Marketing', baseRoles: 10000 },
    { name: 'Product Marketing', baseRoles: 12000 },
    { name: 'Sales', baseRoles: 35000 }
  ],
  data: [
    { name: 'Data Science', baseRoles: 18000 },
    { name: 'Data Analytics', baseRoles: 22000 },
    { name: 'Business Intelligence', baseRoles: 14000 },
    { name: 'Machine Learning', baseRoles: 8000 }
  ],
  operations: [
    { name: 'Operations Management', baseRoles: 20000 },
    { name: 'Business Operations', baseRoles: 15000 },
    { name: 'Customer Success', baseRoles: 18000 }
  ],
  leadership: [
    { name: 'Engineering Leadership', baseRoles: 8000 },
    { name: 'Product Leadership', baseRoles: 5000 },
    { name: 'General Management', baseRoles: 12000 }
  ],
  other: [
    { name: 'Various Roles', baseRoles: 50000 }
  ]
};

// ============================================
// Salary Benchmarks
// ============================================

const salaryRanges: Record<string, { min: number; max: number }> = {
  engineering: { min: 90000, max: 180000 },
  design: { min: 75000, max: 150000 },
  product: { min: 100000, max: 190000 },
  marketing: { min: 65000, max: 140000 },
  data: { min: 85000, max: 170000 },
  operations: { min: 60000, max: 120000 },
  leadership: { min: 150000, max: 300000 },
  other: { min: 50000, max: 120000 }
};

// ============================================
// Trending Roles by Profile
// ============================================

const trendingRoles: Array<{
  title: string;
  growth: number;
  relevantFor: string[];
  hollandFit: HollandType[];
  skillsNeeded: string[];
}> = [
  {
    title: 'AI/ML Product Manager',
    growth: 156,
    relevantFor: ['product', 'data', 'engineering'],
    hollandFit: ['I', 'E'],
    skillsNeeded: ['ML fundamentals', 'Product sense']
  },
  {
    title: 'Platform Engineer',
    growth: 89,
    relevantFor: ['engineering'],
    hollandFit: ['I', 'R'],
    skillsNeeded: ['Kubernetes', 'Cloud platforms']
  },
  {
    title: 'Growth Engineer',
    growth: 78,
    relevantFor: ['engineering', 'marketing'],
    hollandFit: ['I', 'E'],
    skillsNeeded: ['A/B testing', 'Analytics']
  },
  {
    title: 'AI Engineer',
    growth: 234,
    relevantFor: ['engineering', 'data'],
    hollandFit: ['I', 'R'],
    skillsNeeded: ['LLMs', 'Python', 'ML systems']
  },
  {
    title: 'Decision Scientist',
    growth: 67,
    relevantFor: ['data', 'product'],
    hollandFit: ['I', 'S'],
    skillsNeeded: ['Causal inference', 'Experimentation']
  },
  {
    title: 'Design Engineer',
    growth: 112,
    relevantFor: ['design', 'engineering'],
    hollandFit: ['A', 'I'],
    skillsNeeded: ['React', 'Design systems']
  },
  {
    title: 'Developer Experience Engineer',
    growth: 95,
    relevantFor: ['engineering'],
    hollandFit: ['I', 'S'],
    skillsNeeded: ['Developer tools', 'Documentation']
  },
  {
    title: 'Revenue Operations',
    growth: 58,
    relevantFor: ['operations', 'marketing'],
    hollandFit: ['C', 'E'],
    skillsNeeded: ['Salesforce', 'Analytics']
  }
];

// ============================================
// Calculate Fit Score
// ============================================

function calculateDomainFit(
  profile: CareerProfile,
  domainName: string
): 'high' | 'moderate' | 'low' {
  // Simple heuristic based on profile signals
  const { psychology } = profile;
  
  // Check Holland type match
  const hollandMatches: Record<string, HollandType[]> = {
    'Software Engineering': ['I', 'R'],
    'Data Science': ['I', 'C'],
    'Product Design': ['A', 'I'],
    'UX Research': ['I', 'S'],
    'Product Management': ['E', 'I'],
    'Growth Marketing': ['E', 'A'],
    'Leadership': ['E', 'S']
  };

  const matches = hollandMatches[domainName] || [];
  if (matches.includes(psychology.holland.primary)) {
    return 'high';
  }
  if (matches.includes(psychology.holland.secondary)) {
    return 'moderate';
  }
  
  return 'moderate'; // Default to moderate for role-relevant domains
}

function calculateRoleFit(
  profile: CareerProfile,
  role: typeof trendingRoles[0]
): 'high' | 'moderate' | 'low' {
  const { psychology } = profile;
  
  // Check Holland match
  const hollandMatch = role.hollandFit.includes(psychology.holland.primary);
  const roleMatch = role.relevantFor.includes(profile.role);
  
  if (hollandMatch && roleMatch) return 'high';
  if (hollandMatch || roleMatch) return 'moderate';
  return 'low';
}

// ============================================
// Generate Market Benchmarks
// ============================================

export function generateBenchmarks(profile: CareerProfile): MarketBenchmark {
  const role = profile.role || 'other';
  
  // Get relevant domains
  const baseDomains = roleToDomains[role] || roleToDomains.other;
  const matchingDomains = baseDomains.map(domain => ({
    name: domain.name,
    fit: calculateDomainFit(profile, domain.name),
    openRoles: domain.baseRoles + Math.floor(Math.random() * 2000) // Add some variance
  }));

  // Sort by fit
  matchingDomains.sort((a, b) => {
    const order = { high: 0, moderate: 1, low: 2 };
    return order[a.fit] - order[b.fit];
  });

  // Get salary range
  const baseSalary = salaryRanges[role] || salaryRanges.other;
  
  // Adjust based on career anchor
  let salaryMultiplier = 1;
  if (profile.psychology.careerAnchor.primary === 'lifestyle') {
    salaryMultiplier = 0.9; // Might trade salary for flexibility
  } else if (profile.psychology.careerAnchor.primary === 'challenge') {
    salaryMultiplier = 1.1; // Might aim higher
  }

  // Calculate remote percentage based on role and preferences
  let remotePercentage = 65;
  if (role === 'engineering' || role === 'data' || role === 'design') {
    remotePercentage = 75;
  } else if (role === 'leadership' || role === 'operations') {
    remotePercentage = 45;
  }

  // Get trending roles
  const relevantTrending = trendingRoles
    .filter(r => r.relevantFor.includes(role))
    .map(r => ({
      title: r.title,
      growth: r.growth,
      fit: calculateRoleFit(profile, r),
      skillGap: r.skillsNeeded.length > 0 ? r.skillsNeeded[0] : null
    }))
    .sort((a, b) => {
      // Sort by fit then growth
      const fitOrder = { high: 0, moderate: 1, low: 2 };
      if (fitOrder[a.fit] !== fitOrder[b.fit]) {
        return fitOrder[a.fit] - fitOrder[b.fit];
      }
      return b.growth - a.growth;
    })
    .slice(0, 4);

  return {
    matchingDomains: matchingDomains.slice(0, 4),
    salaryRange: {
      min: Math.round(baseSalary.min * salaryMultiplier),
      max: Math.round(baseSalary.max * salaryMultiplier),
      currency: 'USD'
    },
    remotePercentage,
    topLocations: ['San Francisco', 'New York', 'Austin', 'Seattle', 'Remote'],
    trendingRoles: relevantTrending
  };
}

