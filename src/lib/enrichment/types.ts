export interface RoleEnrichment {
  keywords?: string[];
  salaryData?: {
    region: string;
    min: number;
    max: number;
    currency: string;
    source: string;
  }[];
  trendingSkills?: string[];
  marketDemand?: 'high' | 'medium' | 'low';
  averageExperience?: number;
  relatedTitles?: string[];
}

export interface SalaryInfo {
  region: string;
  min: number;
  max: number;
  currency: string;
  percentile25?: number;
  percentile75?: number;
  sampleSize?: number;
}

export interface DataSource {
  name: string;
  confidence: number;
  isAvailable(): Promise<boolean>;
  fetchRoleData(roleSlug: string): Promise<RoleEnrichment | null>;
  fetchKeywords(query: string): Promise<string[]>;
  fetchSalaryData(role: string, region: string): Promise<SalaryInfo | null>;
}

export interface EnrichedRole {
  id: string;
  title: string;
  slug: string;
  department: string;
  level: string;
  description: string | null;
  keywords: {
    keyword: string;
    weight: number;
    type: string;
    source: string;
  }[];
  salaryBands: {
    region: string;
    min: number;
    max: number;
    currency: string;
    source: string;
    confidence: number;
  }[];
  enrichmentSources: string[];
  lastEnriched?: Date;
}

export interface EnrichmentResult {
  success: boolean;
  sourcesUsed: string[];
  data: RoleEnrichment;
  errors?: string[];
}
