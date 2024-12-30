"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import OrderSuccessModal from '../../components/OrderSuccessModal';
import Image from 'next/image';

export default function MenuPage() {
  const [meals, setMeals] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [isOrderSuccessModalOpen, setIsOrderSuccessModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('All');
  const { data: session } = useSession();
  const router = useRouter();

  // Fetch meals from the database
  useEffect(() => {
    async function fetchMeals() {
      try {
        const response = await fetch('/api/meals');
        if (!response.ok) {
          throw new Error('Failed to fetch meals');
        }
        const data = await response.json();
        setMeals(data);
      } catch (error) {
        console.error('Error fetching meals:', error);
        // Fallback to dummy data if fetch fails
        setMeals([
          { id: '660a1b9b0000000000000001', name: 'Classic Burger', price: 10, image: '/burger.jpg', description: 'Juicy beef patty with fresh toppings', category: 'Burgers' },
          { id: '660a1b9b0000000000000002', name: 'Margherita Pizza', price: 12, image: '/pizza.jpg', description: 'Traditional pizza with fresh mozzarella', category: 'Pizza' },
          { id: '660a1b9b0000000000000003', name: 'Caesar Salad', price: 8, image: '/salad.jpg', description: 'Crisp romaine with parmesan and croutons', category: 'Salads' },
          { id: '660a1b9b0000000000000004', name: 'Chicken Wrap', price: 9, image: '/wrap.jpg', description: 'Grilled chicken with fresh vegetables', category: 'Wraps' },
          { id: '660a1b9b0000000000000005', name: 'Vegetarian Pasta', price: 11, image: '/pasta.jpg', description: 'Creamy pasta with seasonal vegetables', category: 'Pasta' },
          { id: '660a1b9b0000000000000006', name: 'Seafood Platter', price: 15, image: '/seafood.jpg', description: 'Assorted fresh seafood selection', category: 'Seafood' },
        ]);
      }
    }
    fetchMeals();
  }, []);

  // Get unique categories
  const categories = ['All', ...new Set(meals.map(meal => meal.category))];

  const toggleMealSelection = (mealId) => {
    setSelectedMeals(prev => 
      prev.includes(mealId) 
        ? prev.filter(id => id !== mealId)
        : [...prev, mealId]
    );
  };

  const calculateTotalPrice = () => {
    return meals
      .filter(meal => selectedMeals.includes(meal.id))
      .reduce((total, meal) => total + meal.price, 0);
  };

  const handlePlaceOrder = async () => {
    if (!session) {
      router.push('/auth/login');
      return;
    }

    if (selectedMeals.length === 0) {
      alert('Please select at least one meal');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mealIds: selectedMeals }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsOrderSuccessModalOpen(true);
        setSelectedMeals([]); // Clear selected meals
      } else {
        // Handle specific error messages from the server
        const errorMessage = data.error || 'Failed to place order. Please try again.';
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Order placement error:', error);
      alert('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter meals based on selected category
  const filteredMeals = filter === 'All' 
    ? meals 
    : meals.filter(meal => meal.category === filter);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Our Menu</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our delicious selection of meals, crafted with the finest ingredients 
          and prepared with passion.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center mb-8 space-x-2 flex-wrap">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
              ${filter === category 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
              m-1
            `}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMeals.map((meal) => (
          <div 
            key={meal.id} 
            className={`
              border rounded-lg p-4 transition-all duration-300 transform hover:-translate-y-2
              ${selectedMeals.includes(meal.id) 
                ? 'bg-green-50 border-green-500 shadow-lg' 
                : 'bg-white border-gray-200 hover:shadow-md'}
              cursor-pointer group
            `}
            onClick={() => toggleMealSelection(meal.id)}
          >
            {/* Meal Image */}
            <div className="relative w-full h-48 mb-4 overflow-hidden rounded-md">
              <Image 
                src={meal.image || meal.imageUrl || '/placeholder.jpg'} 
                alt={meal.name} 
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 group-hover:scale-110"
              />
              {selectedMeals.includes(meal.id) && (
                <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                  ✓
                </div>
              )}
            </div>

            {/* Meal Details */}
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold text-gray-800">{meal.name}</h2>
                  <span className="text-green-600 font-bold text-lg">${meal.price.toFixed(2)}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{meal.description}</p>
                <div className="text-xs bg-gray-100 px-2 py-1 rounded-full inline-block">
                  {meal.category}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredMeals.length === 0 && (
        <div className="text-center py-12">
          <Image 
            src="/empty-menu.svg" 
            alt="No meals found" 
            width={300} 
            height={300} 
            className="mx-auto mb-6"
          />
          <p className="text-xl text-gray-600">
            No meals found in this category.
          </p>
        </div>
      )}

      {/* Order Summary */}
      {selectedMeals.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl p-4 z-50">
          <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <span className="text-xl font-bold">
                Total: ${calculateTotalPrice().toFixed(2)}
              </span>
              <span className="text-sm text-gray-600">
                {selectedMeals.length} item{selectedMeals.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={isLoading || selectedMeals.length === 0}
              className={`
                px-6 py-3 rounded-lg text-white font-bold transition-all duration-300
                ${selectedMeals.length === 0 || isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 transform hover:scale-105'}
              `}
            >
              {isLoading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      )}

      <OrderSuccessModal 
        isOpen={isOrderSuccessModalOpen}
        onClose={() => setIsOrderSuccessModalOpen(false)}
      />
    </div>
  );
}
