import type { DataSource, RoleEnrichment, EnrichmentResult, SalaryInfo } from './types';
import { SeedDataSource } from './sources/seed-data';
import { jsearchSource } from './sources/jsearch';

class EnrichmentManager {
  private sources: DataSource[] = [];

  constructor() {
    this.sources = [
      new SeedDataSource(),
      jsearchSource,
    ];
  }

  async getAvailableSources(): Promise<DataSource[]> {
    const available: DataSource[] = [];
    
    for (const source of this.sources) {
      if (await source.isAvailable()) {
        available.push(source);
      }
    }

    return available.sort((a, b) => b.confidence - a.confidence);
  }

  async enrichRole(roleSlug: string): Promise<EnrichmentResult> {
    const sourcesUsed: string[] = [];
    const errors: string[] = [];
    let mergedData: RoleEnrichment = {};

    const availableSources = await this.getAvailableSources();

    for (const source of availableSources) {
      try {
        const data = await source.fetchRoleData(roleSlug);
        if (data) {
          mergedData = this.mergeEnrichments(mergedData, data, source.confidence);
          sourcesUsed.push(source.name);
        }
      } catch (error) {
        errors.push(`${source.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return {
      success: sourcesUsed.length > 0,
      sourcesUsed,
      data: mergedData,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  async fetchKeywords(query: string): Promise<{ keywords: string[]; sources: string[] }> {
    const allKeywords = new Set<string>();
    const sources: string[] = [];

    const availableSources = await this.getAvailableSources();

    for (const source of availableSources) {
      try {
        const keywords = await source.fetchKeywords(query);
        if (keywords.length > 0) {
          keywords.forEach(k => allKeywords.add(k));
          sources.push(source.name);
        }
      } catch {
        // Ignore errors for individual sources
      }
    }

    return {
      keywords: Array.from(allKeywords),
      sources,
    };
  }

  async fetchSalaryData(role: string, region: string): Promise<{ salary: SalaryInfo | null; sources: string[] }> {
    const sources: string[] = [];
    let bestSalary: SalaryInfo | null = null;
    let highestConfidence = 0;

    const availableSources = await this.getAvailableSources();

    for (const source of availableSources) {
      try {
        const salary = await source.fetchSalaryData(role, region);
        if (salary && source.confidence > highestConfidence) {
          bestSalary = salary;
          highestConfidence = source.confidence;
          sources.push(source.name);
        }
      } catch {
        // Ignore errors
      }
    }

    return {
      salary: bestSalary,
      sources,
    };
  }

  private mergeEnrichments(
    existing: RoleEnrichment,
    incoming: RoleEnrichment,
    confidence: number
  ): RoleEnrichment {
    const merged: RoleEnrichment = { ...existing };

    if (incoming.keywords) {
      const existingKeywords = new Set(existing.keywords || []);
      for (const keyword of incoming.keywords) {
        existingKeywords.add(keyword);
      }
      merged.keywords = Array.from(existingKeywords);
    }

    if (incoming.salaryData) {
      merged.salaryData = [...(existing.salaryData || []), ...incoming.salaryData];
    }

    if (incoming.trendingSkills) {
      const existingTrending = new Set(existing.trendingSkills || []);
      for (const skill of incoming.trendingSkills) {
        existingTrending.add(skill);
      }
      merged.trendingSkills = Array.from(existingTrending);
    }

    if (incoming.relatedTitles) {
      const existingTitles = new Set(existing.relatedTitles || []);
      for (const title of incoming.relatedTitles) {
        existingTitles.add(title);
      }
      merged.relatedTitles = Array.from(existingTitles);
    }

    if (incoming.marketDemand && (!existing.marketDemand || confidence > 0.8)) {
      merged.marketDemand = incoming.marketDemand;
    }

    if (incoming.averageExperience && (!existing.averageExperience || confidence > 0.8)) {
      merged.averageExperience = incoming.averageExperience;
    }

    return merged;
  }

  setJSearchApiKey(key: string) {
    jsearchSource.setApiKey(key);
  }
}

export const enrichmentManager = new EnrichmentManager();
