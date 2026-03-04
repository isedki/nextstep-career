'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, 
  Clock, 
  TrendingUp, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  useExpectationsStore,
  formatSalary,
  type SalaryExpectations,
  type WorkLifeExpectations,
  type RoleLevelExpectations
} from '@/lib/expectations/store';
import {
  salaryQuestions,
  workLifeQuestions,
  roleLevelQuestions,
  type ExpectationQuestion
} from '@/lib/expectations/questions';

const categoryIcons = {
  salary: DollarSign,
  work_life: Clock,
  role_level: TrendingUp
};

const categoryNames = {
  salary: 'Compensation',
  work_life: 'Work-Life Balance',
  role_level: 'Role & Level'
};

export default function ExpectationsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(0);
  const categories = ['salary', 'work_life', 'role_level'] as const;
  
  const {
    expectations,
    setSalaryExpectation,
    setWorkLifeExpectation,
    setRoleLevelExpectation,
    completeExpectations,
    isComplete
  } = useExpectationsStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const currentCategoryKey = categories[currentCategory];
  const progress = ((currentCategory + 1) / categories.length) * 100;

  const getQuestions = (): ExpectationQuestion[] => {
    switch (currentCategoryKey) {
      case 'salary':
        return salaryQuestions;
      case 'work_life':
        return workLifeQuestions;
      case 'role_level':
        return roleLevelQuestions;
      default:
        return [];
    }
  };

  const handleNext = () => {
    if (currentCategory < categories.length - 1) {
      setCurrentCategory(currentCategory + 1);
    } else {
      completeExpectations();
      router.push('/jobs');
    }
  };

  const handleBack = () => {
    if (currentCategory > 0) {
      setCurrentCategory(currentCategory - 1);
    } else {
      router.push('/profile');
    }
  };

  const handleSalaryChange = (key: keyof SalaryExpectations, value: SalaryExpectations[keyof SalaryExpectations]) => {
    setSalaryExpectation(key, value);
  };

  const handleWorkLifeChange = (key: keyof WorkLifeExpectations, value: WorkLifeExpectations[keyof WorkLifeExpectations]) => {
    setWorkLifeExpectation(key, value);
  };

  const handleRoleLevelChange = (key: keyof RoleLevelExpectations, value: RoleLevelExpectations[keyof RoleLevelExpectations]) => {
    setRoleLevelExpectation(key, value);
  };

  const Icon = categoryIcons[currentCategoryKey];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="p-4 border-b">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to Profile
          </Link>
          <span className="font-semibold">Set Your Expectations</span>
          <div className="w-20" />
        </div>
      </header>

      {/* Progress */}
      <div className="px-4 py-3 border-b bg-muted/30">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              Step {currentCategory + 1} of {categories.length}
            </span>
            <span className="font-medium">{categoryNames[currentCategoryKey]}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCategoryKey}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{categoryNames[currentCategoryKey]}</h2>
                  <p className="text-sm text-muted-foreground">
                    {currentCategoryKey === 'salary' && "What are you looking for compensation-wise?"}
                    {currentCategoryKey === 'work_life' && "How do you want to balance work and life?"}
                    {currentCategoryKey === 'role_level' && "What level and scope are you targeting?"}
                  </p>
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-6">
                {currentCategoryKey === 'salary' && (
                  <SalarySection
                    expectations={expectations.salary}
                    onChange={handleSalaryChange}
                  />
                )}
                {currentCategoryKey === 'work_life' && (
                  <WorkLifeSection
                    expectations={expectations.workLife}
                    onChange={handleWorkLifeChange}
                  />
                )}
                {currentCategoryKey === 'role_level' && (
                  <RoleLevelSection
                    expectations={expectations.roleLevel}
                    onChange={handleRoleLevelChange}
                  />
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <Button variant="ghost" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={handleNext}>
              {currentCategory < categories.length - 1 ? (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Find Jobs
                  <CheckCircle2 className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

// ============================================
// Salary Section Component
// ============================================

interface SalarySectionProps {
  expectations: SalaryExpectations;
  onChange: (key: keyof SalaryExpectations, value: SalaryExpectations[keyof SalaryExpectations]) => void;
}

function SalarySection({ expectations, onChange }: SalarySectionProps) {
  const currencies = [
    { id: 'USD', label: 'USD ($)' },
    { id: 'EUR', label: 'EUR (€)' },
    { id: 'GBP', label: 'GBP (£)' },
    { id: 'CAD', label: 'CAD (C$)' },
    { id: 'AUD', label: 'AUD (A$)' },
    { id: 'CHF', label: 'CHF (Fr)' },
    { id: 'INR', label: 'INR (₹)' },
    { id: 'SGD', label: 'SGD (S$)' }
  ];

  const flexibilityOptions = [
    { id: 'firm', label: "Firm - won't go below minimum" },
    { id: 'negotiable', label: 'Negotiable - depends on other factors' },
    { id: 'flexible', label: 'Flexible - willing to trade for right fit' }
  ];

  return (
    <div className="space-y-6">
      {/* Currency */}
      <Card>
        <CardContent className="p-4">
          <Label className="text-sm font-medium">Currency</Label>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {currencies.map((curr) => (
              <button
                key={curr.id}
                onClick={() => onChange('currency', curr.id)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  expectations.currency === curr.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {curr.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Salary Range */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div>
            <Label htmlFor="salary-min" className="text-sm font-medium">
              Minimum Acceptable
            </Label>
            <p className="text-xs text-muted-foreground mb-2">
              The floor - you wouldn&apos;t consider anything below this
            </p>
            <div className="relative">
              <Input
                id="salary-min"
                type="number"
                placeholder="e.g., 80000"
                value={expectations.min || ''}
                onChange={(e) => onChange('min', e.target.value ? Number(e.target.value) : null)}
                className="pl-8"
              />
              <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          <div>
            <Label htmlFor="salary-target" className="text-sm font-medium">
              Target Salary
            </Label>
            <p className="text-xs text-muted-foreground mb-2">
              A fair number you&apos;d be happy with
            </p>
            <div className="relative">
              <Input
                id="salary-target"
                type="number"
                placeholder="e.g., 120000"
                value={expectations.target || ''}
                onChange={(e) => onChange('target', e.target.value ? Number(e.target.value) : null)}
                className="pl-8"
              />
              <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          <div>
            <Label htmlFor="salary-stretch" className="text-sm font-medium">
              Stretch Goal
            </Label>
            <p className="text-xs text-muted-foreground mb-2">
              If everything aligned perfectly
            </p>
            <div className="relative">
              <Input
                id="salary-stretch"
                type="number"
                placeholder="e.g., 150000"
                value={expectations.stretch || ''}
                onChange={(e) => onChange('stretch', e.target.value ? Number(e.target.value) : null)}
                className="pl-8"
              />
              <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      {(expectations.min || expectations.target) && (
        <div className="p-3 rounded-lg bg-muted/50 text-sm">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div>
              <span className="text-muted-foreground">Your range: </span>
              <span className="font-medium">
                {formatSalary(expectations.min, expectations.currency)} - {formatSalary(expectations.stretch || expectations.target, expectations.currency)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Flexibility */}
      <Card>
        <CardContent className="p-4">
          <Label className="text-sm font-medium">Flexibility</Label>
          <div className="space-y-2 mt-2">
            {flexibilityOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onChange('flexibility', opt.id as SalaryExpectations['flexibility'])}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  expectations.flexibility === opt.id
                    ? 'bg-primary/10 border-2 border-primary'
                    : 'bg-muted hover:bg-muted/80 border-2 border-transparent'
                }`}
              >
                <span className="text-sm">{opt.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// Work-Life Section Component
// ============================================

interface WorkLifeSectionProps {
  expectations: WorkLifeExpectations;
  onChange: (key: keyof WorkLifeExpectations, value: WorkLifeExpectations[keyof WorkLifeExpectations]) => void;
}

function WorkLifeSection({ expectations, onChange }: WorkLifeSectionProps) {
  const hoursOptions = [
    { id: 35, label: '35 hours (strict boundaries)' },
    { id: 40, label: '40 hours (standard)' },
    { id: 45, label: '45 hours (some flexibility)' },
    { id: 50, label: '50 hours (dedicated)' },
    { id: 55, label: '55+ hours (mission-driven)' }
  ];

  const flexibilityOptions = [
    { id: 'critical', label: 'Critical - need full control' },
    { id: 'important', label: 'Important - need some flexibility' },
    { id: 'nice_to_have', label: 'Nice to have - can work fixed hours' },
    { id: 'indifferent', label: "Indifferent - doesn't matter much" }
  ];

  const remoteOptions = [
    { id: 'required', label: 'Fully remote - non-negotiable' },
    { id: 'preferred', label: 'Mostly remote (1-2 office days max)' },
    { id: 'flexible', label: 'Hybrid is fine (2-3 office days)' },
    { id: 'onsite_ok', label: 'On-site is fine' },
    { id: 'onsite_preferred', label: 'Prefer on-site actually' }
  ];

  const travelOptions = [
    { id: 'none', label: 'No travel' },
    { id: 'minimal', label: 'Minimal (1-2 trips/year)' },
    { id: 'occasional', label: 'Occasional (monthly or so)' },
    { id: 'regular', label: 'Regular travel is fine' }
  ];

  const timezoneOptions = [
    { id: 'own_tz', label: 'Prefer my timezone only' },
    { id: 'nearby', label: 'Nearby timezones (+/- 3 hours)' },
    { id: 'some_overlap', label: 'Some overlap needed' },
    { id: 'any', label: 'Fully async is fine' }
  ];

  return (
    <div className="space-y-6">
      {/* Max Hours */}
      <Card>
        <CardContent className="p-4">
          <Label className="text-sm font-medium">Maximum Hours Per Week</Label>
          <p className="text-xs text-muted-foreground mb-3">Be honest - sustainable pace matters</p>
          <div className="space-y-2">
            {hoursOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onChange('maxHours', opt.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  expectations.maxHours === opt.id
                    ? 'bg-primary/10 border-2 border-primary'
                    : 'bg-muted hover:bg-muted/80 border-2 border-transparent'
                }`}
              >
                <span className="text-sm">{opt.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Flexibility Need */}
      <Card>
        <CardContent className="p-4">
          <Label className="text-sm font-medium">Schedule Flexibility</Label>
          <p className="text-xs text-muted-foreground mb-3">Ability to set your own hours</p>
          <div className="space-y-2">
            {flexibilityOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onChange('flexibilityNeed', opt.id as WorkLifeExpectations['flexibilityNeed'])}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  expectations.flexibilityNeed === opt.id
                    ? 'bg-primary/10 border-2 border-primary'
                    : 'bg-muted hover:bg-muted/80 border-2 border-transparent'
                }`}
              >
                <span className="text-sm">{opt.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Remote Preference */}
      <Card>
        <CardContent className="p-4">
          <Label className="text-sm font-medium">Remote Work</Label>
          <div className="space-y-2 mt-3">
            {remoteOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onChange('remotePreference', opt.id as WorkLifeExpectations['remotePreference'])}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  expectations.remotePreference === opt.id
                    ? 'bg-primary/10 border-2 border-primary'
                    : 'bg-muted hover:bg-muted/80 border-2 border-transparent'
                }`}
              >
                <span className="text-sm">{opt.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Travel Tolerance */}
      <Card>
        <CardContent className="p-4">
          <Label className="text-sm font-medium">Travel Tolerance</Label>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {travelOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onChange('travelTolerance', opt.id as WorkLifeExpectations['travelTolerance'])}
                className={`p-3 rounded-lg text-sm transition-colors ${
                  expectations.travelTolerance === opt.id
                    ? 'bg-primary/10 border-2 border-primary'
                    : 'bg-muted hover:bg-muted/80 border-2 border-transparent'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Timezone Flexibility */}
      <Card>
        <CardContent className="p-4">
          <Label className="text-sm font-medium">Timezone Flexibility</Label>
          <p className="text-xs text-muted-foreground mb-3">Cross-timezone meetings, async work</p>
          <div className="grid grid-cols-2 gap-2">
            {timezoneOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onChange('timezoneFlexibility', opt.id as WorkLifeExpectations['timezoneFlexibility'])}
                className={`p-3 rounded-lg text-sm transition-colors ${
                  expectations.timezoneFlexibility === opt.id
                    ? 'bg-primary/10 border-2 border-primary'
                    : 'bg-muted hover:bg-muted/80 border-2 border-transparent'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// Role Level Section Component
// ============================================

interface RoleLevelSectionProps {
  expectations: RoleLevelExpectations;
  onChange: (key: keyof RoleLevelExpectations, value: RoleLevelExpectations[keyof RoleLevelExpectations]) => void;
}

function RoleLevelSection({ expectations, onChange }: RoleLevelSectionProps) {
  const seniorityOptions = [
    { id: 'same', label: 'Same level as now' },
    { id: 'up_one', label: 'One level up (promotion)' },
    { id: 'skip', label: 'Skip level (ambitious)' },
    { id: 'down_ok', label: 'Down is OK for right role' },
    { id: 'flexible', label: "Flexible - title doesn't matter" }
  ];

  const managementOptions = [
    { id: 'ic_only', label: 'IC only - no reports' },
    { id: 'lead_ok', label: 'Tech lead (1-3 reports) is OK' },
    { id: 'manager', label: 'Want to manage a team' },
    { id: 'senior_mgmt', label: 'Senior management / director' },
    { id: 'either', label: 'Either IC or management' }
  ];

  const scopeOptions = [
    { id: 'deep_narrow', label: 'Deep focus on one area' },
    { id: 'broad_shallow', label: 'Broad, cross-functional' },
    { id: 'strategic', label: 'Strategic, high-level' },
    { id: 'tactical', label: 'Tactical, hands-on execution' },
    { id: 'varies', label: 'Depends on the role' }
  ];

  const teamSizeOptions = [
    { id: 'tiny', label: 'Tiny (2-5)' },
    { id: 'small', label: 'Small (5-15)' },
    { id: 'medium', label: 'Medium (15-50)' },
    { id: 'large', label: 'Large (50+)' },
    { id: 'any', label: 'No preference' }
  ];

  const ownershipOptions = [
    { id: 'full', label: 'Full ownership - end-to-end' },
    { id: 'shared', label: 'Shared ownership - collaborative' },
    { id: 'contributor', label: 'Contributor - clear boundaries' },
    { id: 'support', label: 'Support - help others succeed' }
  ];

  return (
    <div className="space-y-6">
      {/* Seniority Target */}
      <Card>
        <CardContent className="p-4">
          <Label className="text-sm font-medium">Seniority Target</Label>
          <div className="space-y-2 mt-3">
            {seniorityOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onChange('seniorityTarget', opt.id as RoleLevelExpectations['seniorityTarget'])}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  expectations.seniorityTarget === opt.id
                    ? 'bg-primary/10 border-2 border-primary'
                    : 'bg-muted hover:bg-muted/80 border-2 border-transparent'
                }`}
              >
                <span className="text-sm">{opt.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Management Interest */}
      <Card>
        <CardContent className="p-4">
          <Label className="text-sm font-medium">People Management</Label>
          <div className="space-y-2 mt-3">
            {managementOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onChange('managementInterest', opt.id as RoleLevelExpectations['managementInterest'])}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  expectations.managementInterest === opt.id
                    ? 'bg-primary/10 border-2 border-primary'
                    : 'bg-muted hover:bg-muted/80 border-2 border-transparent'
                }`}
              >
                <span className="text-sm">{opt.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scope Preference */}
      <Card>
        <CardContent className="p-4">
          <Label className="text-sm font-medium">Preferred Scope</Label>
          <div className="space-y-2 mt-3">
            {scopeOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onChange('scopePreference', opt.id as RoleLevelExpectations['scopePreference'])}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  expectations.scopePreference === opt.id
                    ? 'bg-primary/10 border-2 border-primary'
                    : 'bg-muted hover:bg-muted/80 border-2 border-transparent'
                }`}
              >
                <span className="text-sm">{opt.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Size */}
      <Card>
        <CardContent className="p-4">
          <Label className="text-sm font-medium">Preferred Team Size</Label>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {teamSizeOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onChange('teamSizePreference', opt.id as RoleLevelExpectations['teamSizePreference'])}
                className={`p-3 rounded-lg text-sm transition-colors ${
                  expectations.teamSizePreference === opt.id
                    ? 'bg-primary/10 border-2 border-primary'
                    : 'bg-muted hover:bg-muted/80 border-2 border-transparent'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ownership Level */}
      <Card>
        <CardContent className="p-4">
          <Label className="text-sm font-medium">Ownership Level</Label>
          <div className="space-y-2 mt-3">
            {ownershipOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onChange('ownershipLevel', opt.id as RoleLevelExpectations['ownershipLevel'])}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  expectations.ownershipLevel === opt.id
                    ? 'bg-primary/10 border-2 border-primary'
                    : 'bg-muted hover:bg-muted/80 border-2 border-transparent'
                }`}
              >
                <span className="text-sm">{opt.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
