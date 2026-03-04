'use client';

import { motion } from 'framer-motion';
import { Insight } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface InsightCardProps {
  insight: Insight;
  index: number;
}

export function InsightCard({ insight, index }: InsightCardProps) {
  const icons = {
    why_hate: '😫',
    why_love: '⚡',
    why_feel: '💡'
  };

  const typeLabels = {
    why_hate: 'Why you hate this',
    why_love: 'Why you love this',
    why_feel: 'Why you feel this way'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-4 rounded-xl bg-card border"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icons[insight.type]}</span>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground mb-1">
            {typeLabels[insight.type]}
          </p>
          <h4 className="font-medium mb-2">{insight.title}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {insight.explanation}
          </p>
          <div className="flex flex-wrap gap-1 mt-3">
            {insight.frameworkBasis.map((framework) => (
              <Badge key={framework} variant="outline" className="text-xs">
                {framework}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

