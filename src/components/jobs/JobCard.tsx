'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ExternalLink, MapPin, Building2, DollarSign, Clock, CheckCircle, AlertTriangle, Star, ChevronDown, ChevronUp, FileText, Zap } from 'lucide-react';
import Link from 'next/link';
import { ScoredJob } from '@/lib/jobs/matcher';
import { CareerProfile } from '@/lib/types';
import { Expectations } from '@/lib/expectations/store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ApplicationPanel } from './ApplicationPanel';

interface JobCardProps {
  job: ScoredJob;
  index: number;
  profile?: CareerProfile;
  expectations?: Expectations;
  userName?: string;
}

export function JobCard({ job, index, profile, expectations, userName }: JobCardProps) {
  const [showApplicationTools, setShowApplicationTools] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-500/10 border-green-500/20';
    if (score >= 60) return 'text-primary bg-primary/10 border-primary/20';
    if (score >= 40) return 'text-amber-600 bg-amber-500/10 border-amber-500/20';
    return 'text-muted-foreground bg-muted border-muted';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Potential Match';
    return 'Review Carefully';
  };

  const formatSalary = (min: number, max: number) => {
    const formatK = (n: number) => {
      if (n >= 1000) return `$${Math.round(n / 1000)}k`;
      return `$${n}`;
    };
    return `${formatK(min)} - ${formatK(max)}`;
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    return d.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "p-5 rounded-xl border bg-card hover:shadow-lg transition-all",
        job.score >= 80 && "ring-2 ring-green-500/20"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3 min-w-0">
          {/* Company Logo */}
          {job.companyLogo ? (
            <div className="relative w-12 h-12 rounded-lg bg-white border overflow-hidden">
              <Image 
                src={job.companyLogo} 
                alt={job.company} 
                fill
                className="object-contain p-1"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
          )}
          
          <div className="min-w-0">
            <h3 className="font-semibold text-lg leading-tight truncate">
              {job.title}
            </h3>
            <p className="text-muted-foreground text-sm truncate">
              {job.company}
            </p>
          </div>
        </div>

        {/* Match Score */}
        <div className={cn(
          "flex flex-col items-center px-3 py-2 rounded-lg border",
          getScoreColor(job.score)
        )}>
          <div className="flex items-center gap-1">
            <Star className={cn("w-4 h-4", job.score >= 80 && "fill-current")} />
            <span className="font-bold text-lg">{job.score}</span>
          </div>
          <span className="text-xs whitespace-nowrap">{getScoreLabel(job.score)}</span>
        </div>
      </div>

      {/* Meta Info */}
      <div className="flex flex-wrap gap-3 mb-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span>{job.remote ? '🏠 Remote' : job.location}</span>
        </div>
        
        {job.salary && (
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            <span>{formatSalary(job.salary.min, job.salary.max)}</span>
          </div>
        )}
        
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{formatDate(job.postedAt)}</span>
        </div>
      </div>

      {/* Description Preview */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {job.description}
      </p>

      {/* Match Reasons */}
      {job.matchReasons.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1.5">
            {job.matchReasons.map((reason, i) => (
              <span 
                key={i}
                className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-accent/10 text-accent"
              >
                <CheckCircle className="w-3 h-3" />
                {reason}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Concerns */}
      {job.concerns.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1.5">
            {job.concerns.map((concern, i) => (
              <span 
                key={i}
                className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-600"
              >
                <AlertTriangle className="w-3 h-3" />
                {concern}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Company Match Info */}
      {job.companyMatch && (
        <div className="p-3 rounded-lg bg-muted/50 mb-4">
          <p className="text-xs text-muted-foreground mb-1">About {job.companyMatch.name}:</p>
          <p className="text-sm">{job.companyMatch.knownFor.slice(0, 3).join(' • ')}</p>
        </div>
      )}

      {/* Requirements */}
      {job.requirements.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2">Requirements:</p>
          <div className="flex flex-wrap gap-1.5">
            {job.requirements.slice(0, 5).map((req, i) => (
              <span key={i} className="text-xs px-2 py-1 rounded bg-muted">
                {req}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        <span className="text-xs text-muted-foreground">
          via {job.source}
        </span>
        
        <div className="flex items-center gap-2">
          <Link 
            href={`/ats?jd=${encodeURIComponent(job.description.slice(0, 500))}`}
            className="inline-flex"
          >
            <Button variant="ghost" size="sm">
              <Zap className="w-4 h-4 mr-1" />
              ATS Check
            </Button>
          </Link>
          {profile && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowApplicationTools(!showApplicationTools)}
            >
              <FileText className="w-4 h-4 mr-1" />
              Prepare
              {showApplicationTools ? (
                <ChevronUp className="w-4 h-4 ml-1" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-1" />
              )}
            </Button>
          )}
          <Button asChild size="sm">
            <a href={job.url} target="_blank" rel="noopener noreferrer">
              Apply
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </Button>
        </div>
      </div>

      {/* Application Tools Panel */}
      {showApplicationTools && profile && (
        <ApplicationPanel
          job={job}
          profile={profile}
          expectations={expectations}
          userName={userName}
        />
      )}
    </motion.div>
  );
}

