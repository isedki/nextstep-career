import { NextRequest, NextResponse } from 'next/server';
import { getStaticRoleBySlug } from '@/lib/db/static-roles';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const role = getStaticRoleBySlug(slug);

    if (!role) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      );
    }

    const keywordsByType = role.keywords.reduce(
      (acc, k) => {
        if (!acc[k.type]) acc[k.type] = [];
        acc[k.type].push({
          keyword: k.keyword,
          weight: k.weight,
          importance:
            k.weight >= 3 ? 'critical' : k.weight >= 2 ? 'important' : 'nice-to-have',
        });
        return acc;
      },
      {} as Record<string, { keyword: string; weight: number; importance: string }[]>
    );

    return NextResponse.json({
      id: role.id,
      title: role.title,
      slug: role.slug,
      department: role.department,
      level: role.level,
      description: role.description,
      keywords: {
        all: role.keywords.map((k) => ({
          keyword: k.keyword,
          weight: k.weight,
          type: k.type,
          importance:
            k.weight >= 3 ? 'critical' : k.weight >= 2 ? 'important' : 'nice-to-have',
        })),
        byType: keywordsByType,
        critical: role.keywords.filter((k) => k.weight >= 3).map((k) => k.keyword),
        important: role.keywords.filter((k) => k.weight === 2).map((k) => k.keyword),
        niceToHave: role.keywords.filter((k) => k.weight === 1).map((k) => k.keyword),
      },
      salaryBands: role.salaryBands.map((s) => ({
        region: s.region,
        min: s.minSalary,
        max: s.maxSalary,
        currency: s.currency,
        source: s.source,
        year: s.year,
      })),
    });
  } catch (error) {
    console.error('Error fetching role:', error);
    return NextResponse.json(
      { error: 'Failed to fetch role' },
      { status: 500 }
    );
  }
}
