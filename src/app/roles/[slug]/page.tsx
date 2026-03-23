'use client';

import { useState, useEffect, use } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, DollarSign, MapPin, Briefcase, Target, 
  Zap, ChevronRight, Copy, Check
} from 'lucide-react';
import Link from 'next/link';

interface RoleDetail {
  id: string;
  title: string;
  slug: string;
  department: string;
  level: string;
  description: string | null;
  keywords: {
    all: { keyword: string; weight: number; type: string; importance: string }[];
    critical: string[];
    important: string[];
    niceToHave: string[];
    byType: Record<string, { keyword: string; weight: number; importance: string }[]>;
  };
  salaryBands: {
    region: string;
    min: number;
    max: number;
    currency: string;
    source: string | null;
    year: number;
  }[];
}

function formatSalary(salary: number): string {
  return `$${(salary / 1000).toFixed(0)}K`;
}

export default function RoleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [role, setRole] = useState<RoleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchRole() {
      try {
        const response = await fetch(`/api/roles/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setRole(data);
        }
      } catch (error) {
        console.error('Failed to fetch role:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRole();
  }, [slug]);

  const copyKeywords = () => {
    if (!role) return;
    const allKeywords = role.keywords.all.map(k => k.keyword).join(', ');
    navigator.clipboard.writeText(allKeywords);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8 px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="grid md:grid-cols-2 gap-6">
              <div className="h-64 bg-muted rounded" />
              <div className="h-64 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Role not found</h1>
          <Link href="/roles">
            <Button>Browse All Roles</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <Link 
            href="/roles" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Roles
          </Link>
          
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold">{role.title}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge>{role.department}</Badge>
                <Badge variant="outline">{role.level}</Badge>
              </div>
            </div>
            <Link href={`/ats?role=${role.slug}`}>
              <Button size="lg">
                <Zap className="h-4 w-4 mr-2" />
                Use for ATS Check
              </Button>
            </Link>
          </div>

          {role.description && (
            <p className="text-muted-foreground mt-4 max-w-3xl">
              {role.description}
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  ATS Keywords
                </CardTitle>
                <Button variant="outline" size="sm" onClick={copyKeywords}>
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy All
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {role.keywords.critical.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-red-600 mb-2">
                    Critical Keywords (Must Include)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {role.keywords.critical.map((kw, idx) => (
                      <Badge key={idx} variant="destructive">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {role.keywords.important.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-yellow-600 mb-2">
                    Important Keywords (Should Include)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {role.keywords.important.map((kw, idx) => (
                      <Badge key={idx} variant="secondary">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {role.keywords.niceToHave.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Nice to Have
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {role.keywords.niceToHave.map((kw, idx) => (
                      <Badge key={idx} variant="outline">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Keywords by Type
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(role.keywords.byType).map(([type, keywords]) => (
                <div key={type}>
                  <h4 className="text-sm font-medium capitalize mb-2">{type}s</h4>
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((kw, idx) => (
                      <Badge 
                        key={idx} 
                        variant={
                          kw.importance === 'critical' ? 'destructive' :
                          kw.importance === 'important' ? 'secondary' : 'outline'
                        }
                      >
                        {kw.keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Salary Ranges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {role.salaryBands.map((band, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 border rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{band.region}</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {formatSalary(band.min)} - {formatSalary(band.max)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {band.currency} / year
                      {band.source && (
                        <span className="ml-2">• Source: {band.source}</span>
                      )}
                      <span className="ml-2">• {band.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Ready to check your resume?</h3>
                <p className="text-sm text-muted-foreground">
                  Use these keywords to optimize your resume for ATS screening
                </p>
              </div>
              <Link href={`/ats?role=${role.slug}`}>
                <Button>
                  Go to ATS Checker
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
