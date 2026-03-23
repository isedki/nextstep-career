import { NextRequest, NextResponse } from 'next/server';
import { enrichmentManager } from '@/lib/enrichment';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roleSlug, jsearchApiKey } = body;

    if (!roleSlug) {
      return NextResponse.json(
        { error: 'roleSlug is required' },
        { status: 400 }
      );
    }

    if (jsearchApiKey) {
      enrichmentManager.setJSearchApiKey(jsearchApiKey);
    }

    const result = await enrichmentManager.enrichRole(roleSlug);

    return NextResponse.json(result);
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
      const result = await enrichmentManager.fetchKeywords(query);
      return NextResponse.json(result);
    }

    if (role && region) {
      const result = await enrichmentManager.fetchSalaryData(role, region);
      return NextResponse.json(result);
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
