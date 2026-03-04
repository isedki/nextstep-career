'use client';

import { motion } from 'framer-motion';
import { Building2, Users, Briefcase, Globe, CheckCircle, AlertTriangle } from 'lucide-react';
import { IdealCompanyProfile, stageDescriptions, cultureDescriptions, managementDescriptions, teamSizeDescriptions } from '@/lib/recommendations/company-profile';

interface IdealCompanyProps {
  companyProfile: IdealCompanyProfile;
  userName: string;
}

export function IdealCompany({ companyProfile, userName }: IdealCompanyProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2">
          {userName}&apos;s Ideal Company
        </h3>
        <p className="text-muted-foreground text-sm">
          Based on your psychology profile and preferences
        </p>
      </div>

      {/* Company Stage */}
      <div className="p-4 rounded-xl bg-card border">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-1">
              Company Stage
            </h4>
            <p className="font-medium text-lg">
              {stageDescriptions[companyProfile.stage.ideal].label}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {stageDescriptions[companyProfile.stage.ideal].description}
            </p>
            <p className="text-sm text-primary/80 mt-2 italic">
              &ldquo;{companyProfile.stage.reason}&rdquo;
            </p>
            {companyProfile.stage.acceptable.length > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                Also consider: {companyProfile.stage.acceptable.map(s => stageDescriptions[s].label.split(' ')[0]).join(', ')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Culture Type */}
      <div className="p-4 rounded-xl bg-card border">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-1">
              Culture Type
            </h4>
            <p className="font-medium text-lg">
              {cultureDescriptions[companyProfile.culture.ideal].label}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {cultureDescriptions[companyProfile.culture.ideal].description}
            </p>
            <p className="text-sm text-accent/80 mt-2 italic">
              &ldquo;{companyProfile.culture.reason}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Management Style */}
      <div className="p-4 rounded-xl bg-card border">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-1">
              Management Style
            </h4>
            <p className="font-medium text-lg">
              {managementDescriptions[companyProfile.managementStyle.ideal].label}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {managementDescriptions[companyProfile.managementStyle.ideal].description}
            </p>
            <p className="text-sm text-muted-foreground/80 mt-2 italic">
              &ldquo;{companyProfile.managementStyle.reason}&rdquo;
            </p>
            {companyProfile.managementStyle.avoid.length > 0 && (
              <p className="text-xs text-destructive/80 mt-2">
                ⚠️ Avoid: {companyProfile.managementStyle.avoid.map(m => managementDescriptions[m].label).join(', ')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Team Size & Work Mode */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-card border">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
              Team Size
            </h4>
          </div>
          <p className="font-medium">{teamSizeDescriptions[companyProfile.teamSize.ideal].label}</p>
          <p className="text-xs text-muted-foreground mt-1">{companyProfile.teamSize.reason}</p>
        </div>

        <div className="p-4 rounded-xl bg-card border">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
              Work Mode
            </h4>
          </div>
          <p className="font-medium capitalize">{companyProfile.workMode.ideal.replace(/_/g, ' ')}</p>
          <p className="text-xs text-muted-foreground mt-1">{companyProfile.workMode.reason}</p>
        </div>
      </div>

      {/* Industries */}
      <div className="p-4 rounded-xl bg-card border">
        <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">
          Best-Fit Industries
        </h4>
        <div className="flex flex-wrap gap-2">
          {companyProfile.industries.map((industry, i) => (
            <span 
              key={i} 
              className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary"
            >
              {industry}
            </span>
          ))}
        </div>
      </div>

      {/* Flags */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4 text-accent" />
            <h4 className="font-semibold text-sm">Green Flags to Look For</h4>
          </div>
          <ul className="space-y-2">
            {companyProfile.greenFlags.map((flag, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-accent mt-0.5">✓</span>
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <h4 className="font-semibold text-sm">Red Flags to Avoid</h4>
          </div>
          <ul className="space-y-2">
            {companyProfile.redFlags.map((flag, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-destructive mt-0.5">✗</span>
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

