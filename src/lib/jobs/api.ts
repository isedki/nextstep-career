// ============================================
// Job API - Uses JSearch or Mock Data
// ============================================

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  remote: boolean;
  salary?: {
    min: number;
    max: number;
    currency: string;
    period: 'yearly' | 'hourly';
  };
  description: string;
  requirements: string[];
  postedAt: string;
  url: string;
  source: string;
}

export interface JobSearchParams {
  query: string;
  location?: string;
  remote?: boolean;
  page?: number;
  num_pages?: number;
}

// JSearch API Configuration
const JSEARCH_API_URL = 'https://jsearch.p.rapidapi.com';

/**
 * Fetch jobs from JSearch API
 * Note: Requires a RapidAPI key
 */
export async function fetchJobsFromJSearch(
  params: JobSearchParams,
  apiKey?: string
): Promise<Job[]> {
  if (!apiKey) {
    console.log('No JSearch API key provided, using mock data');
    return getMockJobs(params);
  }

  try {
    const searchParams = new URLSearchParams({
      query: params.query,
      page: String(params.page || 1),
      num_pages: String(params.num_pages || 1),
      ...(params.location && { location: params.location }),
      ...(params.remote !== undefined && { remote_jobs_only: String(params.remote) }),
    });

    const response = await fetch(`${JSEARCH_API_URL}/search?${searchParams}`, {
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
      },
    });

    if (!response.ok) {
      throw new Error(`JSearch API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.data.map((job: Record<string, unknown>) => ({
      id: job.job_id as string,
      title: job.job_title as string,
      company: job.employer_name as string,
      companyLogo: job.employer_logo as string | undefined,
      location: `${job.job_city || ''}, ${job.job_state || ''}, ${job.job_country || ''}`.replace(/^, |, $|, ,/g, ''),
      remote: (job.job_is_remote as boolean) || false,
      salary: job.job_min_salary ? {
        min: job.job_min_salary as number,
        max: (job.job_max_salary as number) || (job.job_min_salary as number) * 1.3,
        currency: (job.job_salary_currency as string) || 'USD',
        period: (job.job_salary_period as 'yearly' | 'hourly') || 'yearly',
      } : undefined,
      description: job.job_description as string,
      requirements: (job.job_required_skills as string[]) || [],
      postedAt: job.job_posted_at_datetime_utc as string,
      url: job.job_apply_link as string,
      source: (job.job_publisher as string) || 'JSearch',
    }));
  } catch (error) {
    console.error('Error fetching from JSearch:', error);
    return getMockJobs(params);
  }
}

/**
 * Get mock jobs for development and demo purposes
 */
export function getMockJobs(params: JobSearchParams): Job[] {
  const mockJobs: Job[] = [
    {
      id: '1',
      title: 'Staff Software Engineer',
      company: 'Stripe',
      companyLogo: 'https://logo.clearbit.com/stripe.com',
      location: 'San Francisco, CA',
      remote: true,
      salary: { min: 200000, max: 280000, currency: 'USD', period: 'yearly' },
      description: 'Join our engineering team to build the economic infrastructure for the internet. Own end-to-end features from design to deployment.',
      requirements: ['8+ years experience', 'Systems design', 'API development', 'Leadership'],
      postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      url: 'https://stripe.com/jobs',
      source: 'Company Website',
    },
    {
      id: '2',
      title: 'Senior Software Engineer - Platform',
      company: 'Vercel',
      companyLogo: 'https://logo.clearbit.com/vercel.com',
      location: 'Remote',
      remote: true,
      salary: { min: 180000, max: 240000, currency: 'USD', period: 'yearly' },
      description: 'Help build the platform that powers the modern web. Work on Next.js, Edge Functions, and our deployment infrastructure.',
      requirements: ['5+ years experience', 'TypeScript', 'Node.js', 'Distributed systems'],
      postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      url: 'https://vercel.com/careers',
      source: 'Company Website',
    },
    {
      id: '3',
      title: 'Principal Engineer',
      company: 'GitLab',
      companyLogo: 'https://logo.clearbit.com/gitlab.com',
      location: 'Remote',
      remote: true,
      salary: { min: 220000, max: 300000, currency: 'USD', period: 'yearly' },
      description: 'Drive technical direction across multiple teams. Work async-first in our all-remote culture.',
      requirements: ['10+ years experience', 'Architecture', 'Ruby', 'Go', 'Leadership'],
      postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      url: 'https://gitlab.com/jobs',
      source: 'Company Website',
    },
    {
      id: '4',
      title: 'Engineering Manager',
      company: 'Linear',
      companyLogo: 'https://logo.clearbit.com/linear.app',
      location: 'Remote',
      remote: true,
      salary: { min: 200000, max: 260000, currency: 'USD', period: 'yearly' },
      description: 'Lead a small, high-performing engineering team building the best project management tool.',
      requirements: ['7+ years experience', '2+ years management', 'Product sense', 'TypeScript'],
      postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      url: 'https://linear.app/careers',
      source: 'Company Website',
    },
    {
      id: '5',
      title: 'Staff Engineer - Infrastructure',
      company: 'Datadog',
      companyLogo: 'https://logo.clearbit.com/datadoghq.com',
      location: 'New York, NY',
      remote: false,
      salary: { min: 190000, max: 260000, currency: 'USD', period: 'yearly' },
      description: 'Build and scale infrastructure handling trillions of data points. Solve real performance challenges.',
      requirements: ['8+ years experience', 'Go', 'Distributed systems', 'Performance optimization'],
      postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      url: 'https://datadoghq.com/careers',
      source: 'Company Website',
    },
    {
      id: '6',
      title: 'Senior Software Engineer',
      company: 'Anthropic',
      companyLogo: 'https://logo.clearbit.com/anthropic.com',
      location: 'San Francisco, CA',
      remote: true,
      salary: { min: 250000, max: 350000, currency: 'USD', period: 'yearly' },
      description: 'Work on AI safety and build products that make AI helpful and harmless. Join the team behind Claude.',
      requirements: ['6+ years experience', 'Python', 'ML experience helpful', 'Strong fundamentals'],
      postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      url: 'https://anthropic.com/careers',
      source: 'Company Website',
    },
    {
      id: '7',
      title: 'Tech Lead - Payments',
      company: 'Ramp',
      companyLogo: 'https://logo.clearbit.com/ramp.com',
      location: 'New York, NY',
      remote: true,
      salary: { min: 200000, max: 280000, currency: 'USD', period: 'yearly' },
      description: 'Lead the payments team building the finance platform of the future. High impact, fast-paced.',
      requirements: ['8+ years experience', 'Fintech experience', 'Team leadership', 'Python/TypeScript'],
      postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      url: 'https://ramp.com/careers',
      source: 'Company Website',
    },
    {
      id: '8',
      title: 'Software Engineer - Design Systems',
      company: 'Figma',
      companyLogo: 'https://logo.clearbit.com/figma.com',
      location: 'San Francisco, CA',
      remote: true,
      salary: { min: 175000, max: 230000, currency: 'USD', period: 'yearly' },
      description: 'Build the design systems that power Figma. Deep work on complex UI challenges.',
      requirements: ['5+ years experience', 'TypeScript', 'React', 'Design sense', 'Performance'],
      postedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      url: 'https://figma.com/careers',
      source: 'Company Website',
    },
    {
      id: '9',
      title: 'Senior Backend Engineer',
      company: 'Notion',
      companyLogo: 'https://logo.clearbit.com/notion.so',
      location: 'San Francisco, CA',
      remote: true,
      salary: { min: 170000, max: 220000, currency: 'USD', period: 'yearly' },
      description: 'Help build the all-in-one workspace used by millions. Real-time collaboration challenges.',
      requirements: ['5+ years experience', 'Backend systems', 'Scalability', 'Collaboration tools'],
      postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      url: 'https://notion.so/careers',
      source: 'Company Website',
    },
    {
      id: '10',
      title: 'Platform Engineer',
      company: 'Supabase',
      companyLogo: 'https://logo.clearbit.com/supabase.com',
      location: 'Remote',
      remote: true,
      salary: { min: 160000, max: 220000, currency: 'USD', period: 'yearly' },
      description: 'Build the open-source Firebase alternative. PostgreSQL, real-time, edge functions.',
      requirements: ['5+ years experience', 'PostgreSQL', 'Go/Elixir', 'Open source'],
      postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      url: 'https://supabase.com/careers',
      source: 'Company Website',
    },
    {
      id: '11',
      title: 'Staff Software Engineer - AI',
      company: 'Hugging Face',
      companyLogo: 'https://logo.clearbit.com/huggingface.co',
      location: 'Remote',
      remote: true,
      salary: { min: 200000, max: 280000, currency: 'USD', period: 'yearly' },
      description: 'Help democratize AI. Build tools and infrastructure for the ML community.',
      requirements: ['7+ years experience', 'Python', 'ML/AI', 'Open source', 'Rust helpful'],
      postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      url: 'https://huggingface.co/jobs',
      source: 'Company Website',
    },
    {
      id: '12',
      title: 'Senior Software Engineer',
      company: 'Discord',
      companyLogo: 'https://logo.clearbit.com/discord.com',
      location: 'San Francisco, CA',
      remote: true,
      salary: { min: 180000, max: 240000, currency: 'USD', period: 'yearly' },
      description: 'Build features for hundreds of millions of users. Real-time, scale, performance.',
      requirements: ['5+ years experience', 'Rust/Python/Elixir', 'Real-time systems', 'Scale'],
      postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      url: 'https://discord.com/jobs',
      source: 'Company Website',
    },
  ];

  // Filter by query
  let filtered = mockJobs;
  if (params.query) {
    const query = params.query.toLowerCase();
    filtered = filtered.filter(job => 
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      job.description.toLowerCase().includes(query)
    );
  }

  // Filter by remote
  if (params.remote !== undefined) {
    filtered = filtered.filter(job => job.remote === params.remote);
  }

  // Filter by location
  if (params.location) {
    const location = params.location.toLowerCase();
    filtered = filtered.filter(job => 
      job.location.toLowerCase().includes(location) ||
      (job.remote && location.includes('remote'))
    );
  }

  return filtered;
}

