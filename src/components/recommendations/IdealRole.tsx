'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Target, Search, XCircle, HelpCircle, CheckCircle, Star } from 'lucide-react';
import { IdealJobProfile, trackDescriptions, scopeDescriptions } from '@/lib/recommendations/job-profile';
import { cn } from '@/lib/utils';

interface IdealRoleProps {
  jobProfile: IdealJobProfile;
  userName: string;
}

export function IdealRole({ jobProfile, userName }: IdealRoleProps) {
  const autonomyLevels = {
    high: { label: 'High Autonomy', description: 'You need freedom to work your way', color: 'text-green-600' },
    medium: { label: 'Moderate Autonomy', description: 'Balance of guidance and independence', color: 'text-yellow-600' },
    low: { label: 'Structured', description: 'Clear direction and expectations', color: 'text-blue-600' }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2">
          {userName}&apos;s Ideal Role
        </h3>
        <p className="text-muted-foreground text-sm">
          The type of position that will bring out your best
        </p>
      </div>

      {/* Career Track */}
      <div className="p-4 rounded-xl bg-card border">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-1">
              Career Track
            </h4>
            <p className="font-medium text-lg">
              {trackDescriptions[jobProfile.track.recommended].label}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {trackDescriptions[jobProfile.track.recommended].description}
            </p>
            <p className="text-sm text-primary/80 mt-2 italic">
              &ldquo;{jobProfile.track.reason}&rdquo;
            </p>
            {jobProfile.track.alternates.length > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                Alternatives: {jobProfile.track.alternates.map(t => trackDescriptions[t].label).join(', ')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Role Scope & Autonomy */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-card border">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-muted-foreground" />
            <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
              Role Scope
            </h4>
          </div>
          <p className="font-medium">{scopeDescriptions[jobProfile.scope.ideal].label}</p>
          <p className="text-xs text-muted-foreground mt-1">{jobProfile.scope.reason}</p>
        </div>

        <div className="p-4 rounded-xl bg-card border">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-muted-foreground" />
            <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
              Autonomy Level
            </h4>
          </div>
          <p className={cn('font-medium', autonomyLevels[jobProfile.autonomyLevel].color)}>
            {autonomyLevels[jobProfile.autonomyLevel].label}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {autonomyLevels[jobProfile.autonomyLevel].description}
          </p>
        </div>
      </div>

      {/* Job Titles */}
      <div className="p-4 rounded-xl bg-card border">
        <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-4">
          Job Titles to Search For
        </h4>
        <div className="space-y-3">
          {jobProfile.idealTitles.map((title, i) => (
            <div 
              key={i} 
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg",
                title.fit === 'excellent' ? 'bg-accent/10 border border-accent/20' :
                title.fit === 'good' ? 'bg-primary/5 border border-primary/10' :
                'bg-muted/50'
              )}
            >
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                title.fit === 'excellent' ? 'bg-accent/20 text-accent' :
                title.fit === 'good' ? 'bg-primary/20 text-primary' :
                'bg-muted text-muted-foreground'
              )}>
                {title.fit === 'excellent' ? '🎯' : title.fit === 'good' ? '✓' : '?'}
              </div>
              <div>
                <p className="font-medium">{title.title}</p>
                <p className="text-sm text-muted-foreground">{title.reason}</p>
              </div>
            </div>
          ))}
        </div>

        {jobProfile.avoidTitles.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-medium text-destructive/80 mb-2">Titles to Skip:</p>
            <div className="flex flex-wrap gap-2">
              {jobProfile.avoidTitles.map((title, i) => (
                <span 
                  key={i}
                  className="px-2 py-1 text-xs rounded-full bg-destructive/10 text-destructive"
                >
                  {title}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* JD Patterns */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-4 h-4 text-accent" />
            <h4 className="font-semibold text-sm">Look for in Job Descriptions</h4>
          </div>
          <ul className="space-y-2">
            {jobProfile.lookFor.map((item, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
          <div className="flex items-center gap-2 mb-3">
            <XCircle className="w-4 h-4 text-destructive" />
            <h4 className="font-semibold text-sm">Red Flags in Job Descriptions</h4>
          </div>
          <ul className="space-y-2">
            {jobProfile.avoid.map((item, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <XCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Responsibilities */}
      <div className="p-4 rounded-xl bg-card border">
        <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">
          Responsibilities
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-accent mb-2">Seek:</p>
            <ul className="space-y-1">
              {jobProfile.responsibilities.seek.map((r, i) => (
                <li key={i} className="text-sm text-muted-foreground">• {r}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium text-destructive mb-2">Avoid:</p>
            <ul className="space-y-1">
              {jobProfile.responsibilities.avoid.map((r, i) => (
                <li key={i} className="text-sm text-muted-foreground">• {r}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Interview Questions */}
      <div className="p-4 rounded-xl bg-card border">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-4 h-4 text-primary" />
          <h4 className="font-semibold text-sm">Questions to Ask in Interviews</h4>
        </div>
        <ul className="space-y-3">
          {jobProfile.interviewQuestions.map((q, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-xs font-medium">
                {i + 1}
              </span>
              <span className="text-muted-foreground">&ldquo;{q}&rdquo;</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

