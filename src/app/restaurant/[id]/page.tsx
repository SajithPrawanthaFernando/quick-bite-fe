'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { StarIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/solid';
import type { RootState } from '@/store/store';
import { customerService } from '@/redux/services/customer.service';
import { MenuItem } from '@/redux/services/menu.service';
import { imageService } from '@/redux/services/image.service';

interface RestaurantPageProps {
  params: {
    id: string;
  };
}

export default function RestaurantPage({ params }: RestaurantPageProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  const restaurant = useSelector((state: RootState) =>
    state.restaurant.restaurants.find((r) => r.id === params.id)
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch menu items
        const menuResponse = await customerService.getRestaurantMenu(params.id);
        if (Array.isArray(menuResponse)) {
          setMenuItems(menuResponse);
        } else {
          setError('Invalid menu data received');
        }

        // Generate restaurant image if needed
        if (restaurant && !restaurant.image) {
          try {
            const imageResponse = await imageService.generateImage({
              prompt: `A professional food photo of ${restaurant.cuisine.join(', ')} cuisine restaurant, ${restaurant.name}, ${restaurant.description}`,
              type: 'restaurant'
            });
            setGeneratedImage(imageResponse.url);
          } catch (imageError) {
            console.error('Error generating image:', imageError);
            // Fallback to default image
            setGeneratedImage(imageService.getDefaultRestaurantImage(restaurant.cuisine[0]));
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load menu. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (restaurant) {
      fetchData();
    }
  }, [params.id, restaurant]);

  if (!restaurant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600">Restaurant not found</p>
      </div>
    );
  }

  const restaurantImage = restaurant.image || generatedImage || imageService.getDefaultRestaurantImage(restaurant.cuisine[0]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 w-full">
        <Image
          src={restaurantImage}
          alt={restaurant.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Restaurant Info */}
      <div className="container mx-auto px-4">
        <div className="relative -mt-32 z-10">
          {/* Restaurant Card */}
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-8">
              <h1 className="text-4xl font-bold text-gray-900">{restaurant.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                <div className="flex items-center">
                  <StarIcon className="h-5 w-5 text-yellow-400" />
                  <span className="ml-1 font-medium">{restaurant.rating || '4.5'}</span>
                  <span className="ml-1 text-gray-500">(500+ ratings)</span>
                </div>
                <span className="text-gray-300">•</span>
                <span className="text-gray-600">{restaurant.cuisine.join(', ')}</span>
                <span className="text-gray-300">•</span>
                <div className="flex items-center text-gray-600">
                  <ClockIcon className="h-5 w-5 mr-1" />
                  <span>{restaurant.isOpen ? '25-35 min' : 'Closed'}</span>
                </div>
                {restaurant.address && (
                  <>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center text-gray-600">
                      <MapPinIcon className="h-5 w-5 mr-1" />
                      <span>{restaurant.address}</span>
                    </div>
                  </>
                )}
              </div>
              <p className="mt-4 text-gray-600 max-w-3xl">{restaurant.description}</p>
            </div>

            {/* Menu Section */}
            <div className="border-t bg-gray-50">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900">Menu</h2>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-gray-500">Loading menu...</p>
                  </div>
                ) : error ? (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600">{error}</p>
                  </div>
                ) : menuItems.length === 0 ? (
                  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-600">No menu items available</p>
                  </div>
                ) : (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {menuItems.map((item) => (
                      <div
                        key={item._id}
                        className="flex gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
                      >
                        <div className="flex-grow">
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{item.description}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="font-medium text-gray-900">${item.price.toFixed(2)}</span>
                            <button className="px-4 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors">
                              Add to order
                            </button>
                          </div>
                        </div>
                        <div className="relative flex-shrink-0 w-24 h-24">
                          <Image
                            src={item.image || imageService.getDefaultMenuItemImage(item.category || 'default')}
                            alt={item.name}
                            fill
                            className="object-cover rounded-lg"
                            sizes="96px"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 