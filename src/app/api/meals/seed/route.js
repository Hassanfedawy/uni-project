import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const initialMeals = [
  {
    name: 'Classic Cheeseburger',
    description: 'Juicy beef patty with melted cheese, lettuce, and tomato',
    price: 12.99,
    category: 'Burgers',
    imageUrl: '/images/cheeseburger.jpg',
  },
  {
    name: 'Margherita Pizza',
    description: 'Traditional pizza with fresh mozzarella, tomatoes, and basil',
    price: 14.50,
    category: 'Pizzas',
    imageUrl: '/images/margherita.jpg',
  },
  {
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce, croutons, parmesan, and Caesar dressing',
    price: 9.99,
    category: 'Salads',
    imageUrl: '/images/caesar-salad.jpg',
  },
  {
    name: 'Grilled Salmon',
    description: 'Fresh salmon fillet with herb butter and seasonal vegetables',
    price: 18.99,
    category: 'Seafood',
    imageUrl: '/images/salmon.jpg',
  },
  {
    name: 'Chicken Alfredo Pasta',
    description: 'Creamy alfredo sauce with grilled chicken over fettuccine',
    price: 15.50,
    category: 'Pasta',
    imageUrl: '/images/chicken-alfredo.jpg',
  }
];

export async function GET() {
  try {
    // Check if meals already exist
    const existingMeals = await prisma.meal.count();
    if (existingMeals > 0) {
      return NextResponse.json({ message: 'Meals already seeded' }, { status: 200 });
    }

    // Seed meals
    await prisma.meal.createMany({
      data: initialMeals
    });

    return NextResponse.json({ message: 'Meals seeded successfully' }, { status: 201 });
  } catch (error) {
    console.error('Meal seeding error:', error);
    return NextResponse.json({ error: 'Failed to seed meals' }, { status: 500 });
  }
}
