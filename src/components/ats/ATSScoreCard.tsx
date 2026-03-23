'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, XCircle, Info } from 'lucide-react';
import type { ATSScore } from '@/lib/ats/score-simulator';

interface ATSScoreCardProps {
  score: ATSScore;
}

export function ATSScoreCard({ score }: ATSScoreCardProps) {
  const getScoreColor = (value: number) => {
    if (value >= 75) return 'text-green-600';
    if (value >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getLikelihoodIcon = () => {
    switch (score.passLikelihood) {
      case 'high':
        return <CheckCircle2 className="h-6 w-6 text-green-600" />;
      case 'medium':
        return <AlertCircle className="h-6 w-6 text-yellow-600" />;
      case 'low':
        return <XCircle className="h-6 w-6 text-red-600" />;
    }
  };

  const getLikelihoodBadge = () => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      high: 'default',
      medium: 'secondary',
      low: 'destructive',
    };
    const labels = {
      high: 'Likely to Pass',
      medium: 'May Pass',
      low: 'At Risk',
    };
    return (
      <Badge variant={variants[score.passLikelihood]}>
        {labels[score.passLikelihood]}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">ATS Score</CardTitle>
          {getLikelihoodBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          {getLikelihoodIcon()}
          <div className="flex-1">
            <div className={`text-4xl font-bold ${getScoreColor(score.overall)}`}>
              {score.overall}
              <span className="text-lg text-muted-foreground">/100</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {score.modeDescription}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium">Score Breakdown</h4>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Keyword Match</span>
                <span className={getScoreColor(score.breakdown.keywordMatch)}>
                  {score.breakdown.keywordMatch}%
                </span>
              </div>
              <Progress 
                value={score.breakdown.keywordMatch} 
                className="h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Formatting</span>
                <span className={getScoreColor(score.breakdown.formatting)}>
                  {score.breakdown.formatting}%
                </span>
              </div>
              <Progress 
                value={score.breakdown.formatting} 
                className="h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Relevance</span>
                <span className={getScoreColor(score.breakdown.relevance)}>
                  {score.breakdown.relevance}%
                </span>
              </div>
              <Progress 
                value={score.breakdown.relevance} 
                className="h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Completeness</span>
                <span className={getScoreColor(score.breakdown.completeness)}>
                  {score.breakdown.completeness}%
                </span>
              </div>
              <Progress 
                value={score.breakdown.completeness} 
                className="h-2"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>{score.summary}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
