import type { DataSource, RoleEnrichment, SalaryInfo } from '../types';
import { getStaticRoles, getStaticRoleBySlug } from '@/lib/db/static-roles';

export class SeedDataSource implements DataSource {
  name = 'seed-data';
  confidence = 0.7;

  async isAvailable(): Promise<boolean> {
    return true;
  }

  async fetchRoleData(roleSlug: string): Promise<RoleEnrichment | null> {
    try {
      const role = getStaticRoleBySlug(roleSlug);

      if (!role) return null;

      return {
        keywords: role.keywords.map(k => k.keyword),
        salaryData: role.salaryBands.map(s => ({
          region: s.region,
          min: s.minSalary,
          max: s.maxSalary,
          currency: s.currency,
          source: s.source || 'seed-data',
        })),
      };
    } catch {
      return null;
    }
  }

  async fetchKeywords(query: string): Promise<string[]> {
    try {
      const roles = getStaticRoles(undefined, undefined, query);

      const keywords = new Set<string>();
      for (const role of roles) {
        for (const kw of role.keywords) {
          keywords.add(kw.keyword);
        }
      }

      return Array.from(keywords);
    } catch {
      return [];
    }
  }

  async fetchSalaryData(role: string, region: string): Promise<SalaryInfo | null> {
    try {
      const roleData = getStaticRoleBySlug(role);
      
      if (!roleData) {
        const roles = getStaticRoles(undefined, undefined, role);
        if (roles.length === 0) return null;
        const salaryBand = roles[0].salaryBands.find(s => s.region.includes(region));
        if (!salaryBand) return null;
        return {
          region: salaryBand.region,
          min: salaryBand.minSalary,
          max: salaryBand.maxSalary,
          currency: salaryBand.currency,
        };
      }

      const salaryBand = roleData.salaryBands.find(s => s.region.includes(region));

      if (!salaryBand) return null;

      return {
        region: salaryBand.region,
        min: salaryBand.minSalary,
        max: salaryBand.maxSalary,
        currency: salaryBand.currency,
      };
    } catch {
      return null;
    }
  }
}
