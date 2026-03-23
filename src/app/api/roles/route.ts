import { NextRequest, NextResponse } from 'next/server';
import { getStaticRoles } from '@/lib/db/static-roles';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department') || undefined;
    const level = searchParams.get('level') || undefined;
    const q = searchParams.get('q') || undefined;

    const roles = getStaticRoles(department, level, q);

    const formattedRoles = roles.map((role) => ({
      id: role.id,
      title: role.title,
      slug: role.slug,
      department: role.department,
      level: role.level,
      description: role.description,
      topKeywords: role.keywords.slice(0, 5).map((k) => k.keyword),
      salaryRange: role.salaryBands[0]
        ? {
            min: role.salaryBands[0].minSalary,
            max: role.salaryBands[0].maxSalary,
            currency: role.salaryBands[0].currency,
          }
        : null,
    }));

    return NextResponse.json({
      roles: formattedRoles,
      total: formattedRoles.length,
    });
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch roles' },
      { status: 500 }
    );
  }
}
