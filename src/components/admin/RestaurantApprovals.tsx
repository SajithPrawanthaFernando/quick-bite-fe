import React from 'react';
import { useDispatch } from 'react-redux';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { Restaurant } from '@/types/restaurant';

interface RestaurantRequest extends Omit<Restaurant, 'menu' | 'rating'> {
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export default function RestaurantApprovals() {
  const dispatch = useDispatch();
  // In a real app, you would fetch pending requests from the Redux store
  const pendingRequests: RestaurantRequest[] = [];

  const handleApprove = (restaurantId: string) => {
    // Here you would typically dispatch an action to approve the restaurant
  };

  const handleReject = (restaurantId: string) => {
    // Here you would typically dispatch an action to reject the restaurant
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Restaurant Approval Requests
      </h2>

      <div className="space-y-4">
        {pendingRequests.map((request) => (
          <div
            key={request.id}
            className="border rounded-lg p-4 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {request.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {request.address}
                </p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending Review
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Submitted {new Date(request.submittedAt).toLocaleDateString()}
              </p>
            </div>

            <div className="border-t pt-4">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Cuisine</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {request.cuisine.join(', ')}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Operating Hours
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {Object.entries(request.operatingHours)
                      .map(([day, hours]) => `${day}: ${hours.open}-${hours.close}`)
                      .join(', ')}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="border-t pt-4 flex justify-end space-x-4">
              <button
                onClick={() => handleReject(request.id)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                <XMarkIcon className="h-5 w-5 mr-2" />
                Reject
              </button>
              <button
                onClick={() => handleApprove(request.id)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                <CheckIcon className="h-5 w-5 mr-2" />
                Approve
              </button>
            </div>
          </div>
        ))}

        {pendingRequests.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No pending restaurant approval requests
          </div>
        )}
      </div>
    </div>
  );
} 