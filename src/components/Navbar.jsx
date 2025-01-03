"use client";

import { useState } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-800">
              انطر ابلكلاش
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900 px-3 py-2">
                Home
              </Link>
              <Link href="/menu" className="text-gray-600 hover:text-gray-900 px-3 py-2">
                Menu
              </Link>
              <Link href="/orders" className="text-gray-600 hover:text-gray-900 px-3 py-2">
                Orders
              </Link>
              {!session ? (
                <>
                  <Link href="/auth/login" className="text-gray-600 hover:text-gray-900 px-3 py-2">
                    Login
                  </Link>
                  <Link href="/auth/signup" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                    Sign Up
                  </Link>
                </>
              ) : (
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="bg-gray-100 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-200"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="text-gray-600 hover:text-gray-900 block px-3 py-2">
              Home
            </Link>
            <Link href="/menu" className="text-gray-600 hover:text-gray-900 block px-3 py-2">
              Menu
            </Link>
            <Link href="/orders" className="text-gray-600 hover:text-gray-900 block px-3 py-2">
                Orders
              </Link>
            {!session ? (
              <>
                <Link href="/auth/login" className="text-gray-600 hover:text-gray-900 block px-3 py-2">
                  Login
                </Link>
                <Link href="/auth/signup" className="bg-blue-500 text-white block px-4 py-2 rounded-md hover:bg-blue-600 text-center">
                  Sign Up
                </Link>
              </>
            ) : (
              <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-red-500 text-white w-full px-4 py-2 rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}