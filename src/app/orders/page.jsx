"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchOrders() {
      if (!session) return;

      try {
        setIsLoading(true);
        const response = await fetch('/api/orders');
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, [session]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        <p>Error: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Image 
            src="/empty-orders.svg" 
            alt="No orders" 
            width={300} 
            height={300} 
            className="mx-auto mb-6"
          />
          <p className="text-xl text-gray-600">
            You haven't placed any orders yet.
          </p>
          <button 
            onClick={() => router.push('/menu')}
            className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Order #{order.id.slice(-6)}
                </h2>
                <span 
                  className={`
                    px-3 py-1 rounded-full text-sm font-bold
                    ${order.status === 'PENDING' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : order.status === 'CONFIRMED'
                      ? 'bg-blue-100 text-blue-800'
                      : order.status === 'PREPARING'
                      ? 'bg-orange-100 text-orange-800'
                      : order.status === 'DELIVERED'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'}
                  `}
                >
                  {order.status}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-gray-600 mb-2">
                  Total: ${order.totalPrice.toFixed(2)}
                </p>
                <p className="text-gray-600">
                  Date: {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex -space-x-2 mb-4">
                {order.meals.slice(0, 3).map((meal) => (
                  <div 
                    key={meal.id} 
                    className="w-12 h-12 rounded-full border-2 border-white"
                  >
                    <Image 
                      src={meal.image || meal.imageUrl || '/placeholder-meal.jpg'} 
                      alt={meal.name} 
                      width={48} 
                      height={48} 
                      className="rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder-meal.jpg';
                      }}
                    />
                  </div>
                ))}
                {order.meals.length > 3 && (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                    +{order.meals.length - 3}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {order.meals.map((meal) => (
                  <div 
                    key={meal.id} 
                    className="flex justify-between items-center text-sm"
                  >
                    <span>{meal.name}</span>
                    <span className="font-semibold">${meal.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t pt-4 flex justify-between items-center">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold">${order.totalPrice.toFixed(2)}</span>
              </div>

              <button 
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                onClick={() => {/* Optional: Add order details modal */}}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
