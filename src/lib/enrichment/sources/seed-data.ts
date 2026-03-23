import type { DataSource, RoleEnrichment, SalaryInfo } from '../types';
import prisma from '@/lib/db/prisma';

export class SeedDataSource implements DataSource {
  name = 'seed-data';
  confidence = 0.7;

  async isAvailable(): Promise<boolean> {
    try {
      const count = await prisma.jobRole.count();
      return count > 0;
    } catch {
      return false;
    }
  }

  async fetchRoleData(roleSlug: string): Promise<RoleEnrichment | null> {
    try {
      const role = await prisma.jobRole.findUnique({
        where: { slug: roleSlug },
        include: {
          keywords: true,
          salaryBands: true,
        },
      });

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
      const roles = await prisma.jobRole.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { keywords: { some: { keyword: { contains: query } } } },
          ],
        },
        include: {
          keywords: {
            orderBy: { weight: 'desc' },
            take: 10,
          },
        },
        take: 5,
      });

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
      const salaryBand = await prisma.salaryBand.findFirst({
        where: {
          role: {
            OR: [
              { slug: role },
              { title: { contains: role } },
            ],
          },
          region: { contains: region },
        },
      });

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
