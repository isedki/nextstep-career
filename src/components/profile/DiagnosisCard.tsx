'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, AlertCircle, CheckCircle2, HelpCircle, Quote } from 'lucide-react';
import { Diagnosis } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface DiagnosisCardProps {
  diagnosis: Diagnosis;
  index: number;
  userQuotes?: string[]; // Original answers that led to this diagnosis
}

export function DiagnosisCard({ diagnosis, index, userQuotes = [] }: DiagnosisCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const confidenceColors = {
    high: 'bg-destructive/10 text-destructive border-destructive/20',
    medium: 'bg-warning/10 text-warning border-warning/20',
    low: 'bg-muted text-muted-foreground border-muted'
  };

  const confidenceIcons = {
    high: AlertCircle,
    medium: HelpCircle,
    low: CheckCircle2
  };

  const Icon = confidenceIcons[diagnosis.confidence];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="border rounded-xl overflow-hidden bg-card"
    >
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            diagnosis.confidence === 'high' ? 'bg-destructive/10' : 
            diagnosis.confidence === 'medium' ? 'bg-amber-500/10' : 'bg-muted'
          )}>
            <Icon className={cn(
              "w-5 h-5",
              diagnosis.confidence === 'high' ? 'text-destructive' : 
              diagnosis.confidence === 'medium' ? 'text-amber-500' : 'text-muted-foreground'
            )} />
          </div>
          
          <div className="text-left">
            <h3 className="font-semibold">{diagnosis.issue}</h3>
            <p className="text-sm text-muted-foreground">
              {diagnosis.evidence.length} signals detected
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className={cn(confidenceColors[diagnosis.confidence])}>
            {diagnosis.confidence} confidence
          </Badge>
          <ChevronDown className={cn(
            "w-5 h-5 text-muted-foreground transition-transform",
            isExpanded && "rotate-180"
          )} />
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t pt-4">
              {/* You Said - User Quotes */}
              {userQuotes.length > 0 && (
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2 text-primary">
                    <Quote className="w-4 h-4" />
                    You said:
                  </h4>
                  <div className="space-y-2">
                    {userQuotes.map((quote, i) => (
                      <p key={i} className="text-sm italic pl-4 border-l-2 border-primary/30">
                        &ldquo;{quote}&rdquo;
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Evidence */}
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <span>📋</span> Evidence from your answers
                </h4>
                <ul className="space-y-2">
                  {diagnosis.evidence.map((e, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-muted-foreground">•</span>
                      <span>{e.signal}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Explanation */}
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <span>📖</span> What this means
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {diagnosis.explanation}
                </p>
              </div>

              {/* Screening Questions */}
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <span>🎯</span> Questions to ask in interviews
                </h4>
                <ul className="space-y-2">
                  {diagnosis.screeningQuestions.map((q, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm bg-muted/50 p-3 rounded-lg">
                      <span className="text-primary font-medium">{i + 1}.</span>
                      <span>&ldquo;{q}&rdquo;</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
