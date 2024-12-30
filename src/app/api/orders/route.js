import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { ObjectId } from 'mongodb';

const prisma = new PrismaClient();

const getSessionOrThrow = async () => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }
  return session;
};

const handleErrors = (error) => {
  // Safely log the error with fallback for null/undefined
  console.error('Order Placement Error:', error instanceof Error ? error.message : String(error));
  
  // Check for specific error types
  if (error instanceof Error) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Duplicate order detected' }, { status: 409 });
    }
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Please log in to place an order' }, { status: 401 });
    }
  }

  // Generic error response
  return NextResponse.json({ 
    error: error instanceof Error 
      ? error.message 
      : 'Failed to place order. Please try again.' 
  }, { status: 500 });
};

export async function POST(request) {
  try {
    const session = await getSessionOrThrow();

    // Parse the request body
    const { mealIds } = await request.json();

    // Validate meal IDs
    if (!mealIds || !Array.isArray(mealIds) || mealIds.length === 0) {
      return NextResponse.json({ error: 'Please select at least one meal' }, { status: 400 });
    }

    // Convert meal IDs to valid MongoDB ObjectIds
    const validMealIds = mealIds
      .map(id => {
        try {
          // Ensure the ID is a valid 24-character hex string
          return new ObjectId(id);
        } catch (error) {
          console.error(`Invalid meal ID: ${id}`, error);
          return null;
        }
      })
      .filter(id => id !== null);
    
    if (validMealIds.length === 0) {
      return NextResponse.json({ error: 'Invalid meal selection' }, { status: 400 });
    }

    // Fetch the selected meals and verify they exist
    const meals = await prisma.meal.findMany({
      where: { 
        id: { in: validMealIds.map(id => id.toString()) } 
      }
    });

    // Check if all selected meals were found
    if (meals.length !== validMealIds.length) {
      return NextResponse.json({ error: 'Some selected meals are no longer available' }, { status: 404 });
    }

    // Calculate total price
    const totalPrice = meals.reduce((sum, meal) => sum + meal.price, 0);

    // Create the order with OrderItems
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        totalPrice,
        status: 'PENDING',
        orderItems: {
          create: validMealIds.map(mealId => ({
            mealId: mealId.toString()
          }))
        }
      },
      include: {
        orderItems: {
          include: {
            meal: true
          }
        }
      }
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return handleErrors(error);
  }
}

export async function GET() {
  try {
    const session = await getSessionOrThrow();

    // Fetch user's past orders with their meals
    const orders = await prisma.order.findMany({
      where: { 
        userId: session.user.id 
      },
      include: {
        orderItems: {
          include: {
            meal: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform orders to match previous structure
    const transformedOrders = orders.map(order => ({
      ...order,
      meals: order.orderItems.map(item => item.meal)
    }));

    return NextResponse.json(transformedOrders, { status: 200 });
  } catch (error) {
    return handleErrors(error);
  }
}
