// Static role data for serverless environments where SQLite isn't available

export interface StaticRole {
  id: string;
  title: string;
  slug: string;
  department: string;
  level: string;
  description: string;
  keywords: { keyword: string; weight: number; type: string }[];
  salaryBands: { region: string; minSalary: number; maxSalary: number; currency: string; source: string; year: number }[];
}

export const staticRoles: StaticRole[] = [
  // EXECUTIVE
  {
    id: 'ceo',
    title: 'Chief Executive Officer',
    slug: 'ceo',
    department: 'Executive',
    level: 'CSuite',
    description: 'Leads the entire organization, sets strategic direction, and is accountable to the board and stakeholders.',
    keywords: [
      { keyword: 'strategic leadership', weight: 3, type: 'skill' },
      { keyword: 'P&L management', weight: 3, type: 'skill' },
      { keyword: 'board management', weight: 3, type: 'skill' },
      { keyword: 'fundraising', weight: 2, type: 'skill' },
      { keyword: 'M&A', weight: 2, type: 'skill' },
      { keyword: 'executive presence', weight: 2, type: 'trait' },
      { keyword: 'ARR growth', weight: 2, type: 'metric' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 300000, maxSalary: 600000, currency: 'USD', source: 'levels.fyi', year: 2024 },
    ],
  },
  {
    id: 'cto',
    title: 'Chief Technology Officer',
    slug: 'cto',
    department: 'Executive',
    level: 'CSuite',
    description: 'Oversees all technology strategy, architecture, and engineering teams.',
    keywords: [
      { keyword: 'technology strategy', weight: 3, type: 'skill' },
      { keyword: 'engineering leadership', weight: 3, type: 'skill' },
      { keyword: 'architecture', weight: 3, type: 'skill' },
      { keyword: 'scalability', weight: 3, type: 'skill' },
      { keyword: 'cloud infrastructure', weight: 2, type: 'skill' },
      { keyword: 'AI/ML', weight: 2, type: 'skill' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 280000, maxSalary: 500000, currency: 'USD', source: 'levels.fyi', year: 2024 },
    ],
  },
  // SOLUTIONS
  {
    id: 'solution-architect',
    title: 'Solution Architect',
    slug: 'solution-architect',
    department: 'Solutions',
    level: 'IC',
    description: 'Designs technical solutions for customer needs, bridges sales and engineering.',
    keywords: [
      { keyword: 'solution design', weight: 3, type: 'skill' },
      { keyword: 'technical architecture', weight: 3, type: 'skill' },
      { keyword: 'customer-facing', weight: 3, type: 'trait' },
      { keyword: 'presales', weight: 3, type: 'skill' },
      { keyword: 'proof of concept', weight: 2, type: 'skill' },
      { keyword: 'API integration', weight: 2, type: 'skill' },
      { keyword: 'AWS', weight: 2, type: 'tool' },
      { keyword: 'Azure', weight: 2, type: 'tool' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 150000, maxSalary: 220000, currency: 'USD', source: 'levels.fyi', year: 2024 },
    ],
  },
  {
    id: 'head-solution-architecture',
    title: 'Head of Solution Architecture',
    slug: 'head-solution-architecture',
    department: 'Solutions',
    level: 'Director',
    description: 'Leads solution architecture team, defines technical standards for customer engagements.',
    keywords: [
      { keyword: 'solution architecture', weight: 3, type: 'skill' },
      { keyword: 'team leadership', weight: 3, type: 'skill' },
      { keyword: 'technical strategy', weight: 3, type: 'skill' },
      { keyword: 'enterprise accounts', weight: 3, type: 'skill' },
      { keyword: 'presales enablement', weight: 2, type: 'skill' },
      { keyword: 'win rate', weight: 2, type: 'metric' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 200000, maxSalary: 300000, currency: 'USD', source: 'levels.fyi', year: 2024 },
    ],
  },
  // SALES
  {
    id: 'account-executive',
    title: 'Account Executive',
    slug: 'account-executive',
    department: 'Sales',
    level: 'IC',
    description: 'Manages full sales cycle from prospecting to close for mid-market accounts.',
    keywords: [
      { keyword: 'full-cycle sales', weight: 3, type: 'skill' },
      { keyword: 'quota attainment', weight: 3, type: 'metric' },
      { keyword: 'prospecting', weight: 3, type: 'skill' },
      { keyword: 'negotiation', weight: 3, type: 'skill' },
      { keyword: 'Salesforce', weight: 2, type: 'tool' },
      { keyword: 'SaaS sales', weight: 2, type: 'skill' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 80000, maxSalary: 150000, currency: 'USD', source: 'levels.fyi', year: 2024 },
    ],
  },
  {
    id: 'global-account-manager',
    title: 'Global Account Manager',
    slug: 'global-account-manager',
    department: 'Sales',
    level: 'IC',
    description: 'Manages relationships with global enterprise accounts across multiple regions.',
    keywords: [
      { keyword: 'global accounts', weight: 3, type: 'skill' },
      { keyword: 'strategic planning', weight: 3, type: 'skill' },
      { keyword: 'account growth', weight: 3, type: 'metric' },
      { keyword: 'executive relationships', weight: 3, type: 'skill' },
      { keyword: 'ARR growth', weight: 2, type: 'metric' },
      { keyword: 'Fortune 500', weight: 2, type: 'trait' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 180000, maxSalary: 320000, currency: 'USD', source: 'levels.fyi', year: 2024 },
    ],
  },
  {
    id: 'enterprise-account-executive',
    title: 'Enterprise Account Executive',
    slug: 'enterprise-account-executive',
    department: 'Sales',
    level: 'IC',
    description: 'Manages complex enterprise sales cycles with Fortune 500 and large organizations.',
    keywords: [
      { keyword: 'enterprise sales', weight: 3, type: 'skill' },
      { keyword: 'C-suite selling', weight: 3, type: 'skill' },
      { keyword: 'quota attainment', weight: 3, type: 'metric' },
      { keyword: 'MEDDIC', weight: 2, type: 'skill' },
      { keyword: 'contract negotiation', weight: 2, type: 'skill' },
      { keyword: 'ACV', weight: 2, type: 'metric' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 150000, maxSalary: 280000, currency: 'USD', source: 'levels.fyi', year: 2024 },
    ],
  },
  // CUSTOMER SUCCESS
  {
    id: 'customer-success-manager',
    title: 'Customer Success Manager',
    slug: 'customer-success-manager',
    department: 'CustomerSuccess',
    level: 'IC',
    description: 'Ensures customers achieve their goals and realize value from the product.',
    keywords: [
      { keyword: 'customer success', weight: 3, type: 'skill' },
      { keyword: 'retention', weight: 3, type: 'metric' },
      { keyword: 'NRR', weight: 3, type: 'metric' },
      { keyword: 'adoption', weight: 3, type: 'metric' },
      { keyword: 'QBR', weight: 2, type: 'skill' },
      { keyword: 'Gainsight', weight: 2, type: 'tool' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 80000, maxSalary: 140000, currency: 'USD', source: 'levels.fyi', year: 2024 },
    ],
  },
  {
    id: 'head-customer-success',
    title: 'Head of Customer Success',
    slug: 'head-customer-success',
    department: 'CustomerSuccess',
    level: 'Director',
    description: 'Leads customer success organization, owns retention and expansion metrics.',
    keywords: [
      { keyword: 'customer success leadership', weight: 3, type: 'skill' },
      { keyword: 'NRR', weight: 3, type: 'metric' },
      { keyword: 'gross retention', weight: 3, type: 'metric' },
      { keyword: 'team management', weight: 3, type: 'skill' },
      { keyword: 'playbook development', weight: 2, type: 'skill' },
      { keyword: 'churn analysis', weight: 2, type: 'skill' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 180000, maxSalary: 280000, currency: 'USD', source: 'levels.fyi', year: 2024 },
    ],
  },
  // PRODUCT
  {
    id: 'product-manager',
    title: 'Product Manager',
    slug: 'product-manager',
    department: 'Product',
    level: 'IC',
    description: 'Defines product strategy and roadmap, works with engineering to deliver features.',
    keywords: [
      { keyword: 'product management', weight: 3, type: 'skill' },
      { keyword: 'roadmap', weight: 3, type: 'skill' },
      { keyword: 'user research', weight: 3, type: 'skill' },
      { keyword: 'PRD', weight: 3, type: 'skill' },
      { keyword: 'agile', weight: 2, type: 'skill' },
      { keyword: 'Jira', weight: 2, type: 'tool' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 120000, maxSalary: 180000, currency: 'USD', source: 'levels.fyi', year: 2024 },
    ],
  },
  {
    id: 'head-product',
    title: 'Head of Product',
    slug: 'head-product',
    department: 'Product',
    level: 'Director',
    description: 'Leads product organization, sets overall product vision and strategy.',
    keywords: [
      { keyword: 'product leadership', weight: 3, type: 'skill' },
      { keyword: 'product vision', weight: 3, type: 'skill' },
      { keyword: 'team management', weight: 3, type: 'skill' },
      { keyword: 'strategic planning', weight: 3, type: 'skill' },
      { keyword: 'market analysis', weight: 2, type: 'skill' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 200000, maxSalary: 320000, currency: 'USD', source: 'levels.fyi', year: 2024 },
    ],
  },
  {
    id: 'portfolio-manager',
    title: 'Portfolio Manager',
    slug: 'portfolio-manager',
    department: 'Product',
    level: 'Manager',
    description: 'Manages product portfolio, balances investments across product lines.',
    keywords: [
      { keyword: 'portfolio management', weight: 3, type: 'skill' },
      { keyword: 'resource allocation', weight: 3, type: 'skill' },
      { keyword: 'strategic planning', weight: 3, type: 'skill' },
      { keyword: 'ROI analysis', weight: 2, type: 'skill' },
      { keyword: 'prioritization', weight: 2, type: 'skill' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 150000, maxSalary: 250000, currency: 'USD', source: 'glassdoor', year: 2024 },
    ],
  },
  // ENGINEERING
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    slug: 'software-engineer',
    department: 'Engineering',
    level: 'IC',
    description: 'Designs, develops, and maintains software applications.',
    keywords: [
      { keyword: 'software development', weight: 3, type: 'skill' },
      { keyword: 'coding', weight: 3, type: 'skill' },
      { keyword: 'JavaScript', weight: 2, type: 'skill' },
      { keyword: 'TypeScript', weight: 2, type: 'skill' },
      { keyword: 'React', weight: 2, type: 'tool' },
      { keyword: 'Node.js', weight: 2, type: 'tool' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 100000, maxSalary: 180000, currency: 'USD', source: 'levels.fyi', year: 2024 },
    ],
  },
  {
    id: 'engineering-manager',
    title: 'Engineering Manager',
    slug: 'engineering-manager',
    department: 'Engineering',
    level: 'Manager',
    description: 'Manages engineering team, responsible for delivery and team growth.',
    keywords: [
      { keyword: 'engineering management', weight: 3, type: 'skill' },
      { keyword: 'people management', weight: 3, type: 'skill' },
      { keyword: 'team leadership', weight: 3, type: 'skill' },
      { keyword: 'delivery', weight: 3, type: 'skill' },
      { keyword: 'hiring', weight: 2, type: 'skill' },
      { keyword: 'agile', weight: 2, type: 'skill' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 180000, maxSalary: 280000, currency: 'USD', source: 'levels.fyi', year: 2024 },
    ],
  },
];

export function getStaticRoles(department?: string, level?: string, query?: string) {
  let roles = staticRoles;

  if (department) {
    roles = roles.filter(r => r.department === department);
  }

  if (level) {
    roles = roles.filter(r => r.level === level);
  }

  if (query) {
    const q = query.toLowerCase();
    roles = roles.filter(r => 
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.keywords.some(k => k.keyword.toLowerCase().includes(q))
    );
  }

  return roles;
}

export function getStaticRoleBySlug(slug: string) {
  return staticRoles.find(r => r.slug === slug) || null;
}
