'use client';

import { motion } from 'framer-motion';
import { PsychologyProfile, HollandTypeNames } from '@/lib/types';
import { getCareerAnchorDescription } from '@/lib/profile/generator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface PsychologyCardProps {
  psychology: PsychologyProfile;
}

export function PsychologyCard({ psychology }: PsychologyCardProps) {
  const { sdt, careerAnchor, holland, bigFive, burnout, jdr } = psychology;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Career Anchor */}
      <div className="p-4 rounded-xl bg-card border">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Career Anchor</h3>
        <p className="text-xl font-semibold capitalize mb-1">
          {careerAnchor.primary.replace('_', ' ')}
        </p>
        <p className="text-sm text-muted-foreground">
          {getCareerAnchorDescription(careerAnchor.primary)}
        </p>
        {careerAnchor.secondary && (
          <p className="text-xs text-muted-foreground mt-2">
            Secondary: {careerAnchor.secondary.replace('_', ' ')}
          </p>
        )}
      </div>

      {/* Holland Type */}
      <div className="p-4 rounded-xl bg-card border">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Work Personality (Holland)</h3>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl font-bold font-mono">{holland.code}</span>
          <Badge variant="secondary">{HollandTypeNames[holland.primary]}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {HollandTypeNames[holland.primary]} + {HollandTypeNames[holland.secondary]} + {HollandTypeNames[holland.tertiary]}
        </p>
      </div>

      {/* SDT Needs */}
      <div className="p-4 rounded-xl bg-card border">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Core Needs (Self-Determination)</h3>
        <div className="space-y-3">
          {(['autonomy', 'competence', 'relatedness'] as const).map((need) => {
            const status = sdt[need];
            const colors = {
              unmet: 'bg-destructive',
              partial: 'bg-amber-500',
              met: 'bg-accent'
            };
            const labels = {
              unmet: 'Unmet',
              partial: 'Partial',
              met: 'Met'
            };
            
            return (
              <div key={need} className="flex items-center justify-between">
                <span className="text-sm capitalize">{need}</span>
                <Badge variant="outline" className={`${colors[status]} text-white border-0`}>
                  {labels[status]}
                </Badge>
              </div>
            );
          })}
        </div>
        {sdt.primaryUnmetNeed && (
          <p className="text-xs text-destructive mt-3">
            Primary unmet need: {sdt.primaryUnmetNeed}
          </p>
        )}
      </div>

      {/* Burnout Level */}
      {burnout.level !== 'low' && (
        <div className="p-4 rounded-xl bg-card border">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Burnout Assessment</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Exhaustion</span>
                <span>{burnout.exhaustion}%</span>
              </div>
              <Progress value={burnout.exhaustion} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Cynicism</span>
                <span>{burnout.cynicism}%</span>
              </div>
              <Progress value={burnout.cynicism} className="h-2" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Burnout type: {jdr.imbalanceType.replace('_', ' ')}
          </p>
        </div>
      )}

      {/* Work Style (Big Five) */}
      <div className="p-4 rounded-xl bg-card border">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Work Style</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Social Energy', value: bigFive.extraversion, low: 'Reserved', high: 'Outgoing' },
            { label: 'Openness', value: bigFive.openness, low: 'Practical', high: 'Curious' },
            { label: 'Structure', value: bigFive.conscientiousness, low: 'Flexible', high: 'Organized' }
          ].map((trait) => (
            <div key={trait.label} className="p-2 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">{trait.label}</p>
              <p className="text-sm font-medium">
                {trait.value === 'low' ? trait.low : 
                 trait.value === 'high' ? trait.high : 'Balanced'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

