import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, 'dev.db');
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

interface RoleSeedData {
  title: string;
  slug: string;
  department: string;
  level: string;
  description: string;
  keywords: { keyword: string; weight: number; type: string }[];
  salaryBands: { region: string; minSalary: number; maxSalary: number; currency: string; source: string; year: number }[];
}

const roles: RoleSeedData[] = [
  // ============================================
  // EXECUTIVE
  // ============================================
  {
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
      { keyword: 'IPO', weight: 2, type: 'metric' },
      { keyword: 'M&A', weight: 2, type: 'skill' },
      { keyword: 'executive presence', weight: 2, type: 'trait' },
      { keyword: 'vision', weight: 2, type: 'trait' },
      { keyword: 'scaling', weight: 2, type: 'skill' },
      { keyword: 'Series A', weight: 1, type: 'metric' },
      { keyword: 'Series B', weight: 1, type: 'metric' },
      { keyword: 'ARR growth', weight: 2, type: 'metric' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 300000, maxSalary: 600000, currency: 'USD', source: 'levels.fyi', year: 2024 },
      { region: 'US-SF', minSalary: 400000, maxSalary: 800000, currency: 'USD', source: 'levels.fyi', year: 2024 },
    ],
  },
  {
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
      { keyword: 'security', weight: 2, type: 'skill' },
      { keyword: 'DevOps', weight: 2, type: 'skill' },
      { keyword: 'AI/ML', weight: 2, type: 'skill' },
      { keyword: 'technical debt', weight: 1, type: 'skill' },
      { keyword: 'team building', weight: 2, type: 'skill' },
      { keyword: 'budget management', weight: 2, type: 'skill' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 280000, maxSalary: 500000, currency: 'USD', source: 'levels.fyi', year: 2024 },
      { region: 'US-SF', minSalary: 350000, maxSalary: 650000, currency: 'USD', source: 'levels.fyi', year: 2024 },
    ],
  },
  {
    title: 'Chief Revenue Officer',
    slug: 'cro',
    department: 'Executive',
    level: 'CSuite',
    description: 'Owns all revenue-generating functions including sales, marketing, and customer success.',
    keywords: [
      { keyword: 'revenue growth', weight: 3, type: 'metric' },
      { keyword: 'go-to-market strategy', weight: 3, type: 'skill' },
      { keyword: 'sales leadership', weight: 3, type: 'skill' },
      { keyword: 'ARR', weight: 3, type: 'metric' },
      { keyword: 'pipeline management', weight: 2, type: 'skill' },
      { keyword: 'forecasting', weight: 2, type: 'skill' },
      { keyword: 'customer acquisition', weight: 2, type: 'skill' },
      { keyword: 'NRR', weight: 2, type: 'metric' },
      { keyword: 'quota attainment', weight: 2, type: 'metric' },
      { keyword: 'SaaS metrics', weight: 2, type: 'skill' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 250000, maxSalary: 450000, currency: 'USD', source: 'levels.fyi', year: 2024 },
      { region: 'US-SF', minSalary: 300000, maxSalary: 550000, currency: 'USD', source: 'levels.fyi', year: 2024 },
    ],
  },
  {
    title: 'VP of Engineering',
    slug: 'vp-engineering',
    department: 'Executive',
    level: 'VP',
    description: 'Leads engineering organization, responsible for delivery, team growth, and technical excellence.',
    keywords: [
      { keyword: 'engineering management', weight: 3, type: 'skill' },
      { keyword: 'team building', weight: 3, type: 'skill' },
      { keyword: 'delivery', weight: 3, type: 'skill' },
      { keyword: 'agile', weight: 2, type: 'skill' },
      { keyword: 'hiring', weight: 2, type: 'skill' },
      { keyword: 'architecture', weight: 2, type: 'skill' },
      { keyword: 'technical roadmap', weight: 2, type: 'skill' },
      { keyword: 'cross-functional', weight: 2, type: 'trait' },
      { keyword: 'velocity', weight: 1, type: 'metric' },
      { keyword: 'retention', weight: 1, type: 'metric' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 250000, maxSalary: 400000, currency: 'USD', source: 'levels.fyi', year: 2024 },
      { region: 'US-SF', minSalary: 300000, maxSalary: 500000, currency: 'USD', source: 'levels.fyi', year: 2024 },
    ],
  },
  {
    title: 'VP of Sales',
    slug: 'vp-sales',
    department: 'Executive',
    level: 'VP',
    description: 'Leads sales organization, responsible for revenue targets and team performance.',
    keywords: [
      { keyword: 'sales leadership', weight: 3, type: 'skill' },
      { keyword: 'quota attainment', weight: 3, type: 'metric' },
      { keyword: 'pipeline management', weight: 3, type: 'skill' },
      { keyword: 'enterprise sales', weight: 3, type: 'skill' },
      { keyword: 'forecasting', weight: 2, type: 'skill' },
      { keyword: 'coaching', weight: 2, type: 'skill' },
      { keyword: 'CRM', weight: 2, type: 'tool' },
      { keyword: 'Salesforce', weight: 2, type: 'tool' },
      { keyword: 'territory planning', weight: 2, type: 'skill' },
      { keyword: 'deal closure', weight: 2, type: 'metric' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 220000, maxSalary: 380000, currency: 'USD', source: 'levels.fyi', year: 2024 },
      { region: 'US-SF', minSalary: 280000, maxSalary: 450000, currency: 'USD', source: 'levels.fyi', year: 2024 },
    ],
  },

  // ============================================
  // SOLUTIONS / PRE-SALES
  // ============================================
  {
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
      { keyword: 'cloud', weight: 2, type: 'skill' },
      { keyword: 'AWS', weight: 2, type: 'tool' },
      { keyword: 'Azure', weight: 2, type: 'tool' },
      { keyword: 'GCP', weight: 2, type: 'tool' },
      { keyword: 'enterprise', weight: 2, type: 'trait' },
      { keyword: 'RFP', weight: 1, type: 'skill' },
      { keyword: 'technical demo', weight: 2, type: 'skill' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 150000, maxSalary: 220000, currency: 'USD', source: 'levels.fyi', year: 2024 },
      { region: 'US-SF', minSalary: 180000, maxSalary: 260000, currency: 'USD', source: 'levels.fyi', year: 2024 },
    ],
  },
  {
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
      { keyword: 'deal size', weight: 2, type: 'metric' },
      { keyword: 'cross-functional', weight: 2, type: 'trait' },
      { keyword: 'stakeholder management', weight: 2, type: 'skill' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 200000, maxSalary: 300000, currency: 'USD', source: 'levels.fyi', year: 2024 },
      { region: 'US-SF', minSalary: 250000, maxSalary: 380000, currency: 'USD', source: 'levels.fyi', year: 2024 },
    ],
  },
  {
    title: 'Sales Engineer',
    slug: 'sales-engineer',
    department: 'Solutions',
    level: 'IC',
    description: 'Provides technical expertise in sales cycles, conducts demos and POCs.',
    keywords: [
      { keyword: 'technical demos', weight: 3, type: 'skill' },
      { keyword: 'proof of concept', weight: 3, type: 'skill' },
      { keyword: 'sales support', weight: 3, type: 'skill' },
      { keyword: 'customer discovery', weight: 2, type: 'skill' },
      { keyword: 'objection handling', weight: 2, type: 'skill' },
      { keyword: 'API', weight: 2, type: 'skill' },
      { keyword: 'integration', weight: 2, type: 'skill' },
      { keyword: 'communication', weight: 2, type: 'trait' },
      { keyword: 'product knowledge', weight: 2, type: 'skill' },
      { keyword: 'RFP response', weight: 1, type: 'skill' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 120000, maxSalary: 180000, currency: 'USD', source: 'levels.fyi', year: 2024 },
      { region: 'US-SF', minSalary: 150000, maxSalary: 220000, currency: 'USD', source: 'levels.fyi', year: 2024 },
    ],
  },
  {
    title: 'Technical Account Manager',
    slug: 'technical-account-manager',
    department: 'Solutions',
    level: 'IC',
    description: 'Serves as technical point of contact for strategic accounts, ensures adoption and value realization.',
    keywords: [
      { keyword: 'technical consulting', weight: 3, type: 'skill' },
      { keyword: 'account management', weight: 3, type: 'skill' },
      { keyword: 'customer success', weight: 3, type: 'skill' },
      { keyword: 'adoption', weight: 2, type: 'metric' },
      { keyword: 'expansion', weight: 2, type: 'metric' },
      { keyword: 'relationship building', weight: 2, type: 'trait' },
      { keyword: 'technical guidance', weight: 2, type: 'skill' },
      { keyword: 'troubleshooting', weight: 2, type: 'skill' },
      { keyword: 'executive communication', weight: 2, type: 'skill' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 130000, maxSalary: 190000, currency: 'USD', source: 'levels.fyi', year: 2024 },
      { region: 'US-SF', minSalary: 160000, maxSalary: 230000, currency: 'USD', source: 'levels.fyi', year: 2024 },
    ],
  },
  {
    title: 'Pre-Sales Consultant',
    slug: 'presales-consultant',
    department: 'Solutions',
    level: 'IC',
    description: 'Supports sales team with technical expertise during the sales process.',
    keywords: [
      { keyword: 'presales', weight: 3, type: 'skill' },
      { keyword: 'consulting', weight: 3, type: 'skill' },
      { keyword: 'requirements gathering', weight: 2, type: 'skill' },
      { keyword: 'solution scoping', weight: 2, type: 'skill' },
      { keyword: 'presentation', weight: 2, type: 'skill' },
      { keyword: 'demo', weight: 2, type: 'skill' },
      { keyword: 'proposal writing', weight: 2, type: 'skill' },
      { keyword: 'SaaS', weight: 2, type: 'skill' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 100000, maxSalary: 160000, currency: 'USD', source: 'glassdoor', year: 2024 },
      { region: 'US-SF', minSalary: 130000, maxSalary: 190000, currency: 'USD', source: 'glassdoor', year: 2024 },
    ],
  },

  // ============================================
  // SALES
  // ============================================
  {
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
      { keyword: 'closing', weight: 3, type: 'skill' },
      { keyword: 'Salesforce', weight: 2, type: 'tool' },
      { keyword: 'pipeline management', weight: 2, type: 'skill' },
      { keyword: 'discovery calls', weight: 2, type: 'skill' },
      { keyword: 'SaaS sales', weight: 2, type: 'skill' },
      { keyword: 'cold outreach', weight: 1, type: 'skill' },
      { keyword: 'deal velocity', weight: 1, type: 'metric' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 80000, maxSalary: 150000, currency: 'USD', source: 'levels.fyi', year: 2024 },
      { region: 'US-SF', minSalary: 100000, maxSalary: 180000, currency: 'USD', source: 'levels.fyi', year: 2024 },
    ],
  },
  {
    title: 'Enterprise Account Executive',
    slug: 'enterprise-account-executive',
    department: 'Sales',
    level: 'IC',
    description: 'Manages complex enterprise sales cycles with Fortune 500 and large organizations.',
    keywords: [
      { keyword: 'enterprise sales', weight: 3, type: 'skill' },
      { keyword: 'strategic accounts', weight: 3, type: 'skill' },
      { keyword: 'C-suite selling', weight: 3, type: 'skill' },
      { keyword: 'complex deals', weight: 3, type: 'skill' },
      { keyword: 'quota attainment', weight: 3, type: 'metric' },
      { keyword: 'multi-threading', weight: 2, type: 'skill' },
      { keyword: 'MEDDIC', weight: 2, type: 'skill' },
      { keyword: 'Challenger Sale', weight: 2, type: 'skill' },
      { keyword: 'contract negotiation', weight: 2, type: 'skill' },
      { keyword: 'ACV', weight: 2, type: 'metric' },
      { keyword: 'land and expand', weight: 2, type: 'skill' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 150000, maxSalary: 280000, currency: 'USD', source: 'levels.fyi', year: 2024 },
      { region: 'US-SF', minSalary: 180000, maxSalary: 350000, currency: 'USD', source: 'levels.fyi', year: 2024 },
    ],
  },
  {
    title: 'Global Account Manager',
    slug: 'global-account-manager',
    department: 'Sales',
    level: 'IC',
    description: 'Manages relationships with global enterprise accounts across multiple regions.',
    keywords: [
      { keyword: 'global accounts', weight: 3, type: 'skill' },
      { keyword: 'strategic planning', weight: 3, type: 'skill' },
      { keyword: 'account growth', weight: 3, type: 'metric' },
      { keyword: 'cross-regional', weight: 3, type: 'skill' },
      { keyword: 'executive relationships', weight: 3, type: 'skill' },
      { keyword: 'ARR growth', weight: 2, type: 'metric' },
      { keyword: 'account planning', weight: 2, type: 'skill' },
      { keyword: 'stakeholder management', weight: 2, type: 'skill' },
      { keyword: 'Fortune 500', weight: 2, type: 'trait' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 180000, maxSalary: 320000, currency: 'USD', source: 'levels.fyi', year: 2024 },
      { region: 'US-SF', minSalary: 220000, maxSalary: 400000, currency: 'USD', source: 'levels.fyi', year: 2024 },
    ],
  },
  {
    title: 'Sales Director',
    slug: 'sales-director',
    department: 'Sales',
    level: 'Director',
    description: 'Leads a team of account executives, responsible for regional or segment revenue.',
    keywords: [
      { keyword: 'sales leadership', weight: 3, type: 'skill' },
      { keyword: 'team management', weight: 3, type: 'skill' },
      { keyword: 'quota achievement', weight: 3, type: 'metric' },
      { keyword: 'coaching', weight: 3, type: 'skill' },
      { keyword: 'hiring', weight: 2, type: 'skill' },
      { keyword: 'forecasting', weight: 2, type: 'skill' },
      { keyword: 'pipeline review', weight: 2, type: 'skill' },
      { keyword: 'territory planning', weight: 2, type: 'skill' },
      { keyword: 'revenue operations', weight: 2, type: 'skill' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 180000, maxSalary: 280000, currency: 'USD', source: 'levels.fyi', year: 2024 },
      { region: 'US-SF', minSalary: 220000, maxSalary: 350000, currency: 'USD', source: 'levels.fyi', year: 2024 },
    ],
  },
  {
    title: 'Regional Sales Manager',
    slug: 'regional-sales-manager',
    department: 'Sales',
    level: 'Manager',
    description: 'Manages sales team for a specific geographic region.',
    keywords: [
      { keyword: 'regional sales', weight: 3, type: 'skill' },
      { keyword: 'team leadership', weight: 3, type: 'skill' },
      { keyword: 'territory management', weight: 3, type: 'skill' },
      { keyword: 'quota achievement', weight: 3, type: 'metric' },
      { keyword: 'coaching', weight: 2, type: 'skill' },
      { keyword: 'market development', weight: 2, type: 'skill' },
      { keyword: 'partner relationships', weight: 2, type: 'skill' },
      { keyword: 'forecasting', weight: 2, type: 'skill' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 140000, maxSalary: 220000, currency: 'USD', source: 'glassdoor', year: 2024 },
      { region: 'US-SF', minSalary: 170000, maxSalary: 280000, currency: 'USD', source: 'glassdoor', year: 2024 },
    ],
  },

  // ============================================
  // CUSTOMER SUCCESS
  // ============================================
  {
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
      { keyword: 'relationship management', weight: 3, type: 'skill' },
      { keyword: 'QBR', weight: 2, type: 'skill' },
      { keyword: 'health scores', weight: 2, type: 'skill' },
      { keyword: 'upselling', weight: 2, type: 'skill' },
      { keyword: 'churn prevention', weight: 2, type: 'skill' },
      { keyword: 'Gainsight', weight: 2, type: 'tool' },
      { keyword: 'onboarding', weight: 2, type: 'skill' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 80000, maxSalary: 140000, currency: 'USD', source: 'levels.fyi', year: 2024 },
      { region: 'US-SF', minSalary: 100000, maxSalary: 170000, currency: 'USD', source: 'levels.fyi', year: 2024 },
    ],
  },
  {
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
      { keyword: 'customer journey', weight: 2, type: 'skill' },
      { keyword: 'executive sponsor', weight: 2, type: 'skill' },
      { keyword: 'scaling', weight: 2, type: 'skill' },
      { keyword: 'churn analysis', weight: 2, type: 'skill' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 180000, maxSalary: 280000, currency: 'USD', source: 'levels.fyi', year: 2024 },
      { region: 'US-SF', minSalary: 220000, maxSalary: 350000, currency: 'USD', source: 'levels.fyi', year: 2024 },
    ],
  },
  {
    title: 'Customer Success Director',
    slug: 'customer-success-director',
    department: 'CustomerSuccess',
    level: 'Director',
    description: 'Manages team of CSMs, owns retention for a customer segment.',
    keywords: [
      { keyword: 'customer success management', weight: 3, type: 'skill' },
      { keyword: 'team leadership', weight: 3, type: 'skill' },
      { keyword: 'retention', weight: 3, type: 'metric' },
      { keyword: 'expansion revenue', weight: 3, type: 'metric' },
      { keyword: 'hiring', weight: 2, type: 'skill' },
      { keyword: 'process improvement', weight: 2, type: 'skill' },
      { keyword: 'customer advocacy', weight: 2, type: 'skill' },
      { keyword: 'executive relationships', weight: 2, type: 'skill' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 150000, maxSalary: 230000, currency: 'USD', source: 'levels.fyi', year: 2024 },
      { region: 'US-SF', minSalary: 180000, maxSalary: 280000, currency: 'USD', source: 'levels.fyi', year: 2024 },
    ],
  },
  {
    title: 'Onboarding Specialist',
    slug: 'onboarding-specialist',
    department: 'CustomerSuccess',
    level: 'IC',
    description: 'Guides new customers through implementation and initial adoption.',
    keywords: [
      { keyword: 'onboarding', weight: 3, type: 'skill' },
      { keyword: 'implementation', weight: 3, type: 'skill' },
      { keyword: 'training', weight: 3, type: 'skill' },
      { keyword: 'time to value', weight: 3, type: 'metric' },
      { keyword: 'project management', weight: 2, type: 'skill' },
      { keyword: 'customer education', weight: 2, type: 'skill' },
      { keyword: 'documentation', weight: 2, type: 'skill' },
      { keyword: 'product adoption', weight: 2, type: 'metric' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 60000, maxSalary: 100000, currency: 'USD', source: 'glassdoor', year: 2024 },
      { region: 'US-SF', minSalary: 75000, maxSalary: 120000, currency: 'USD', source: 'glassdoor', year: 2024 },
    ],
  },
  {
    title: 'Renewal Manager',
    slug: 'renewal-manager',
    department: 'CustomerSuccess',
    level: 'IC',
    description: 'Manages contract renewals and identifies expansion opportunities.',
    keywords: [
      { keyword: 'renewal management', weight: 3, type: 'skill' },
      { keyword: 'contract negotiation', weight: 3, type: 'skill' },
      { keyword: 'retention', weight: 3, type: 'metric' },
      { keyword: 'forecasting', weight: 2, type: 'skill' },
      { keyword: 'upselling', weight: 2, type: 'skill' },
      { keyword: 'customer health', weight: 2, type: 'skill' },
      { keyword: 'risk mitigation', weight: 2, type: 'skill' },
      { keyword: 'Salesforce', weight: 2, type: 'tool' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 70000, maxSalary: 120000, currency: 'USD', source: 'glassdoor', year: 2024 },
      { region: 'US-SF', minSalary: 90000, maxSalary: 150000, currency: 'USD', source: 'glassdoor', year: 2024 },
    ],
  },

  // ============================================
  // PRODUCT
  // ============================================
  {
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
      { keyword: 'stakeholder management', weight: 2, type: 'skill' },
      { keyword: 'prioritization', weight: 2, type: 'skill' },
      { keyword: 'metrics', weight: 2, type: 'skill' },
      { keyword: 'A/B testing', weight: 2, type: 'skill' },
      { keyword: 'Jira', weight: 2, type: 'tool' },
      { keyword: 'customer interviews', weight: 2, type: 'skill' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 120000, maxSalary: 180000, currency: 'USD', source: 'levels.fyi', year: 2024 },
      { region: 'US-SF', minSalary: 150000, maxSalary: 220000, currency: 'USD', source: 'levels.fyi', year: 2024 },
    ],
  },
  {
    title: 'Senior Product Manager',
    slug: 'senior-product-manager',
    department: 'Product',
    level: 'IC',
    description: 'Leads product strategy for a major feature area or product line.',
    keywords: [
      { keyword: 'product strategy', weight: 3, type: 'skill' },
      { keyword: 'product vision', weight: 3, type: 'skill' },
      { keyword: 'roadmap planning', weight: 3, type: 'skill' },
      { keyword: 'cross-functional leadership', weight: 3, type: 'skill' },
      { keyword: 'OKRs', weight: 2, type: 'skill' },
      { keyword: 'go-to-market', weight: 2, type: 'skill' },
      { keyword: 'data-driven', weight: 2, type: 'trait' },
      { keyword: 'mentoring', weight: 2, type: 'skill' },
      { keyword: 'product analytics', weight: 2, type: 'skill' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 160000, maxSalary: 240000, currency: 'USD', source: 'levels.fyi', year: 2024 },
      { region: 'US-SF', minSalary: 200000, maxSalary: 300000, currency: 'USD', source: 'levels.fyi', year: 2024 },
    ],
  },
  {
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
      { keyword: 'hiring', weight: 2, type: 'skill' },
      { keyword: 'stakeholder alignment', weight: 2, type: 'skill' },
      { keyword: 'market analysis', weight: 2, type: 'skill' },
      { keyword: 'competitive intelligence', weight: 2, type: 'skill' },
      { keyword: 'executive communication', weight: 2, type: 'skill' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 200000, maxSalary: 320000, currency: 'USD', source: 'levels.fyi', year: 2024 },
      { region: 'US-SF', minSalary: 250000, maxSalary: 400000, currency: 'USD', source: 'levels.fyi', year: 2024 },
    ],
  },
  {
    title: 'Technical Product Manager',
    slug: 'technical-product-manager',
    department: 'Product',
    level: 'IC',
    description: 'Manages technical products like APIs, platforms, or developer tools.',
    keywords: [
      { keyword: 'technical product management', weight: 3, type: 'skill' },
      { keyword: 'API', weight: 3, type: 'skill' },
      { keyword: 'platform', weight: 3, type: 'skill' },
      { keyword: 'developer experience', weight: 3, type: 'skill' },
      { keyword: 'technical architecture', weight: 2, type: 'skill' },
      { keyword: 'documentation', weight: 2, type: 'skill' },
      { keyword: 'developer relations', weight: 2, type: 'skill' },
      { keyword: 'SDK', weight: 2, type: 'skill' },
      { keyword: 'integration', weight: 2, type: 'skill' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 140000, maxSalary: 220000, currency: 'USD', source: 'levels.fyi', year: 2024 },
      { region: 'US-SF', minSalary: 170000, maxSalary: 270000, currency: 'USD', source: 'levels.fyi', year: 2024 },
    ],
  },
  {
    title: 'Group Product Manager',
    slug: 'group-product-manager',
    department: 'Product',
    level: 'Manager',
    description: 'Manages multiple product managers, owns a product area.',
    keywords: [
      { keyword: 'product leadership', weight: 3, type: 'skill' },
      { keyword: 'people management', weight: 3, type: 'skill' },
      { keyword: 'product area ownership', weight: 3, type: 'skill' },
      { keyword: 'portfolio management', weight: 2, type: 'skill' },
      { keyword: 'mentoring', weight: 2, type: 'skill' },
      { keyword: 'strategy', weight: 2, type: 'skill' },
      { keyword: 'cross-functional', weight: 2, type: 'trait' },
      { keyword: 'roadmap alignment', weight: 2, type: 'skill' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 180000, maxSalary: 280000, currency: 'USD', source: 'levels.fyi', year: 2024 },
      { region: 'US-SF', minSalary: 220000, maxSalary: 350000, currency: 'USD', source: 'levels.fyi', year: 2024 },
    ],
  },
  {
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
      { keyword: 'business case', weight: 2, type: 'skill' },
      { keyword: 'stakeholder management', weight: 2, type: 'skill' },
      { keyword: 'financial modeling', weight: 2, type: 'skill' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 150000, maxSalary: 250000, currency: 'USD', source: 'glassdoor', year: 2024 },
      { region: 'US-SF', minSalary: 180000, maxSalary: 300000, currency: 'USD', source: 'glassdoor', year: 2024 },
    ],
  },

  // ============================================
  // ENGINEERING (for reference)
  // ============================================
  {
    title: 'Software Engineer',
    slug: 'software-engineer',
    department: 'Engineering',
    level: 'IC',
    description: 'Designs, develops, and maintains software applications.',
    keywords: [
      { keyword: 'software development', weight: 3, type: 'skill' },
      { keyword: 'coding', weight: 3, type: 'skill' },
      { keyword: 'problem solving', weight: 3, type: 'trait' },
      { keyword: 'JavaScript', weight: 2, type: 'skill' },
      { keyword: 'TypeScript', weight: 2, type: 'skill' },
      { keyword: 'Python', weight: 2, type: 'skill' },
      { keyword: 'React', weight: 2, type: 'tool' },
      { keyword: 'Node.js', weight: 2, type: 'tool' },
      { keyword: 'Git', weight: 2, type: 'tool' },
      { keyword: 'agile', weight: 1, type: 'skill' },
      { keyword: 'code review', weight: 1, type: 'skill' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 100000, maxSalary: 180000, currency: 'USD', source: 'levels.fyi', year: 2024 },
      { region: 'US-SF', minSalary: 130000, maxSalary: 220000, currency: 'USD', source: 'levels.fyi', year: 2024 },
    ],
  },
  {
    title: 'Staff Software Engineer',
    slug: 'staff-software-engineer',
    department: 'Engineering',
    level: 'IC',
    description: 'Senior technical leader who drives architecture and mentors engineers.',
    keywords: [
      { keyword: 'technical leadership', weight: 3, type: 'skill' },
      { keyword: 'system design', weight: 3, type: 'skill' },
      { keyword: 'architecture', weight: 3, type: 'skill' },
      { keyword: 'mentoring', weight: 3, type: 'skill' },
      { keyword: 'cross-team collaboration', weight: 2, type: 'skill' },
      { keyword: 'technical strategy', weight: 2, type: 'skill' },
      { keyword: 'scalability', weight: 2, type: 'skill' },
      { keyword: 'performance optimization', weight: 2, type: 'skill' },
      { keyword: 'design patterns', weight: 2, type: 'skill' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 180000, maxSalary: 280000, currency: 'USD', source: 'levels.fyi', year: 2024 },
      { region: 'US-SF', minSalary: 220000, maxSalary: 350000, currency: 'USD', source: 'levels.fyi', year: 2024 },
    ],
  },
  {
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
      { keyword: 'coaching', weight: 2, type: 'skill' },
      { keyword: 'agile', weight: 2, type: 'skill' },
      { keyword: 'sprint planning', weight: 2, type: 'skill' },
      { keyword: 'performance reviews', weight: 2, type: 'skill' },
      { keyword: 'career development', weight: 2, type: 'skill' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 180000, maxSalary: 280000, currency: 'USD', source: 'levels.fyi', year: 2024 },
      { region: 'US-SF', minSalary: 220000, maxSalary: 350000, currency: 'USD', source: 'levels.fyi', year: 2024 },
    ],
  },
  {
    title: 'Principal Engineer',
    slug: 'principal-engineer',
    department: 'Engineering',
    level: 'IC',
    description: 'Highest level IC, drives technical direction across the organization.',
    keywords: [
      { keyword: 'technical strategy', weight: 3, type: 'skill' },
      { keyword: 'architecture', weight: 3, type: 'skill' },
      { keyword: 'organizational impact', weight: 3, type: 'skill' },
      { keyword: 'technical vision', weight: 3, type: 'skill' },
      { keyword: 'cross-org collaboration', weight: 2, type: 'skill' },
      { keyword: 'thought leadership', weight: 2, type: 'skill' },
      { keyword: 'innovation', weight: 2, type: 'trait' },
      { keyword: 'mentoring', weight: 2, type: 'skill' },
      { keyword: 'technical excellence', weight: 2, type: 'trait' },
    ],
    salaryBands: [
      { region: 'US', minSalary: 220000, maxSalary: 350000, currency: 'USD', source: 'levels.fyi', year: 2024 },
      { region: 'US-SF', minSalary: 280000, maxSalary: 450000, currency: 'USD', source: 'levels.fyi', year: 2024 },
    ],
  },
];

async function main() {
  console.log('🌱 Starting seed...');

  for (const roleData of roles) {
    const { keywords, salaryBands, ...roleFields } = roleData;

    const role = await prisma.jobRole.upsert({
      where: { slug: roleFields.slug },
      update: {
        ...roleFields,
        keywords: {
          deleteMany: {},
          create: keywords,
        },
        salaryBands: {
          deleteMany: {},
          create: salaryBands,
        },
      },
      create: {
        ...roleFields,
        keywords: {
          create: keywords,
        },
        salaryBands: {
          create: salaryBands,
        },
      },
    });

    console.log(`  ✓ ${role.title} (${role.department})`);
  }

  console.log(`\n✅ Seeded ${roles.length} job roles`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
