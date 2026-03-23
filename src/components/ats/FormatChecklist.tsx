'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, AlertTriangle, Info } from 'lucide-react';
import type { FormatCheckResult } from '@/lib/ats/format-rules';

interface FormatChecklistProps {
  formatResult: FormatCheckResult;
}

export function FormatChecklist({ formatResult }: FormatChecklistProps) {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <X className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      error: 'destructive',
      warning: 'secondary',
      info: 'outline',
    };
    return variants[severity] || 'outline';
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Format Score</CardTitle>
            <Badge 
              variant={formatResult.score >= 70 ? 'default' : formatResult.score >= 50 ? 'secondary' : 'destructive'}
            >
              {formatResult.score}/100
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {formatResult.passedRules.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-green-600 mb-2 flex items-center gap-2">
                <Check className="h-4 w-4" />
                Passed Checks ({formatResult.passedRules.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {formatResult.passedRules.map((rule, idx) => (
                  <Badge key={idx} variant="outline" className="text-green-600 border-green-200">
                    <Check className="h-3 w-3 mr-1" />
                    {rule}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {formatResult.issues.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Issues Found ({formatResult.issues.length})
              </h4>
              <div className="space-y-3">
                {formatResult.issues.map((issue, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                  >
                    {getSeverityIcon(issue.severity)}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{issue.rule}</span>
                        <Badge variant={getSeverityBadge(issue.severity)} className="text-xs">
                          {issue.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{issue.message}</p>
                      <p className="text-sm text-primary">{issue.suggestion}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {issue.affectedATS.map((ats, i) => (
                          <span key={i} className="text-xs text-muted-foreground">
                            {ats}{i < issue.affectedATS.length - 1 ? ',' : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {formatResult.issues.length === 0 && (
            <div className="flex items-center gap-2 text-green-600">
              <Check className="h-5 w-5" />
              <span>All format checks passed!</span>
            </div>
          )}
        </CardContent>
      </Card>

      {formatResult.recommendations.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {formatResult.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-primary">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
