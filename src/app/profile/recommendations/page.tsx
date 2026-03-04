'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Building2, Briefcase, Target, RefreshCw } from 'lucide-react';
import { useAssessmentStore } from '@/lib/assessment/store';
import { generateCareerProfile } from '@/lib/profile/generator';
import { generateIdealCompanyProfile, IdealCompanyProfile } from '@/lib/recommendations/company-profile';
import { generateIdealJobProfile, IdealJobProfile } from '@/lib/recommendations/job-profile';
import { matchCompaniesToProfile, CompanyMatch } from '@/lib/recommendations/company-database';
import { CareerProfile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { IdealCompany } from '@/components/recommendations/IdealCompany';
import { IdealRole } from '@/components/recommendations/IdealRole';
import { TargetCompanies } from '@/components/recommendations/TargetCompanies';

type Tab = 'company' | 'role' | 'targets';

export default function RecommendationsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<CareerProfile | null>(null);
  const [companyProfile, setCompanyProfile] = useState<IdealCompanyProfile | null>(null);
  const [jobProfile, setJobProfile] = useState<IdealJobProfile | null>(null);
  const [companyMatches, setCompanyMatches] = useState<{
    perfectFit: CompanyMatch[];
    worthExploring: CompanyMatch[];
    avoidUnless: CompanyMatch[];
  } | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('company');
  const [mounted, setMounted] = useState(false);
  
  const { answers, textAnswers, reset } = useAssessmentStore();
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

      // Generate career profile
      const generatedProfile = generateCareerProfile(answers);
      setProfile(generatedProfile);
      
      // Generate company profile recommendations
      const idealCompany = generateIdealCompanyProfile(generatedProfile, answers);
      setCompanyProfile(idealCompany);
      
      // Generate job profile recommendations
      const idealJob = generateIdealJobProfile(generatedProfile, answers);
      setJobProfile(idealJob);
      
      // Match companies
      const anchors = generatedProfile.psychology.careerAnchor?.primary 
        ? [generatedProfile.psychology.careerAnchor.primary]
        : [];
      
      const matches = matchCompaniesToProfile(
        anchors,
        idealCompany.culture.ideal,
        idealCompany.stage.ideal,
        idealCompany.workMode.ideal,
        idealCompany.industries
      );
      setCompanyMatches(matches);
    }
  }, [mounted, answers, router]);

  const handleStartOver = () => {
    reset();
    router.push('/assessment');
  };

  if (!mounted || !profile || !companyProfile || !jobProfile || !companyMatches) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Generating your recommendations...</p>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'company', label: 'Ideal Company', icon: <Building2 className="w-4 h-4" /> },
    { id: 'role', label: 'Ideal Role', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'targets', label: 'Target List', icon: <Target className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link 
            href="/profile"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Profile</span>
          </Link>
          
          <span className="font-semibold">Recommendations</span>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleStartOver}>
              <RefreshCw className="w-4 h-4 mr-1" />
              Restart
            </Button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="sticky top-14 z-40 bg-background border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'company' && (
            <IdealCompany companyProfile={companyProfile} userName={userName} />
          )}
          {activeTab === 'role' && (
            <IdealRole jobProfile={jobProfile} userName={userName} />
          )}
          {activeTab === 'targets' && (
            <TargetCompanies 
              perfectFit={companyMatches.perfectFit}
              worthExploring={companyMatches.worthExploring}
              avoidUnless={companyMatches.avoidUnless}
              userName={userName}
            />
          )}
        </motion.div>

        {/* Navigation between tabs */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => {
              const currentIndex = tabs.findIndex(t => t.id === activeTab);
              if (currentIndex > 0) {
                setActiveTab(tabs[currentIndex - 1].id);
              }
            }}
            disabled={activeTab === 'company'}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {activeTab === 'targets' ? (
            <Link href="/jobs">
              <Button className="group">
                Browse Matching Jobs
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          ) : (
            <Button
              onClick={() => {
                const currentIndex = tabs.findIndex(t => t.id === activeTab);
                if (currentIndex < tabs.length - 1) {
                  setActiveTab(tabs[currentIndex + 1].id);
                }
              }}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 mt-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Recommendations based on your career profile and psychology assessment</p>
        </div>
      </footer>
    </div>
  );
}

