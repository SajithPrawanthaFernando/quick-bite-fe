import React from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { UserIcon, BellIcon } from '@heroicons/react/24/outline';
import type { RootState } from '@/store/store';

export default function AdminHeader() {
  const user = useSelector((state: RootState) => state.cart.user);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/admin/dashboard" className="text-2xl font-bold text-indigo-600">
              Admin Dashboard
            </Link>

            <nav className="hidden md:flex space-x-4">
              <Link
                href="/admin/restaurants"
                className="text-gray-600 hover:text-indigo-600"
              >
                Restaurants
              </Link>
              <Link
                href="/admin/users"
                className="text-gray-600 hover:text-indigo-600"
              >
                Users
              </Link>
              <Link
                href="/admin/reports"
                className="text-gray-600 hover:text-indigo-600"
              >
                Reports
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-indigo-600">
              <BellIcon className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-2">
              <UserIcon className="h-6 w-6 text-gray-600" />
              <span className="text-gray-700">{user?.name}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 