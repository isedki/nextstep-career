'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Loader2,
  Lightbulb,
  Target,
  Plus,
  Trash2,
  Copy,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { analyzeResume, useResumeStore } from '@/lib/resume/analyzer';
import { useSessionStore } from '@/lib/session';
import { useAssessmentStore } from '@/lib/assessment/store';
import { generateCareerProfile } from '@/lib/profile/generator';
import { generateIdealJobProfile } from '@/lib/recommendations/job-profile';
import { ResumeAnalysis, ResumeSuggestion } from '@/lib/resume/types';

export default function ResumePage() {
  const [mounted, setMounted] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const { resume, setResume, clearResume } = useResumeStore();
  const { hasAIKey } = useSessionStore();
  const { answers, completedPhases } = useAssessmentStore();

  useEffect(() => {
    setMounted(true);
    if (resume?.rawText) {
      setResumeText(resume.rawText);
    }
  }, [resume]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const hasProfile = completedPhases.includes('core');

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setError('Please paste your resume text first.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      const profile = generateCareerProfile(answers);
      const jobProfile = generateIdealJobProfile(profile, answers);
      
      const result = await analyzeResume(resumeText, profile, jobProfile);
      
      if (result.success && result.analysis) {
        setAnalysis(result.analysis);
        setResume(resumeText);
      } else {
        setError(result.error || 'Analysis failed');
      }
    } catch (_err) {
      setError('Failed to analyze resume. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setResumeText('');
    setAnalysis(null);
    setError(null);
    clearResume();
  };

  const copyKeyword = (keyword: string) => {
    navigator.clipboard.writeText(keyword);
    setCopied(keyword);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="p-4 border-b">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to Profile
          </Link>
          <span className="font-semibold">Resume Analysis</span>
          <Link href="/jobs" className="text-sm text-primary hover:underline">
            View Jobs →
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Intro */}
          <div className="text-center space-y-2 mb-8">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Analyze Your Resume</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Paste your resume to get personalized feedback based on your career profile and target roles.
            </p>
          </div>

          {!hasProfile && (
            <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900">
              <CardContent className="p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-900 dark:text-amber-100">Complete your assessment first</p>
                  <p className="text-sm text-amber-700 dark:text-amber-200">
                    Resume analysis works best with your career profile.
                  </p>
                  <Link href="/assessment" className="text-sm text-amber-800 dark:text-amber-100 underline mt-1 inline-block">
                    Take Assessment →
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Your Resume
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume text here...

Example:
John Doe
Software Engineer

Experience:
Senior Engineer at TechCorp (2020-Present)
- Led development of microservices architecture
- Managed team of 4 engineers
..."
                  className="w-full h-80 p-4 rounded-lg border bg-background resize-none text-sm font-mono"
                />

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {resumeText.split(/\s+/).filter(Boolean).length} words
                  </span>
                  <div className="flex gap-2">
                    {resumeText && (
                      <Button variant="outline" size="sm" onClick={handleClear}>
                        <Trash2 className="w-4 h-4 mr-1" />
                        Clear
                      </Button>
                    )}
                    <Button 
                      onClick={handleAnalyze} 
                      disabled={isAnalyzing || !resumeText.trim()}
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Analyze
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* AI Status */}
                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {hasAIKey() ? (
                      <>
                        <Sparkles className="w-3 h-3 text-primary" />
                        AI-powered analysis enabled
                      </>
                    ) : (
                      <>
                        <Target className="w-3 h-3" />
                        Using rule-based analysis •{' '}
                        <Link href="/settings" className="text-primary hover:underline">
                          Add API key for AI
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            <div className="lg:col-span-1 space-y-4">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Card className="border-destructive/50 bg-destructive/5">
                      <CardContent className="p-4 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                        <div>
                          <p className="font-medium text-destructive">Analysis Failed</p>
                          <p className="text-sm text-muted-foreground">{error}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {analysis && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {/* Score Card */}
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium">Alignment Score</span>
                          <Badge variant={analysis.alignmentScore >= 70 ? 'default' : analysis.alignmentScore >= 50 ? 'secondary' : 'destructive'}>
                            {analysis.alignmentScore}%
                          </Badge>
                        </div>
                        <Progress value={analysis.alignmentScore} className="h-2 mb-2" />
                        <p className="text-sm text-muted-foreground">{analysis.summary}</p>
                        <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                          {analysis.source === 'ai' ? (
                            <>
                              <Sparkles className="w-3 h-3" /> AI-powered analysis
                            </>
                          ) : (
                            <>
                              <Target className="w-3 h-3" /> Rule-based analysis
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Strengths */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2 text-green-600">
                          <CheckCircle2 className="w-4 h-4" />
                          Strengths
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <ul className="space-y-2">
                          {analysis.strengths.map((strength, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    {/* Gaps */}
                    {analysis.gaps.length > 0 && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center gap-2 text-amber-600">
                            <AlertCircle className="w-4 h-4" />
                            Areas to Improve
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <ul className="space-y-2">
                            {analysis.gaps.map((gap, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <span className="w-4 h-4 flex items-center justify-center text-amber-600 flex-shrink-0">•</span>
                                {gap}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {/* Suggestions */}
                    {analysis.suggestions.length > 0 && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-primary" />
                            Suggestions
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-3">
                          {analysis.suggestions.map((suggestion, i) => (
                            <SuggestionItem key={i} suggestion={suggestion} />
                          ))}
                        </CardContent>
                      </Card>
                    )}

                    {/* Keywords */}
                    {analysis.keywordsToAdd.length > 0 && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Plus className="w-4 h-4 text-primary" />
                            Keywords to Add
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex flex-wrap gap-2">
                            {analysis.keywordsToAdd.map((keyword, i) => (
                              <button
                                key={i}
                                onClick={() => copyKeyword(keyword)}
                                className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm hover:bg-primary/20 transition-colors flex items-center gap-1"
                              >
                                {keyword}
                                {copied === keyword ? (
                                  <Check className="w-3 h-3" />
                                ) : (
                                  <Copy className="w-3 h-3 opacity-50" />
                                )}
                              </button>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Click to copy • Add these to your resume
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    {/* Next Steps */}
                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="p-4">
                        <p className="font-medium mb-2">Next Steps</p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Your resume is saved. When you find a job you like, we&apos;ll help you create a tailored cover letter.
                        </p>
                        <Link href="/jobs">
                          <Button className="w-full">
                            Browse Matching Jobs
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {!analysis && !error && !isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 text-muted-foreground"
                  >
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Paste your resume and click Analyze</p>
                    <p className="text-sm">to get personalized feedback</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SuggestionItem({ suggestion }: { suggestion: ResumeSuggestion }) {
  const priorityColors = {
    high: 'text-red-600 bg-red-100 dark:bg-red-900/30',
    medium: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30',
    low: 'text-green-600 bg-green-100 dark:bg-green-900/30'
  };

  const sectionLabels = {
    summary: 'Summary',
    experience: 'Experience',
    skills: 'Skills',
    education: 'Education',
    general: 'General'
  };

  return (
    <div className="p-3 rounded-lg bg-muted/50">
      <div className="flex items-center gap-2 mb-1">
        <Badge variant="outline" className="text-xs">
          {sectionLabels[suggestion.section]}
        </Badge>
        <span className={`text-xs px-2 py-0.5 rounded ${priorityColors[suggestion.priority]}`}>
          {suggestion.priority}
        </span>
      </div>
      <p className="text-sm">{suggestion.advice}</p>
    </div>
  );
}
