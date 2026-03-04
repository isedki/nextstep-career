'use client';

import { motion } from 'framer-motion';
import { Building, Star, AlertCircle } from 'lucide-react';
import { CompanyMatch } from '@/lib/recommendations/company-database';
import { cn } from '@/lib/utils';

interface TargetCompaniesProps {
  perfectFit: CompanyMatch[];
  worthExploring: CompanyMatch[];
  avoidUnless: CompanyMatch[];
  userName: string;
}

function CompanyCard({ match, isPerfect = false }: { match: CompanyMatch; isPerfect?: boolean }) {
  const company = match.company;
  
  const workModeLabels: Record<string, string> = {
    'remote_first': '🏠 Remote-first',
    'remote_friendly': '🏠 Remote-friendly',
    'hybrid': '🏢 Hybrid',
    'onsite': '🏢 Onsite'
  };

  const stageLabels: Record<string, string> = {
    'early_startup': 'Early Startup',
    'growth': 'Growth',
    'scaleup': 'Scale-up',
    'enterprise': 'Enterprise'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-4 rounded-xl border transition-all hover:shadow-md",
        isPerfect ? "bg-accent/5 border-accent/20" : "bg-card"
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h4 className="font-semibold text-lg flex items-center gap-2">
            {company.name}
            {isPerfect && <Star className="w-4 h-4 text-accent fill-accent" />}
          </h4>
          <p className="text-sm text-muted-foreground">
            {stageLabels[company.stage]} • {company.size === 'massive' ? '10,000+' : company.size === 'large' ? '500+' : company.size === 'medium' ? '100-500' : company.size === 'small' ? '20-100' : '1-20'} employees
          </p>
        </div>
        {company.glassdoorRating && (
          <div className="flex items-center gap-1 px-2 py-1 bg-muted rounded-lg">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-medium">{company.glassdoorRating}</span>
          </div>
        )}
      </div>

      {/* Work mode and industries */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="text-xs px-2 py-1 bg-muted rounded-full">
          {workModeLabels[company.workMode]}
        </span>
        {company.industries.slice(0, 2).map((ind, i) => (
          <span key={i} className="text-xs px-2 py-1 bg-muted rounded-full">
            {ind}
          </span>
        ))}
      </div>

      {/* Known for */}
      <div className="mb-3">
        <p className="text-xs text-muted-foreground mb-1">Known for:</p>
        <p className="text-sm">{company.knownFor.slice(0, 3).join(' • ')}</p>
      </div>

      {/* Fit reasons */}
      {match.fitReasons.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {match.fitReasons.map((reason, i) => (
            <span key={i} className="text-xs px-2 py-0.5 bg-accent/10 text-accent rounded-full">
              ✓ {reason}
            </span>
          ))}
        </div>
      )}

      {/* Concerns */}
      {match.concerns.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {match.concerns.map((concern, i) => (
            <span key={i} className="text-xs px-2 py-0.5 bg-amber-500/10 text-amber-600 rounded-full flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {concern}
            </span>
          ))}
        </div>
      )}

      {/* Tech stack */}
      {company.techStack && (
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs text-muted-foreground mb-1">Tech:</p>
          <div className="flex flex-wrap gap-1">
            {company.techStack.slice(0, 4).map((tech, i) => (
              <span key={i} className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded">
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export function TargetCompanies({ perfectFit, worthExploring, avoidUnless, userName }: TargetCompaniesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2">
          Companies to Target
        </h3>
        <p className="text-muted-foreground text-sm">
          Matched to {userName}&apos;s values, culture fit, and work preferences
        </p>
      </div>

      {/* Perfect Fit */}
      {perfectFit.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Star className="w-4 h-4 text-accent" />
            </div>
            <div>
              <h4 className="font-semibold">Perfect Fit</h4>
              <p className="text-xs text-muted-foreground">90%+ match with your profile</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {perfectFit.map((match, i) => (
              <CompanyCard key={i} match={match} isPerfect />
            ))}
          </div>
        </section>
      )}

      {/* Worth Exploring */}
      {worthExploring.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold">Worth Exploring</h4>
              <p className="text-xs text-muted-foreground">70-89% match - good options to consider</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {worthExploring.map((match, i) => (
              <CompanyCard key={i} match={match} />
            ))}
          </div>
        </section>
      )}

      {/* Avoid Unless */}
      {avoidUnless.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <h4 className="font-semibold">Might Work, But Watch For...</h4>
              <p className="text-xs text-muted-foreground">Good companies, but some concerns for your profile</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {avoidUnless.map((match, i) => (
              <CompanyCard key={i} match={match} />
            ))}
          </div>
        </section>
      )}

      <div className="text-center pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          These recommendations are based on publicly available company culture data.
          <br />
          Always do your own research and interview carefully.
        </p>
      </div>
    </motion.div>
  );
}

