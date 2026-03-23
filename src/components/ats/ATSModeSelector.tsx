'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Shield, Scale, Sparkles } from 'lucide-react';
import type { ATSMode } from '@/lib/ats/format-rules';

interface ATSModeSelectorProps {
  selectedMode: ATSMode;
  onModeChange: (mode: ATSMode) => void;
}

const modes: {
  id: ATSMode;
  name: string;
  description: string;
  atsSystems: string[];
  icon: typeof Shield;
  color: string;
}[] = [
  {
    id: 'strict',
    name: 'Strict',
    description: 'Exact keyword matching, rigid formatting rules',
    atsSystems: ['Workday', 'Taleo', 'Oracle'],
    icon: Shield,
    color: 'text-red-500',
  },
  {
    id: 'balanced',
    name: 'Balanced',
    description: 'Industry standard with some flexibility',
    atsSystems: ['Greenhouse', 'iCIMS', 'Lever'],
    icon: Scale,
    color: 'text-yellow-500',
  },
  {
    id: 'flexible',
    name: 'Flexible',
    description: 'AI-assisted, semantic matching',
    atsSystems: ['Lever', 'SmartRecruiters', 'Ashby'],
    icon: Sparkles,
    color: 'text-green-500',
  },
];

export function ATSModeSelector({ selectedMode, onModeChange }: ATSModeSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">ATS Mode</h3>
        <span className="text-xs text-muted-foreground">
          Select based on company&apos;s ATS
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isSelected = selectedMode === mode.id;
          
          return (
            <Card
              key={mode.id}
              className={cn(
                'cursor-pointer transition-all hover:border-primary/50',
                isSelected && 'border-primary ring-1 ring-primary'
              )}
              onClick={() => onModeChange(mode.id)}
            >
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Icon className={cn('h-4 w-4', mode.color)} />
                  <span className="font-medium text-sm">{mode.name}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {mode.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {mode.atsSystems.slice(0, 2).map((ats) => (
                    <Badge key={ats} variant="outline" className="text-[10px] px-1 py-0">
                      {ats}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
