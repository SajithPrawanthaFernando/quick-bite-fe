'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Restaurant } from '@/types/restaurant';
import { adminService } from '@/redux/services/admin.service';


export default function AdminRestaurantsPage() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // For modal view
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRestaurant(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchRestaurants();
  }, [statusFilter]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      switch (statusFilter) {
        case 'pending':
          response = await adminService.getPendingRestaurants();
          break;
        case 'approved':
          response = await adminService.getApprovedRestaurants();
          break;
        case 'rejected':
          response = await adminService.getRejectedRestaurants();
          break;
        default:
          response = await adminService.getAllRestaurants();
      }

      console.log('Restaurants response:', response);

      if (Array.isArray(response) && response.length > 0) {
        setRestaurants(response);
      } else {
        setError('No restaurants found');
        setRestaurants([]);
      }
    } catch (err) {
      console.error('Error fetching restaurants:', err);
      setError('Failed to fetch restaurants. Please try again later.');
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (restaurantId: string, newStatus: 'approved' | 'rejected') => {
    try {
      setLoading(true);
      setError(null);

      const isApproved = newStatus === 'approved';

      // Optimistic UI update
      setRestaurants(prevRestaurants =>
        prevRestaurants.map(restaurant => {
          if (restaurant._id === restaurantId) {
            return {
              ...restaurant,
              isApproved: true,
              isActive: true,
              status: newStatus
            };
          }
          return restaurant;
        })
      );

      await adminService.verifyRestaurant(restaurantId, {
        approved: isApproved,
        notes: isApproved ? 'Approved by admin' : 'Rejected due to policy violation'
      });

      setError(`Restaurant ${newStatus === 'approved' ? 'approved' : 'rejected'} successfully`);
    } catch (err) {
      console.error('Error updating restaurant status:', err);
      setError('Failed to update restaurant status');
      await fetchRestaurants(); // Revert on error
    } finally {
      setLoading(false);
    }
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'pending') return !restaurant.isApproved && restaurant.isActive;
    if (statusFilter === 'approved') return restaurant.isApproved && restaurant.isActive;
    if (statusFilter === 'rejected') return !restaurant.isActive;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading restaurants...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Restaurant Management</h1>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg ${statusFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-4 py-2 rounded-lg ${statusFilter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-white text-gray-700'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={`px-4 py-2 rounded-lg ${statusFilter === 'approved' ? 'bg-green-500 text-white' : 'bg-white text-gray-700'}`}
            >
              Approved
            </button>
            <button
              onClick={() => setStatusFilter('rejected')}
              className={`px-4 py-2 rounded-lg ${statusFilter === 'rejected' ? 'bg-red-500 text-white' : 'bg-white text-gray-700'}`}
            >
              Rejected
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <div key={restaurant._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  {restaurant.logo && (
                    <div className="mb-4">
                      <img 
                        src={restaurant.logo} 
                        alt={restaurant.name} 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{restaurant.name}</h2>
                  <p className="text-gray-600 mb-2">{restaurant.address}</p>
                  <p className="text-gray-500 mb-2">{restaurant.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">{restaurant.cuisineType}</span>
                    
                  </div>

                  <div className="flex gap-2 mb-2">
                    <button
                      onClick={() => openModal(restaurant)}
                      className="flex-1 px-4 py-2 border border-black hover:border-[#FDB940] hover:bg-[#FDB940] bg-black text-white rounded-lg"
                    >
                      View
                    </button>
                  </div>

                  <div className="flex gap-2">
                    {statusFilter === 'pending' && !restaurant.isApproved && (
                      <>
                        <button
                          onClick={() => handleStatusChange(restaurant._id, 'approved')}
                          className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                          disabled={loading}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(restaurant._id, 'rejected')}
                          className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                          disabled={loading}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {restaurant.isApproved && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        Approved
                      </span>
                    )}
                    {!restaurant.isActive && (
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                        Rejected
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedRestaurant && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <h2 className="text-xl font-bold mb-2">{selectedRestaurant.name}</h2>
            {selectedRestaurant.logo && (
              <img src={selectedRestaurant.logo} alt={selectedRestaurant.name} className="w-full h-40 object-cover mb-4 rounded" />
            )}
            <p><strong>Address:</strong> {selectedRestaurant.address}</p>
            <p><strong>Description:</strong> {selectedRestaurant.description}</p>
            <p><strong>Type:</strong> {selectedRestaurant.cuisineType}</p>
            <p><strong>Rating:</strong> {selectedRestaurant.rating?.toFixed(1) ?? 'N/A'}</p>

            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
