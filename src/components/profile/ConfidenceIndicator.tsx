'use client';

import { motion } from 'framer-motion';
import { Info, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ConfidenceIndicatorProps {
  dataPoints: number;
  maxDataPoints: number;
  completedPhases: string[];
}

export function ConfidenceIndicator({ dataPoints, maxDataPoints, completedPhases }: ConfidenceIndicatorProps) {
  const percentage = Math.round((dataPoints / maxDataPoints) * 100);
  
  const level = percentage >= 80 ? 'high' : percentage >= 50 ? 'medium' : 'low';
  
  const levelConfig = {
    high: {
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/20',
      icon: CheckCircle2,
      label: 'High Confidence',
      description: 'Your profile has rich data for accurate insights'
    },
    medium: {
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      icon: HelpCircle,
      label: 'Medium Confidence',
      description: 'Complete more deep dives for better accuracy'
    },
    low: {
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
      borderColor: 'border-muted',
      icon: AlertCircle,
      label: 'Low Confidence',
      description: 'We need more data to provide accurate insights'
    }
  };

  const config = levelConfig[level];
  const Icon = config.icon;

  const phaseLabels: Record<string, string> = {
    core: 'Core Assessment',
    burnout: 'Burnout Analysis',
    workstyle: 'Work Style',
    motivators: 'Motivators',
    skills: 'Skills'
  };

  const allPhases = ['core', 'burnout', 'workstyle', 'motivators', 'skills'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-4 rounded-xl border",
        config.bgColor,
        config.borderColor
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            config.bgColor
          )}>
            <Icon className={cn("w-5 h-5", config.color)} />
          </div>
          <div>
            <p className={cn("font-medium", config.color)}>{config.label}</p>
            <p className="text-sm text-muted-foreground">{config.description}</p>
          </div>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-1 rounded hover:bg-muted/50 transition-colors">
                <Info className="w-4 h-4 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-xs">
              <p className="text-sm mb-2">
                Profile confidence is based on how many data points we have about you.
                More data = better insights and recommendations.
              </p>
              <div className="space-y-1 text-xs">
                {allPhases.map(phase => (
                  <div key={phase} className="flex items-center gap-2">
                    {completedPhases.includes(phase) ? (
                      <CheckCircle2 className="w-3 h-3 text-accent" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-muted-foreground/30" />
                    )}
                    <span className={completedPhases.includes(phase) ? '' : 'text-muted-foreground'}>
                      {phaseLabels[phase]}
                    </span>
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Data Points Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>{dataPoints} data points collected</span>
          <span>{percentage}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={cn(
              "h-full rounded-full",
              level === 'high' ? 'bg-accent' : level === 'medium' ? 'bg-amber-500' : 'bg-muted-foreground'
            )}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// Calculate Data Points
// ============================================

export function calculateDataPoints(answers: Record<string, string[]>): number {
  let points = 0;
  
  for (const [questionId, selectedOptions] of Object.entries(answers)) {
    if (selectedOptions.length > 0) {
      // Core questions = 2 points each, deep dive = 1 point each
      const isCore = questionId.startsWith('q');
      points += isCore ? 2 : 1;
    }
  }
  
  return points;
}

export function getMaxDataPoints(): number {
  // 15 core questions * 2 + 4 burnout * 1 + 3 workstyle * 1 + 4 motivators * 1 + 2 skills * 1
  return 15 * 2 + 4 + 3 + 4 + 2; // = 43
}

