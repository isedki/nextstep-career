'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, Users, TrendingUp, Code, Headphones, Building2, 
  DollarSign, ChevronRight, Search
} from 'lucide-react';
import Link from 'next/link';

interface Role {
  id: string;
  title: string;
  slug: string;
  department: string;
  level: string;
  description: string | null;
  topKeywords: string[];
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  } | null;
}

const DEPARTMENTS = [
  { id: 'all', name: 'All', icon: Briefcase },
  { id: 'Executive', name: 'Executive', icon: Building2 },
  { id: 'Solutions', name: 'Solutions', icon: Code },
  { id: 'Sales', name: 'Sales', icon: TrendingUp },
  { id: 'CustomerSuccess', name: 'Customer Success', icon: Headphones },
  { id: 'Product', name: 'Product', icon: Briefcase },
  { id: 'Engineering', name: 'Engineering', icon: Code },
];

const LEVELS = [
  { id: 'all', name: 'All Levels' },
  { id: 'IC', name: 'Individual Contributor' },
  { id: 'Manager', name: 'Manager' },
  { id: 'Director', name: 'Director' },
  { id: 'VP', name: 'VP' },
  { id: 'CSuite', name: 'C-Suite' },
];

function formatSalary(salary: number): string {
  if (salary >= 1000000) {
    return `$${(salary / 1000000).toFixed(1)}M`;
  }
  return `$${(salary / 1000).toFixed(0)}K`;
}

function getLevelBadgeVariant(level: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (level) {
    case 'CSuite':
    case 'VP':
      return 'default';
    case 'Director':
      return 'secondary';
    default:
      return 'outline';
  }
}

export function RoleBrowser() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchRoles() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedDepartment !== 'all') params.set('department', selectedDepartment);
        if (selectedLevel !== 'all') params.set('level', selectedLevel);
        if (searchQuery) params.set('q', searchQuery);

        const response = await fetch(`/api/roles?${params}`);
        const data = await response.json();
        setRoles(data.roles || []);
      } catch (error) {
        console.error('Failed to fetch roles:', error);
        setRoles([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRoles();
  }, [selectedDepartment, selectedLevel, searchQuery]);

  const filteredRoles = roles;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {DEPARTMENTS.map((dept) => {
            const Icon = dept.icon;
            return (
              <Button
                key={dept.id}
                variant={selectedDepartment === dept.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDepartment(dept.id)}
                className="gap-1"
              >
                <Icon className="h-4 w-4" />
                {dept.name}
              </Button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2">
          {LEVELS.map((level) => (
            <Button
              key={level.id}
              variant={selectedLevel === level.id ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSelectedLevel(level.id)}
            >
              {level.name}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-muted rounded w-3/4 mb-4" />
                <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                <div className="h-4 bg-muted rounded w-full mb-4" />
                <div className="flex gap-2">
                  <div className="h-6 bg-muted rounded w-16" />
                  <div className="h-6 bg-muted rounded w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredRoles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-medium mb-2">No roles found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search query
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRoles.map((role) => (
            <Card key={role.id} className="hover:border-primary/50 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg leading-tight">{role.title}</CardTitle>
                  <Badge variant={getLevelBadgeVariant(role.level)}>
                    {role.level}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{role.department}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {role.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {role.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-1">
                  {role.topKeywords.slice(0, 4).map((keyword, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                  {role.topKeywords.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{role.topKeywords.length - 4}
                    </Badge>
                  )}
                </div>

                {role.salaryRange && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    {formatSalary(role.salaryRange.min)} - {formatSalary(role.salaryRange.max)}
                    <span className="text-xs">({role.salaryRange.currency})</span>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Link href={`/roles/${role.slug}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                  <Link href={`/ats?role=${role.slug}`}>
                    <Button size="sm">
                      ATS Check
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="text-center text-sm text-muted-foreground">
        Showing {filteredRoles.length} roles
      </div>
    </div>
  );
}
