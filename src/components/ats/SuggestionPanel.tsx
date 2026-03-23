'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, ArrowRight, Target, FileText, Sparkles, CheckSquare } from 'lucide-react';
import type { Improvement } from '@/lib/ats/score-simulator';

interface SuggestionPanelProps {
  improvements: Improvement[];
  suggestions: string[];
}

export function SuggestionPanel({ improvements, suggestions }: SuggestionPanelProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'keyword':
        return <Target className="h-4 w-4" />;
      case 'format':
        return <FileText className="h-4 w-4" />;
      case 'relevance':
        return <Sparkles className="h-4 w-4" />;
      case 'completeness':
        return <CheckSquare className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return '';
    }
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      high: 'destructive',
      medium: 'secondary',
      low: 'outline',
    };
    return variants[priority] || 'outline';
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          How to Improve
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {improvements.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Prioritized Actions</h4>
            {improvements.map((improvement, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border ${getPriorityColor(improvement.priority)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getCategoryIcon(improvement.category)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={getPriorityBadge(improvement.priority)} className="text-xs">
                        {improvement.priority} priority
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {improvement.category}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">{improvement.action}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <ArrowRight className="h-3 w-3" />
                      {improvement.impact}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Additional Tips</h4>
            <ul className="space-y-2">
              {suggestions.map((suggestion, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary">•</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}

        {improvements.length === 0 && suggestions.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <Sparkles className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p>Your resume looks great! No major improvements needed.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
