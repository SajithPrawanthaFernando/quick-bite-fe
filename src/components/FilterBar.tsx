'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { setRestaurants } from '@/store/slices/restaurantSlice';
import { restaurantApi } from '@/redux/services/api';

const cuisineTypes = [
  'All',
  'Pizza',
  'Burger',
  'Indian',
  'Chinese',
  'Japanese',
  'Italian',
  'Mexican',
];

const sortOptions = [
  { label: 'Most Popular', value: 'popular' },
  { label: 'Rating: High to Low', value: 'rating' },
];

export default function FilterBar() {
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedSort, setSelectedSort] = useState('popular');
  const dispatch = useDispatch();

  useEffect(() => {
    fetchRestaurants();
  }, [selectedCuisine, selectedSort]);

  const fetchRestaurants = async () => {
    try {
      const response = await restaurantApi.getAll();
      let restaurants = response.data;

      // Apply filters
      if (selectedCuisine !== 'All') {
        restaurants = restaurants.filter((restaurant: any) =>
          restaurant.cuisine.includes(selectedCuisine)
        );
      }

      // Apply sorting
      if (selectedSort === 'rating') {
        restaurants.sort((a: any, b: any) => b.rating - a.rating);
      }

      dispatch(setRestaurants(restaurants));
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const handleCuisineChange = (cuisine: string) => {
    setSelectedCuisine(cuisine);
  };

  const handleSortChange = (value: string) => {
    setSelectedSort(value);
  };

  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="flex items-center space-x-2">
        <FunnelIcon className="h-5 w-5 text-gray-500" />
        <select
          value={selectedCuisine}
          onChange={(e) => handleCuisineChange(e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          {cuisineTypes.map((cuisine) => (
            <option key={cuisine} value={cuisine}>
              {cuisine}
            </option>
          ))}
        </select>
      </div>
      <select
        value={selectedSort}
        onChange={(e) => handleSortChange(e.target.value)}
        className="border rounded-md px-3 py-2"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
} 