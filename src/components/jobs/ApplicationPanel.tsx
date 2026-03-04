'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  HelpCircle, 
  Lightbulb,
  Loader2,
  Copy,
  Check,
  Download,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Job } from '@/lib/jobs/api';
import { CareerProfile } from '@/lib/types';
import { Expectations } from '@/lib/expectations/store';
import { generateCoverLetter } from '@/lib/cover-letter/generator';
import { generateWhatMatters } from '@/lib/application/what-matters';
import { useResumeStore } from '@/lib/resume/analyzer';
import { useSessionStore } from '@/lib/session';
import { CoverLetterResult, WhatMattersGuidance, Flag } from '@/lib/resume/types';

interface ApplicationPanelProps {
  job: Job;
  profile: CareerProfile;
  expectations?: Expectations;
  userName?: string;
}

type TabId = 'cover_letter' | 'what_matters' | 'resume_tips';

export function ApplicationPanel({ 
  job, 
  profile, 
  expectations,
  userName 
}: ApplicationPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>('cover_letter');
  const [coverLetter, setCoverLetter] = useState<CoverLetterResult | null>(null);
  const [whatMatters, setWhatMatters] = useState<WhatMattersGuidance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const { resume, hasResume } = useResumeStore();
  const { hasAIKey } = useSessionStore();

  const tabs = [
    { id: 'cover_letter' as TabId, label: 'Cover Letter', icon: FileText },
    { id: 'what_matters' as TabId, label: 'What Matters', icon: HelpCircle },
    { id: 'resume_tips' as TabId, label: 'Resume Tips', icon: Lightbulb }
  ];

  const handleGenerateCoverLetter = async () => {
    if (!hasResume()) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await generateCoverLetter(
        job,
        profile,
        resume?.rawText || '',
        userName
      );
      setCoverLetter(result);
    } catch (error) {
      console.error('Failed to generate cover letter:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateWhatMatters = async () => {
    setIsLoading(true);
    try {
      const result = await generateWhatMatters(job, profile, expectations);
      setWhatMatters(result);
    } catch (error) {
      console.error('Failed to generate what matters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (activeTab === 'what_matters' && !whatMatters) {
      handleGenerateWhatMatters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <Card className="mt-4 border-primary/20">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">Application Tools</CardTitle>
          {hasAIKey() ? (
            <Badge variant="outline" className="text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Enabled
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs">
              <Target className="w-3 h-3 mr-1" />
              Template Mode
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Tabs */}
        <div className="flex gap-1 mb-4 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === 'cover_letter' && (
              <CoverLetterTab
                job={job}
                coverLetter={coverLetter}
                isLoading={isLoading}
                hasResume={hasResume()}
                onGenerate={handleGenerateCoverLetter}
                onCopy={handleCopy}
                onDownload={handleDownload}
                copied={copied}
              />
            )}

            {activeTab === 'what_matters' && (
              <WhatMattersTab
                whatMatters={whatMatters}
                isLoading={isLoading}
              />
            )}

            {activeTab === 'resume_tips' && (
              <ResumeTipsTab
                job={job}
                profile={profile}
                hasResume={hasResume()}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

// ============================================
// Cover Letter Tab
// ============================================

interface CoverLetterTabProps {
  job: Job;
  coverLetter: CoverLetterResult | null;
  isLoading: boolean;
  hasResume: boolean;
  onGenerate: () => void;
  onCopy: (text: string) => void;
  onDownload: (text: string, filename: string) => void;
  copied: boolean;
}

function CoverLetterTab({
  job,
  coverLetter,
  isLoading,
  hasResume,
  onGenerate,
  onCopy,
  onDownload,
  copied
}: CoverLetterTabProps) {
  if (!hasResume) {
    return (
      <div className="text-center py-6">
        <FileText className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
        <p className="font-medium mb-1">Add Your Resume First</p>
        <p className="text-sm text-muted-foreground mb-4">
          We need your resume to generate a personalized cover letter.
        </p>
        <Button variant="outline" asChild>
          <a href="/resume">Add Resume →</a>
        </Button>
      </div>
    );
  }

  if (!coverLetter) {
    return (
      <div className="text-center py-6">
        <FileText className="w-10 h-10 mx-auto mb-3 text-primary/50" />
        <p className="font-medium mb-1">Generate Cover Letter</p>
        <p className="text-sm text-muted-foreground mb-4">
          Create a personalized cover letter for {job.company}
        </p>
        <Button onClick={onGenerate} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Cover Letter
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {coverLetter.source === 'ai' ? (
            <>
              <Sparkles className="w-4 h-4" />
              AI-generated
            </>
          ) : (
            <>
              <Target className="w-4 h-4" />
              Template-based
            </>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCopy(coverLetter.content || '')}
          >
            {copied ? (
              <Check className="w-4 h-4 mr-1" />
            ) : (
              <Copy className="w-4 h-4 mr-1" />
            )}
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownload(
              coverLetter.content || '',
              `cover-letter-${job.company.toLowerCase().replace(/\s+/g, '-')}.txt`
            )}
          >
            <Download className="w-4 h-4 mr-1" />
            Download
          </Button>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-muted/50 text-sm whitespace-pre-wrap font-serif">
        {coverLetter.content}
      </div>

      <Button 
        variant="outline" 
        size="sm" 
        onClick={onGenerate}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4 mr-2" />
        )}
        Regenerate
      </Button>
    </div>
  );
}

// ============================================
// What Matters Tab
// ============================================

interface WhatMattersTabProps {
  whatMatters: WhatMattersGuidance | null;
  isLoading: boolean;
}

function WhatMattersTab({ whatMatters, isLoading }: WhatMattersTabProps) {
  const [expanded, setExpanded] = useState({
    keyPoints: true,
    questions: true,
    redFlags: false,
    greenFlags: false,
    salary: false
  });

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Generating personalized guidance...</p>
      </div>
    );
  }

  if (!whatMatters) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <p>Failed to generate guidance. Please try again.</p>
      </div>
    );
  }

  const Section = ({ 
    id, 
    title, 
    icon: Icon, 
    children 
  }: { 
    id: keyof typeof expanded; 
    title: string; 
    icon: React.ComponentType<{ className?: string }>; 
    children: React.ReactNode;
  }) => (
    <div className="border rounded-lg">
      <button
        onClick={() => setExpanded(e => ({ ...e, [id]: !e[id] }))}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2 font-medium">
          <Icon className="w-4 h-4" />
          {title}
        </div>
        {expanded[id] ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      {expanded[id] && (
        <div className="px-3 pb-3 border-t">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
        {whatMatters.source === 'ai' ? (
          <><Sparkles className="w-3 h-3" /> AI-personalized</>
        ) : (
          <><Target className="w-3 h-3" /> Rule-based guidance</>
        )}
      </div>

      <Section id="keyPoints" title="Key Points to Emphasize" icon={Lightbulb}>
        <ul className="space-y-2 mt-3">
          {whatMatters.keyPoints.map((kp, i) => (
            <li key={i} className="flex items-start gap-2">
              <Badge 
                variant={kp.priority === 'must_mention' ? 'default' : 'outline'}
                className="text-xs mt-0.5 shrink-0"
              >
                {kp.priority.replace('_', ' ')}
              </Badge>
              <div>
                <p className="text-sm font-medium">{kp.point}</p>
                <p className="text-xs text-muted-foreground">{kp.reason}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="questions" title="Questions to Ask" icon={HelpCircle}>
        <ul className="space-y-3 mt-3">
          {whatMatters.questionsToAsk.map((q, i) => (
            <li key={i}>
              <p className="text-sm font-medium">&ldquo;{q.question}&rdquo;</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">{q.category}</Badge>
                <span className="text-xs text-muted-foreground">{q.why}</span>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="redFlags" title="Red Flags to Watch" icon={AlertTriangle}>
        <ul className="space-y-2 mt-3">
          {whatMatters.redFlags.map((flag, i) => (
            <FlagItem key={i} flag={flag} type="red" />
          ))}
        </ul>
      </Section>

      <Section id="greenFlags" title="Green Flags to Look For" icon={CheckCircle2}>
        <ul className="space-y-2 mt-3">
          {whatMatters.greenFlags.map((flag, i) => (
            <FlagItem key={i} flag={flag} type="green" />
          ))}
        </ul>
      </Section>

      {whatMatters.salaryTips.length > 0 && (
        <Section id="salary" title="Salary Tips" icon={Target}>
          <ul className="space-y-2 mt-3">
            {whatMatters.salaryTips.map((tip, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span className="text-primary">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}

function FlagItem({ flag, type }: { flag: Flag; type: 'red' | 'green' }) {
  const colors = type === 'red' 
    ? { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300' }
    : { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300' };

  return (
    <li className={`p-2 rounded-lg ${colors.bg}`}>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-medium ${colors.text}`}>{flag.signal}</span>
        {flag.severity === 'critical' && (
          <Badge variant="destructive" className="text-xs">Critical</Badge>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-1">{flag.explanation}</p>
    </li>
  );
}

// ============================================
// Resume Tips Tab
// ============================================

interface ResumeTipsTabProps {
  job: Job;
  profile: CareerProfile;
  hasResume: boolean;
}

function ResumeTipsTab({ job, profile, hasResume }: ResumeTipsTabProps) {
  const generateTips = () => {
    const tips: { tip: string; reason: string }[] = [];
    const descLower = job.description.toLowerCase();

    // Job-specific tips
    if (job.requirements.length > 0) {
      tips.push({
        tip: `Ensure your resume mentions: ${job.requirements.slice(0, 3).join(', ')}`,
        reason: 'These are explicitly listed in requirements'
      });
    }

    // Anchor-based tips
    const anchor = profile.psychology.careerAnchor.primary;
    const anchorTips: Record<string, { tip: string; reason: string }> = {
      technical_competence: {
        tip: 'Highlight your deepest technical achievements and expertise areas',
        reason: 'Shows your technical depth'
      },
      management: {
        tip: 'Emphasize team leadership, people development, and cross-functional work',
        reason: 'Shows management capability'
      },
      autonomy: {
        tip: 'Highlight projects where you owned outcomes end-to-end',
        reason: 'Demonstrates independence'
      }
    };

    if (anchorTips[anchor]) {
      tips.push(anchorTips[anchor]);
    }

    // General tips
    tips.push({
      tip: 'Add metrics and numbers wherever possible (%, $, team size)',
      reason: 'Quantified achievements stand out'
    });

    tips.push({
      tip: `Tailor your summary to mention ${job.company} or ${job.title.split(' ')[0]} role specifically`,
      reason: 'Shows genuine interest in this role'
    });

    if (/startup|early|scrappy/i.test(descLower)) {
      tips.push({
        tip: 'Highlight experience with ambiguity, wearing multiple hats, or fast-paced environments',
        reason: 'Startup language in job description'
      });
    }

    return tips.slice(0, 5);
  };

  if (!hasResume) {
    return (
      <div className="text-center py-6">
        <Lightbulb className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
        <p className="font-medium mb-1">Add Your Resume First</p>
        <p className="text-sm text-muted-foreground mb-4">
          Get personalized tips for tailoring your resume to this job.
        </p>
        <Button variant="outline" asChild>
          <a href="/resume">Analyze Resume →</a>
        </Button>
      </div>
    );
  }

  const tips = generateTips();

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Tips for tailoring your resume to {job.title} at {job.company}:
      </p>

      <ul className="space-y-3">
        {tips.map((item, i) => (
          <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-xs font-medium text-primary">{i + 1}</span>
            </div>
            <div>
              <p className="text-sm font-medium">{item.tip}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.reason}</p>
            </div>
          </li>
        ))}
      </ul>

      <Button variant="outline" className="w-full" asChild>
        <a href="/resume">
          <Lightbulb className="w-4 h-4 mr-2" />
          Get Full Resume Analysis
        </a>
      </Button>
    </div>
  );
}
