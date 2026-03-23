import { NextRequest, NextResponse } from 'next/server';
import { getStaticRoleBySlug, getStaticRoles } from '@/lib/db/static-roles';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roleSlug } = body;

    if (!roleSlug) {
      return NextResponse.json(
        { error: 'roleSlug is required' },
        { status: 400 }
      );
    }

    const role = getStaticRoleBySlug(roleSlug);
    
    if (!role) {
      return NextResponse.json({
        success: false,
        sourcesUsed: [],
        data: {},
        errors: ['Role not found'],
      });
    }

    return NextResponse.json({
      success: true,
      sourcesUsed: ['static-data'],
      data: {
        keywords: role.keywords.map(k => k.keyword),
        salaryData: role.salaryBands,
      },
    });
  } catch (error) {
    console.error('Enrichment error:', error);
    return NextResponse.json(
      { error: 'Failed to enrich role data' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const role = searchParams.get('role');
    const region = searchParams.get('region');

    if (query) {
      const roles = getStaticRoles(undefined, undefined, query);
      const keywords = new Set<string>();
      roles.forEach(r => r.keywords.forEach(k => keywords.add(k.keyword)));
      return NextResponse.json({
        keywords: Array.from(keywords),
        sources: ['static-data'],
      });
    }

    if (role && region) {
      const roleData = getStaticRoleBySlug(role);
      const salaryBand = roleData?.salaryBands.find(s => s.region.includes(region));
      return NextResponse.json({
        salary: salaryBand || null,
        sources: salaryBand ? ['static-data'] : [],
      });
    }

    return NextResponse.json(
      { error: 'Provide either ?q=query for keywords or ?role=X&region=Y for salary' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Enrichment error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enrichment data' },
      { status: 500 }
    );
  }
}
