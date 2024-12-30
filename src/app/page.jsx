"use client";

import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Hero Text */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
              Delicious Meals, 
              <br />
              Delivered to Your Doorstep
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Enjoy restaurant-quality meals from the comfort of your home. 
              Fresh, tasty, and just a click away.
            </p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                href="/menu" 
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors text-center"
              >
                Order Now
              </Link>
              <Link 
                href="/about" 
                className="border border-blue-500 text-blue-500 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors text-center"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="hidden md:flex justify-center">
            <Image 
              src="/hero-image.png" 
              alt="Delicious Meal" 
              width={500} 
              height={500} 
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>

        {/* Features Section */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: "🍲", 
                title: "Fresh Ingredients", 
                description: "We use only the freshest, highest-quality ingredients." 
              },
              { 
                icon: "🚚", 
                title: "Fast Delivery", 
                description: "Quick and reliable delivery right to your doorstep." 
              },
              { 
                icon: "💯", 
                title: "Quality Guaranteed", 
                description: "Satisfaction guaranteed or your money back." 
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
