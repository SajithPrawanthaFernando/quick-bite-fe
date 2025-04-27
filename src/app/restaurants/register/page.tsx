'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { restaurantService } from '@/redux/services/restaurant.service';

interface RestaurantFormData {
  name: string;
  description: string;
  cuisineType: string;
  address: string;
  phone: string;
  logo:string;
}

export default function RestaurantRegistration() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<RestaurantFormData>({
    name: '',
    description: '',
    cuisineType: '',
    address: '',
    phone: '',
    logo:''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      // Format the data according to the CreateRestaurantDto
      const restaurantData = {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        phone: formData.phone,
        cuisineType: formData.cuisineType,
      };

      await restaurantService.createRestaurant(restaurantData);
      router.push('/restaurants/dashboard');
    } catch (error: any) {
      console.error('Error registering restaurant:', error);
      if (error.response?.status === 401) {
        setError('You are not authorized. Please log in again.');
        localStorage.removeItem('token');
        router.push('/login');
      } else {
        setError(error.message || 'Failed to register restaurant. Please try again.');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Register Your Restaurant
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Restaurant Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              required
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              name="address"
              id="address"
              required
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="cuisineType" className="block text-sm font-medium text-gray-700">
              Cuisine Type
            </label>
            <input
              type="text"
              name="cuisineType"
              id="cuisineType"
              required
              value={formData.cuisineType}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="cuisineType" className="block text-sm font-medium text-gray-700">
              Logo URL
            </label>
            <input
              type="text"
              name="logo"
              id="logo"
              required
              value={formData.logo}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Register Restaurant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
