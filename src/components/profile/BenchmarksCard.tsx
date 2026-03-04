'use client';

import { motion } from 'framer-motion';
import { TrendingUp, MapPin, DollarSign, Briefcase, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { SalaryEstimate, formatSalary, getTitleLabel, getIndustryLabel } from '@/lib/benchmarks/salary-data';

interface BenchmarksCardProps {
  salaryEstimates: SalaryEstimate[];
  profile: {
    title: string;
    industry: string;
    experience: string;
    role: string;
  };
  trendingRoles?: {
    title: string;
    growth: number;
    fit: 'high' | 'moderate' | 'low';
    skillGap: string | null;
  }[];
}

export function BenchmarksCard({ salaryEstimates, profile, trendingRoles }: BenchmarksCardProps) {
  const confidenceColors = {
    high: 'text-accent',
    medium: 'text-amber-500',
    low: 'text-muted-foreground'
  };

  const fitColors = {
    high: 'bg-accent/10 text-accent border-accent/20',
    moderate: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    low: 'bg-muted text-muted-foreground border-muted'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header with Profile Summary */}
      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Briefcase className="w-4 h-4" />
          <span>Your Market Position</span>
        </div>
        <p className="text-lg font-semibold">
          {getTitleLabel(profile.title)} • {getIndustryLabel(profile.industry)}
        </p>
        <p className="text-sm text-muted-foreground">
          Based on your experience and background
        </p>
      </div>

      {/* Salary Estimates by Region */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <DollarSign className="w-4 h-4" />
          <span>Salary Benchmarks</span>
        </div>

        {salaryEstimates.map((estimate, index) => (
          <motion.div
            key={estimate.region}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-xl bg-card border"
          >
            {/* Region Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{estimate.regionLabel}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {estimate.currency}
              </Badge>
            </div>

            {/* Salary Range Visualization */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">25th</span>
                <span className="font-semibold">Median</span>
                <span className="text-muted-foreground">75th</span>
              </div>
              
              <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                {/* Range bar */}
                <div 
                  className="absolute h-full bg-primary/30 rounded-full"
                  style={{ 
                    left: '0%', 
                    width: '100%' 
                  }}
                />
                {/* Median marker */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full border-2 border-background shadow-sm"
                  style={{ left: '50%', transform: 'translate(-50%, -50%)' }}
                />
              </div>

              <div className="flex justify-between mt-2">
                <span className="text-lg font-bold">
                  {formatSalary(estimate.p25, estimate.currencySymbol)}
                </span>
                <span className="text-xl font-bold text-primary">
                  {formatSalary(estimate.p50, estimate.currencySymbol)}
                </span>
                <span className="text-lg font-bold">
                  {formatSalary(estimate.p75, estimate.currencySymbol)}
                </span>
              </div>
            </div>

            {/* Factors */}
            {estimate.factors.length > 0 && (
              <div className="space-y-1 pt-3 border-t">
                <p className="text-xs text-muted-foreground mb-2">Your profile factors:</p>
                {estimate.factors.map((factor, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {factor.positive ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                    <span className={factor.positive ? '' : 'text-muted-foreground'}>
                      {factor.label}
                    </span>
                    <span className={cn(
                      "ml-auto text-xs font-medium",
                      factor.positive ? 'text-accent' : 'text-muted-foreground'
                    )}>
                      {factor.impact}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Confidence */}
            <div className="flex items-center gap-1.5 mt-3 pt-3 border-t">
              <span className="text-xs text-muted-foreground">Confidence:</span>
              <span className={cn("text-xs font-medium capitalize", confidenceColors[estimate.confidence])}>
                {estimate.confidence}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Data Source */}
      <p className="text-xs text-center text-muted-foreground">
        Data from levels.fyi, Glassdoor, LinkedIn Salary (2024)
      </p>

      {/* Trending Roles */}
      {trendingRoles && trendingRoles.length > 0 && (
        <div className="p-4 rounded-xl bg-card border">
          <div className="flex items-center gap-2 text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4" />
            <span>Trending Roles for Your Profile</span>
          </div>
          <div className="space-y-3">
            {trendingRoles.map((role) => (
              <div key={role.title} className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{role.title}</span>
                  <Badge variant="outline" className="text-xs text-accent border-accent/20">
                    +{role.growth}% YoY
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className={cn("text-xs", fitColors[role.fit])}>
                    {role.fit} fit
                  </Badge>
                  {role.skillGap && (
                    <span className="text-muted-foreground text-xs">
                      Gap: {role.skillGap}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
