'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, RefreshCw, MapPin, Briefcase, Building2, FileText, Settings2 } from 'lucide-react';
import { useAssessmentStore } from '@/lib/assessment/store';
import { useExpectationsStore, Expectations } from '@/lib/expectations/store';
import { generateCareerProfile } from '@/lib/profile/generator';
import { generateIdealCompanyProfile, IdealCompanyProfile } from '@/lib/recommendations/company-profile';
import { generateIdealJobProfile, IdealJobProfile } from '@/lib/recommendations/job-profile';
import { getMockJobs, Job } from '@/lib/jobs/api';
import { scoreJobs, generateSearchQueries, ScoredJob } from '@/lib/jobs/matcher';
import { CareerProfile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { JobCard } from '@/components/jobs/JobCard';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'excellent' | 'good' | 'remote';

export default function JobsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<CareerProfile | null>(null);
  const [companyProfile, setCompanyProfile] = useState<IdealCompanyProfile | null>(null);
  const [jobProfile, setJobProfile] = useState<IdealJobProfile | null>(null);
  const [jobs, setJobs] = useState<ScoredJob[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<ScoredJob[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  const { answers, textAnswers, reset } = useAssessmentStore();
  const { expectations, hasExpectations } = useExpectationsStore();
  const userName = textAnswers['ctx_name'] || 'You';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const hasAnswers = Object.keys(answers).length >= 7;
      
      if (!hasAnswers) {
        router.push('/assessment');
        return;
      }

      // Generate profiles
      const generatedProfile = generateCareerProfile(answers);
      setProfile(generatedProfile);
      
      const idealCompany = generateIdealCompanyProfile(generatedProfile, answers);
      setCompanyProfile(idealCompany);
      
      const idealJob = generateIdealJobProfile(generatedProfile, answers);
      setJobProfile(idealJob);
      
      // Fetch and score jobs with expectations if available
      const userExpectations = hasExpectations() ? expectations : undefined;
      loadJobs(idealCompany, idealJob, userExpectations);
    }
  }, [mounted, answers, router, expectations, hasExpectations]);

  const loadJobs = async (company: IdealCompanyProfile, job: IdealJobProfile, userExpectations?: Expectations) => {
    setLoading(true);
    
    // Generate search queries based on profile
    const queries = generateSearchQueries(job, company);
    
    // Fetch jobs for each query (in real app, this would call the API)
    const allJobs: Job[] = [];
    for (const query of queries) {
      const results = getMockJobs({ 
        query, 
        remote: userExpectations?.workLife.remotePreference === 'required' 
          ? true 
          : company.workMode.ideal === 'remote_first' 
            ? true 
            : undefined 
      });
      allJobs.push(...results);
    }
    
    // Deduplicate by job ID
    const uniqueJobs = Array.from(
      new Map(allJobs.map(j => [j.id, j])).values()
    );
    
    // Score jobs with expectations
    const scored = scoreJobs(uniqueJobs, {
      companyProfile: company,
      jobProfile: job,
      remoteRequired: userExpectations?.workLife.remotePreference === 'required' 
        || company.workMode.ideal === 'remote_first',
      salaryMin: userExpectations?.salary.min || undefined,
      salaryMax: userExpectations?.salary.stretch || userExpectations?.salary.target || undefined,
      expectations: userExpectations,
    });
    
    setJobs(scored);
    setFilteredJobs(scored);
    setLoading(false);
  };

  useEffect(() => {
    let filtered = [...jobs];
    
    // Apply filter
    if (activeFilter === 'excellent') {
      filtered = filtered.filter(j => j.score >= 80);
    } else if (activeFilter === 'good') {
      filtered = filtered.filter(j => j.score >= 60);
    } else if (activeFilter === 'remote') {
      filtered = filtered.filter(j => j.remote);
    }
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(j => 
        j.title.toLowerCase().includes(query) ||
        j.company.toLowerCase().includes(query) ||
        j.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredJobs(filtered);
  }, [activeFilter, searchQuery, jobs]);

  const handleStartOver = () => {
    reset();
    router.push('/assessment');
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Finding jobs that match your profile...</p>
        </div>
      </div>
    );
  }

  const filters: { id: FilterType; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: jobs.length },
    { id: 'excellent', label: 'Excellent (80+)', count: jobs.filter(j => j.score >= 80).length },
    { id: 'good', label: 'Good (60+)', count: jobs.filter(j => j.score >= 60).length },
    { id: 'remote', label: 'Remote', count: jobs.filter(j => j.remote).length },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link 
            href="/profile/recommendations"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Recommendations</span>
          </Link>
          
          <span className="font-semibold">Job Matches</span>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleStartOver}>
              <RefreshCw className="w-4 h-4 mr-1" />
              Restart
            </Button>
          </div>
        </div>
      </header>

      {/* Search & Filters */}
      <div className="sticky top-14 z-40 bg-background border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                  activeFilter === filter.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                )}
              >
                {filter.label}
                <span className={cn(
                  "px-1.5 py-0.5 text-xs rounded-full",
                  activeFilter === filter.id
                    ? "bg-primary-foreground/20"
                    : "bg-background"
                )}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Banner */}
      <div className="bg-primary/5 border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center justify-center gap-6 text-sm"
          >
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />
              <span>
                Searching for: <strong>{jobProfile?.idealTitles[0]?.title || 'Software Engineer'}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" />
              <span>
                Stage: <strong className="capitalize">{companyProfile?.stage.ideal.replace('_', ' ')}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span>
                Mode: <strong className="capitalize">{companyProfile?.workMode.ideal.replace('_', ' ')}</strong>
              </span>
            </div>
            {hasExpectations() && expectations.salary.target && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">|</span>
                <span>
                  Target: <strong>${expectations.salary.target.toLocaleString()}</strong>
                </span>
              </div>
            )}
          </motion.div>
          <div className="flex justify-center gap-3 mt-3">
            <Link href="/expectations">
              <Button variant="outline" size="sm">
                <Settings2 className="w-4 h-4 mr-1" />
                {hasExpectations() ? 'Edit Expectations' : 'Set Expectations'}
              </Button>
            </Link>
            <Link href="/resume">
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-1" />
                Resume Analysis
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {filteredJobs.length > 0 ? (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-semibold">
                {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} for {userName}
              </h2>
              <p className="text-sm text-muted-foreground">
                Scored and ranked based on your career profile and preferences
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {filteredJobs.map((job, index) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  index={index}
                  profile={profile || undefined}
                  expectations={hasExpectations() ? expectations : undefined}
                  userName={userName}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filters
            </p>
            <Button variant="outline" onClick={() => {
              setSearchQuery('');
              setActiveFilter('all');
            }}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* Note about data */}
        <div className="mt-8 p-4 rounded-lg bg-muted/50 text-center text-sm text-muted-foreground">
          <p>
            💡 These are sample jobs for demonstration. In production, this would connect to job APIs
            (Indeed, LinkedIn, etc.) to show real-time listings matched to your profile.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 mt-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Jobs scored based on title match, company culture fit, and your preferences</p>
        </div>
      </footer>
    </div>
  );
}

