import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const level = searchParams.get('level');
    const q = searchParams.get('q');

    const where: Record<string, unknown> = {};

    if (department) {
      where.department = department;
    }

    if (level) {
      where.level = level;
    }

    if (q) {
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { keywords: { some: { keyword: { contains: q } } } },
      ];
    }

    const roles = await prisma.jobRole.findMany({
      where,
      include: {
        keywords: {
          orderBy: { weight: 'desc' },
          take: 10,
        },
        salaryBands: {
          where: { region: 'US' },
          take: 1,
        },
      },
      orderBy: [
        { department: 'asc' },
        { level: 'asc' },
        { title: 'asc' },
      ],
    });

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
