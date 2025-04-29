'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { StarIcon } from '@heroicons/react/24/solid';
import type { Restaurant } from '@/types/restaurant';

type RestaurantCardProps = Pick<
  Restaurant,
  'id' | 'name' | 'image' | 'cuisine' | 'rating'
>;

export default function RestaurantCard({
  id,
  name,
  image,
  cuisine,
  rating,
}: RestaurantCardProps) {
  return (
    <Link href={`/restaurant/${id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <div className="flex items-center mt-2">
            <StarIcon className="h-5 w-5 text-yellow-400" />
            <span className="ml-1 text-gray-600">{rating}</span>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-600">{cuisine.join(', ')}</span>
          </div>
        </div>
      </div>
    </Link>
  );
} 