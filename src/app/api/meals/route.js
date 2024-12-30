import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch all available meals
    const meals = await prisma.meal.findMany({
      where: {
        isAvailable: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(meals, { status: 200 });
  } catch (error) {
    console.error('Meals fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch meals' }, { status: 500 });
  }
}
