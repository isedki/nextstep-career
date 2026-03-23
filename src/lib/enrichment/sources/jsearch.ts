import type { DataSource, RoleEnrichment, SalaryInfo } from '../types';

const JSEARCH_API_URL = 'https://jsearch.p.rapidapi.com';

export class JSearchSource implements DataSource {
  name = 'jsearch';
  confidence = 0.9;
  private apiKey: string | null = null;

  setApiKey(key: string) {
    this.apiKey = key;
  }

  async isAvailable(): Promise<boolean> {
    return !!this.apiKey;
  }

  async fetchRoleData(roleSlug: string): Promise<RoleEnrichment | null> {
    if (!this.apiKey) return null;

    try {
      const query = roleSlug.replace(/-/g, ' ');
      const response = await fetch(
        `${JSEARCH_API_URL}/search?query=${encodeURIComponent(query)}&num_pages=1`,
        {
          headers: {
            'X-RapidAPI-Key': this.apiKey,
            'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
          },
        }
      );

      if (!response.ok) return null;

      const data = await response.json();
      const jobs = data.data || [];

      const keywords = new Set<string>();
      const salaryData: RoleEnrichment['salaryData'] = [];
      const relatedTitles = new Set<string>();

      for (const job of jobs.slice(0, 10)) {
        if (job.job_required_skills) {
          for (const skill of job.job_required_skills) {
            keywords.add(skill.toLowerCase());
          }
        }

        if (job.job_title) {
          relatedTitles.add(job.job_title);
        }

        if (job.job_min_salary && job.job_max_salary) {
          salaryData.push({
            region: job.job_country || 'US',
            min: job.job_min_salary,
            max: job.job_max_salary,
            currency: job.job_salary_currency || 'USD',
            source: 'jsearch',
          });
        }
      }

      return {
        keywords: Array.from(keywords),
        salaryData: salaryData.slice(0, 5),
        relatedTitles: Array.from(relatedTitles).slice(0, 10),
        trendingSkills: Array.from(keywords).slice(0, 5),
      };
    } catch (error) {
      console.error('JSearch API error:', error);
      return null;
    }
  }

  async fetchKeywords(query: string): Promise<string[]> {
    if (!this.apiKey) return [];

    try {
      const response = await fetch(
        `${JSEARCH_API_URL}/search?query=${encodeURIComponent(query)}&num_pages=1`,
        {
          headers: {
            'X-RapidAPI-Key': this.apiKey,
            'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
          },
        }
      );

      if (!response.ok) return [];

      const data = await response.json();
      const jobs = data.data || [];

      const keywords = new Set<string>();
      for (const job of jobs.slice(0, 5)) {
        if (job.job_required_skills) {
          for (const skill of job.job_required_skills) {
            keywords.add(skill.toLowerCase());
          }
        }
      }

      return Array.from(keywords);
    } catch {
      return [];
    }
  }

  async fetchSalaryData(role: string, region: string): Promise<SalaryInfo | null> {
    if (!this.apiKey) return null;

    try {
      const response = await fetch(
        `${JSEARCH_API_URL}/search?query=${encodeURIComponent(role)}&location=${encodeURIComponent(region)}&num_pages=1`,
        {
          headers: {
            'X-RapidAPI-Key': this.apiKey,
            'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
          },
        }
      );

      if (!response.ok) return null;

      const data = await response.json();
      const jobs = data.data || [];

      const salaries: number[] = [];
      for (const job of jobs) {
        if (job.job_min_salary) salaries.push(job.job_min_salary);
        if (job.job_max_salary) salaries.push(job.job_max_salary);
      }

      if (salaries.length === 0) return null;

      salaries.sort((a, b) => a - b);
      const min = salaries[0];
      const max = salaries[salaries.length - 1];
      const p25 = salaries[Math.floor(salaries.length * 0.25)];
      const p75 = salaries[Math.floor(salaries.length * 0.75)];

      return {
        region,
        min,
        max,
        currency: 'USD',
        percentile25: p25,
        percentile75: p75,
        sampleSize: jobs.length,
      };
    } catch {
      return null;
    }
  }
}

export const jsearchSource = new JSearchSource();
