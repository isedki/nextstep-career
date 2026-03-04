'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, CheckCircle2, Settings, Sparkles, MessageSquare, ArrowRight, Briefcase, FileText, Target } from 'lucide-react';
import { useAssessmentStore } from '@/lib/assessment/store';
import { useSessionStore } from '@/lib/session';
import { useExpectationsStore } from '@/lib/expectations/store';
import { generateCareerProfile, getTriggerLabel, getPriorityLabel, getUserQuotesForDiagnosis } from '@/lib/profile/generator';
import { generateBenchmarks } from '@/lib/benchmarks/matcher';
import { calculateSalaryRanges, extractSalaryProfile, SalaryEstimate, getTitleLabel, getIndustryLabel } from '@/lib/benchmarks/salary-data';
import { generateNarrative, UserNarrative } from '@/lib/profile/narrative';
import { CareerProfile, MarketBenchmark } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { DiagnosisCard } from '@/components/profile/DiagnosisCard';
import { PsychologyCard } from '@/components/profile/PsychologyCard';
import { InsightCard } from '@/components/profile/InsightCard';
import { BenchmarksCard } from '@/components/profile/BenchmarksCard';
import { ConfidenceIndicator, calculateDataPoints, getMaxDataPoints } from '@/components/profile/ConfidenceIndicator';
import { YourStory } from '@/components/profile/YourStory';
import { ProfileCard } from '@/components/profile/ProfileCard';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<CareerProfile | null>(null);
  const [benchmarks, setBenchmarks] = useState<MarketBenchmark | null>(null);
  const [salaryEstimates, setSalaryEstimates] = useState<SalaryEstimate[]>([]);
  const [narrative, setNarrative] = useState<UserNarrative | null>(null);
  const [mounted, setMounted] = useState(false);
  const { answers, textAnswers, reset, completedPhases } = useAssessmentStore();
  const { hasAIKey, initSession, apiKeys } = useSessionStore();
  const { hasExpectations } = useExpectationsStore();

  useEffect(() => {
    setMounted(true);
    initSession();
  }, [initSession]);

  useEffect(() => {
    if (mounted) {
      // Check if we have enough answers (at least the first 7 core questions)
      const hasAnswers = Object.keys(answers).length >= 7;
      
      if (!hasAnswers) {
        router.push('/assessment');
        return;
      }

      // Generate profile
      const generatedProfile = generateCareerProfile(answers);
      setProfile(generatedProfile);
      
      // Generate legacy benchmarks (for trending roles)
      const generatedBenchmarks = generateBenchmarks(generatedProfile);
      setBenchmarks(generatedBenchmarks);

      // Calculate personalized salary estimates
      const salaryProfile = extractSalaryProfile(answers);
      const estimates = calculateSalaryRanges(salaryProfile);
      setSalaryEstimates(estimates);
      
      // Generate personalized narrative
      const userName = textAnswers['ctx_name'] || 'there';
      const generatedNarrative = generateNarrative(generatedProfile, userName, answers, textAnswers);
      setNarrative(generatedNarrative);
    }
  }, [mounted, answers, textAnswers, router]);

  const handleStartOver = () => {
    reset();
    router.push('/assessment');
  };

  if (!mounted || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Generating your profile...</p>
        </div>
      </div>
    );
  }

  const hasAI = hasAIKey();
  const salaryProfile = extractSalaryProfile(answers);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link 
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Home</span>
          </Link>
          
          <span className="font-semibold">Your Career Profile</span>
          
          <div className="flex items-center gap-2">
            <Link href="/settings">
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4 mr-1" />
                API Keys
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleStartOver}>
              <RefreshCw className="w-4 h-4 mr-1" />
              Restart
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* AI Status Banner */}
        {hasAI && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-between"
          >
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>AI insights powered by {apiKeys.anthropic ? 'Claude' : 'ChatGPT'}</span>
            </div>
            <Link href="/profile/chat">
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                <MessageSquare className="w-3 h-3 mr-1" />
                Ask AI
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Completion Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-card border"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Profile Completeness</span>
            <span className="text-sm text-muted-foreground">{profile.completionPercentage}%</span>
          </div>
          <Progress value={profile.completionPercentage} className="h-2 mb-3" />
          <div className="flex flex-wrap gap-2">
            {[
              { name: 'Core', phase: 'core' },
              { name: 'Burnout', phase: 'burnout' },
              { name: 'Work Style', phase: 'workstyle' },
              { name: 'Motivators', phase: 'motivators' },
              { name: 'Skills', phase: 'skills' }
            ].map((section) => {
              const isComplete = completedPhases.includes(section.phase);
              return (
                <Badge 
                  key={section.name} 
                  variant={isComplete ? "default" : "outline"}
                  className={isComplete ? "" : "text-muted-foreground cursor-pointer hover:bg-muted/50"}
                  onClick={() => !isComplete && router.push(`/assessment/deep-dive/${section.phase}`)}
                >
                  {isComplete && <CheckCircle2 className="w-3 h-3 mr-1" />}
                  {section.name}
                </Badge>
              );
            })}
          </div>
        </motion.div>

        {/* Confidence Indicator */}
        <ConfidenceIndicator
          dataPoints={calculateDataPoints(answers)}
          maxDataPoints={getMaxDataPoints()}
          completedPhases={completedPhases}
        />

        {/* Your Story Section */}
        {narrative && (
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <span>📖</span> Your Story
              </h2>
              <p className="text-muted-foreground mb-6">
                What we understand about your career journey
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-xl bg-card border"
            >
              <YourStory narrative={narrative} />
            </motion.div>
          </section>
        )}

        <Separator />

        {/* What's Wrong Section */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <span>🔍</span> What&apos;s Wrong at Your Current Job
            </h2>
            <p className="text-muted-foreground mb-6">
              Based on your answers, here&apos;s what we identified
            </p>
          </motion.div>

          {profile.diagnoses.length > 0 ? (
            <div className="space-y-4">
              {profile.diagnoses.map((diagnosis, index) => (
                <DiagnosisCard 
                  key={diagnosis.issueId} 
                  diagnosis={diagnosis} 
                  index={index}
                  userQuotes={getUserQuotesForDiagnosis(diagnosis.category, answers)}
                />
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-accent/10 border border-accent/20 text-center">
              <CheckCircle2 className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="font-medium">No major issues detected</p>
              <p className="text-sm text-muted-foreground">
                Your current situation doesn&apos;t show strong red flags
              </p>
            </div>
          )}

          {/* Not Diagnosed */}
          {profile.notDiagnosed.length > 0 && (
            <div className="mt-4 p-4 rounded-xl bg-muted/50">
              <p className="text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 inline mr-2 text-accent" />
                <span className="font-medium">Not detected:</span>{' '}
                {profile.notDiagnosed.join(', ')}
              </p>
            </div>
          )}
        </section>

        <Separator />

        {/* Psychology Profile Section */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <span>🧠</span> Your Psychological Profile
            </h2>
            <p className="text-muted-foreground mb-6">
              Based on validated frameworks from psychology research
            </p>
          </motion.div>

          <PsychologyCard psychology={profile.psychology} />
        </section>

        <Separator />

        {/* Insights Section */}
        {profile.insights.length > 0 && (
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <span>💡</span> Why You Feel the Way You Do
              </h2>
              <p className="text-muted-foreground mb-6">
                Psychology-backed explanations for your work experiences
              </p>
            </motion.div>

            <div className="space-y-4">
              {profile.insights.map((insight, index) => (
                <InsightCard key={index} insight={insight} index={index} />
              ))}
            </div>
          </section>
        )}

        <Separator />

        {/* Market Benchmarks Section - Updated with Multi-Region Salary */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <span>💰</span> Your Market Value
            </h2>
            <p className="text-muted-foreground mb-6">
              Salary benchmarks based on your experience, industry, and target regions
            </p>
          </motion.div>

          {salaryEstimates.length > 0 ? (
            <BenchmarksCard 
              salaryEstimates={salaryEstimates}
              profile={{
                title: salaryProfile.title,
                industry: salaryProfile.industry,
                experience: salaryProfile.experience,
                role: salaryProfile.role
              }}
              trendingRoles={benchmarks?.trendingRoles}
            />
          ) : (
            <div className="p-6 rounded-xl bg-muted/50 text-center">
              <p className="text-muted-foreground">
                Complete more questions to see personalized salary benchmarks
              </p>
            </div>
          )}
        </section>

        <Separator />

        {/* Summary Section */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-xl bg-primary/5 border border-primary/20"
          >
            <h2 className="text-xl font-bold mb-4">Quick Summary</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">What&apos;s pushing you</p>
                <p className="font-medium">
                  {profile.trigger.map(t => getTriggerLabel(t)).join(', ')}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Top priority</p>
                <p className="font-medium">{getPriorityLabel(profile.priority)}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Your tradeoff style</p>
                <p className="font-medium">{profile.tradeoffStyle}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Career anchor</p>
                <p className="font-medium capitalize">
                  {profile.psychology.careerAnchor.primary.replace('_', ' ')}
                </p>
              </div>

              {salaryProfile.title && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Target level</p>
                  <p className="font-medium">{getTitleLabel(salaryProfile.title)}</p>
                </div>
              )}

              {salaryProfile.industry && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Industry</p>
                  <p className="font-medium">{getIndustryLabel(salaryProfile.industry)}</p>
                </div>
              )}
            </div>
          </motion.div>
        </section>

        {/* Recommendations CTA */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="p-6 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold mb-1">Ready for your recommendations?</h3>
                <p className="text-muted-foreground">
                  See your ideal company, role, and actual job matches based on this profile
                </p>
              </div>
              <Link href="/profile/recommendations">
                <Button size="lg" className="group">
                  View Recommendations
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        <Separator />

        {/* Job Search Section */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.47 }}
          >
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <span>🎯</span> Job Search Tools
            </h2>
            <p className="text-muted-foreground mb-6">
              Find and apply to jobs that match your profile
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48 }}
            className="grid md:grid-cols-3 gap-4"
          >
            <Link href="/expectations">
              <div className="p-5 rounded-xl bg-card border hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group">
                <Target className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-1">Set Expectations</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Define salary, work-life, and role preferences
                </p>
                {hasExpectations() ? (
                  <span className="text-xs text-accent flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Configured
                  </span>
                ) : (
                  <span className="text-xs text-primary">Set up →</span>
                )}
              </div>
            </Link>

            <Link href="/resume">
              <div className="p-5 rounded-xl bg-card border hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group">
                <FileText className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-1">Resume Analysis</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Get feedback and keywords for your resume
                </p>
                <span className="text-xs text-primary">Analyze →</span>
              </div>
            </Link>

            <Link href="/jobs">
              <div className="p-5 rounded-xl bg-card border hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group">
                <Briefcase className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-1">Browse Jobs</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Find matched jobs with application tools
                </p>
                <span className="text-xs text-primary">Search →</span>
              </div>
            </Link>
          </motion.div>
        </section>

        <Separator />

        {/* Deep Dives CTA */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 rounded-xl bg-card border text-center"
          >
            <h3 className="text-lg font-semibold mb-2">Want to go deeper?</h3>
            <p className="text-muted-foreground mb-4">
              Complete optional deep dives to enrich your profile
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link href="/assessment/deep-dive/burnout">
                <Button variant="outline">
                  🔥 Burnout Analysis
                </Button>
              </Link>
              <Link href="/assessment/deep-dive/workstyle">
                <Button variant="outline">
                  🧠 Work Style
                </Button>
              </Link>
              <Link href="/assessment/deep-dive/motivators">
                <Button variant="outline">
                  ⚓ Motivators
                </Button>
              </Link>
              <Link href="/assessment/deep-dive/skills">
                <Button variant="outline">
                  🛠️ Skills
                </Button>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Each takes 2-3 minutes
            </p>
          </motion.div>
        </section>

        {/* Share Your Profile */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <span>🎴</span> Share Your Profile
            </h2>
            <p className="text-muted-foreground mb-6">
              Download or share your career profile card
            </p>
          </motion.div>

          <ProfileCard 
            profile={profile}
            userName={textAnswers['ctx_name'] || 'You'}
            headline={narrative?.headline || 'Your career journey starts here'}
          />
        </section>

        <Separator />

        {/* AI Chat CTA - if no API key */}
        {!hasAI && (
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="p-6 rounded-xl bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border text-center"
            >
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Get AI-Powered Insights</h3>
              <p className="text-muted-foreground mb-4 text-sm max-w-md mx-auto">
                Add your OpenAI or Claude API key to unlock personalized coaching, 
                deeper explanations, and career advice tailored to your profile.
              </p>
              <Link href="/settings">
                <Button>
                  Add API Key
                </Button>
              </Link>
            </motion.div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mt-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Your profile is stored locally in your browser.</p>
          <p className="mt-1">Based on: Self-Determination Theory, Job Demands-Resources, Career Anchors, Holland RIASEC, Maslach Burnout, Big Five</p>
        </div>
      </footer>
    </div>
  );
}
