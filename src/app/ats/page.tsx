'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ATSScoreCard, 
  ATSModeSelector, 
  KeywordMatchList, 
  FormatChecklist, 
  SuggestionPanel 
} from '@/components/ats';
import { simulateATSScore, ATSScore } from '@/lib/ats/score-simulator';
import { ATSMode } from '@/lib/ats/format-rules';
import { FileText, Briefcase, Zap, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function ATSCheckerContent() {
  const searchParams = useSearchParams();
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [mode, setMode] = useState<ATSMode>('balanced');
  const [score, setScore] = useState<ATSScore | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const jd = searchParams.get('jd');
    const role = searchParams.get('role');
    
    if (jd) {
      setJobDescription(decodeURIComponent(jd));
    }
    
    if (role) {
      fetch(`/api/roles/${role}`)
        .then(res => res.json())
        .then(data => {
          if (data && !jd) {
            setJobDescription(`Looking for a ${data.title}.\n\nRequired skills: ${data.keywords?.critical?.join(', ') || ''}\n\nPreferred skills: ${data.keywords?.important?.join(', ') || ''}`);
          }
        })
        .catch(console.error);
    }
  }, [searchParams]);

  const handleAnalyze = useCallback(() => {
    if (!resumeText.trim() || !jobDescription.trim()) return;

    setIsAnalyzing(true);
    
    setTimeout(() => {
      const result = simulateATSScore(resumeText, jobDescription, mode);
      setScore(result);
      setIsAnalyzing(false);
    }, 500);
  }, [resumeText, jobDescription, mode]);

  const handleClear = () => {
    setResumeText('');
    setJobDescription('');
    setScore(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold">ATS Resume Checker</h1>
          <p className="text-muted-foreground mt-2">
            Check how well your resume will perform against Applicant Tracking Systems
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Your Resume
                </CardTitle>
                <CardDescription>
                  Paste your resume text below
                </CardDescription>
              </CardHeader>
              <CardContent>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume text here...

Example:
John Doe
Software Engineer | john@example.com | (555) 123-4567

EXPERIENCE
Senior Software Engineer - Acme Corp (2020 - Present)
• Led development of microservices architecture serving 1M+ users
• Increased system performance by 40% through optimization
• Mentored team of 5 junior developers

EDUCATION
BS Computer Science - State University (2016)

SKILLS
JavaScript, TypeScript, React, Node.js, AWS, PostgreSQL"
                  className="w-full h-64 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary text-sm font-mono"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">
                    {resumeText.split(/\s+/).filter(Boolean).length} words
                  </span>
                  {resumeText && (
                    <Button variant="ghost" size="sm" onClick={() => setResumeText('')}>
                      Clear
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Job Description
                </CardTitle>
                <CardDescription>
                  Paste the job description you&apos;re applying to
                </CardDescription>
              </CardHeader>
              <CardContent>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here...

Example:
We are looking for a Senior Software Engineer to join our team.

Requirements:
• 5+ years of experience in software development
• Strong proficiency in JavaScript and TypeScript
• Experience with React and Node.js
• Familiarity with cloud services (AWS, GCP, or Azure)
• Experience with PostgreSQL or similar databases

Nice to have:
• Experience with microservices architecture
• Knowledge of CI/CD pipelines
• Team leadership experience"
                  className="w-full h-48 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary text-sm font-mono"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">
                    {jobDescription.split(/\s+/).filter(Boolean).length} words
                  </span>
                  {jobDescription && (
                    <Button variant="ghost" size="sm" onClick={() => setJobDescription('')}>
                      Clear
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <ATSModeSelector selectedMode={mode} onModeChange={setMode} />

            <div className="flex gap-3">
              <Button 
                onClick={handleAnalyze}
                disabled={!resumeText.trim() || !jobDescription.trim() || isAnalyzing}
                className="flex-1"
                size="lg"
              >
                <Zap className="h-4 w-4 mr-2" />
                {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
              </Button>
              {score && (
                <Button variant="outline" onClick={handleClear}>
                  Start Over
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {!score && !isAnalyzing && (
              <Card className="h-96 flex items-center justify-center">
                <CardContent className="text-center">
                  <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-medium mb-2">Ready to Analyze</h3>
                  <p className="text-muted-foreground text-sm max-w-sm">
                    Paste your resume and a job description, then click &quot;Analyze Resume&quot; 
                    to see how well your resume will perform with ATS systems.
                  </p>
                </CardContent>
              </Card>
            )}

            {isAnalyzing && (
              <Card className="h-96 flex items-center justify-center">
                <CardContent className="text-center">
                  <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                  <h3 className="text-lg font-medium">Analyzing your resume...</h3>
                  <p className="text-muted-foreground text-sm mt-2">
                    Checking keywords, formatting, and relevance
                  </p>
                </CardContent>
              </Card>
            )}

            {score && !isAnalyzing && (
              <>
                <ATSScoreCard score={score} />
                
                <SuggestionPanel 
                  improvements={score.improvements} 
                  suggestions={score.keywordAnalysis.suggestions} 
                />
              </>
            )}
          </div>
        </div>

        {score && !isAnalyzing && (
          <div className="mt-8 grid lg:grid-cols-2 gap-6">
            <KeywordMatchList
              matches={score.keywordAnalysis.matches}
              missing={score.keywordAnalysis.missing}
              extractedFromJD={score.keywordAnalysis.extractedFromJD}
            />
            <FormatChecklist formatResult={score.formatAnalysis} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function ATSCheckerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    }>
      <ATSCheckerContent />
    </Suspense>
  );
}
