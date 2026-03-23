'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, AlertTriangle } from 'lucide-react';
import type { KeywordMatch } from '@/lib/ats/keyword-analyzer';

interface KeywordMatchListProps {
  matches: KeywordMatch[];
  missing: KeywordMatch[];
  extractedFromJD: string[];
}

export function KeywordMatchList({ matches, missing, extractedFromJD }: KeywordMatchListProps) {
  const getImportanceBadge = (importance: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      critical: 'destructive',
      important: 'default',
      'nice-to-have': 'outline',
    };
    return variants[importance] || 'outline';
  };

  const criticalMissing = missing.filter(m => m.importance === 'critical');
  const importantMissing = missing.filter(m => m.importance === 'important');
  const niceToHaveMissing = missing.filter(m => m.importance === 'nice-to-have');

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              Matched Keywords
            </CardTitle>
            <Badge variant="secondary">{matches.length} found</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {matches.length === 0 ? (
            <p className="text-sm text-muted-foreground">No keywords matched yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {matches.map((match, idx) => (
                <Badge
                  key={idx}
                  variant={getImportanceBadge(match.importance)}
                  className="flex items-center gap-1"
                >
                  <Check className="h-3 w-3" />
                  {match.keyword}
                  {match.foundVariant && match.foundVariant !== match.keyword && (
                    <span className="text-xs opacity-70">
                      (as {match.foundVariant})
                    </span>
                  )}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <X className="h-5 w-5 text-red-600" />
              Missing Keywords
            </CardTitle>
            <Badge variant="destructive">{missing.length} missing</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {criticalMissing.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-600">
                  Critical - Must Add
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {criticalMissing.map((miss, idx) => (
                  <Badge key={idx} variant="destructive" className="flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {miss.keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {importantMissing.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-yellow-600">
                  Important - Should Add
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {importantMissing.map((miss, idx) => (
                  <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {miss.keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {niceToHaveMissing.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Nice to Have
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {niceToHaveMissing.map((miss, idx) => (
                  <Badge key={idx} variant="outline" className="flex items-center gap-1">
                    {miss.keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {missing.length === 0 && (
            <p className="text-sm text-green-600">
              Great! You&apos;ve covered all important keywords.
            </p>
          )}
        </CardContent>
      </Card>

      {extractedFromJD.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Keywords from Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {extractedFromJD.map((keyword, idx) => (
                <Badge key={idx} variant="outline">
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
