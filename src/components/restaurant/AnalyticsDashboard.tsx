import React from 'react';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';
import type { Restaurant, RestaurantAnalytics } from '@/types/restaurant';

interface AnalyticsDashboardProps {
  restaurant: Restaurant;
}

export default function AnalyticsDashboard({ restaurant }: AnalyticsDashboardProps) {
  // In a real app, you would fetch analytics from the Redux store
  const analytics: RestaurantAnalytics = {
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    popularItems: [],
    ordersByStatus: {},
  };

  const stats = [
    {
      name: 'Total Orders',
      value: analytics.totalOrders,
      icon: ShoppingBagIcon,
    },
    {
      name: 'Total Revenue',
      value: `$${analytics.totalRevenue.toFixed(2)}`,
      icon: CurrencyDollarIcon,
    },
    {
      name: 'Average Order',
      value: `$${analytics.averageOrderValue.toFixed(2)}`,
      icon: ChartBarIcon,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Analytics</h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6"
          >
            <dt className="text-sm font-medium text-gray-500 truncate flex items-center">
              <stat.icon className="h-5 w-5 mr-2" />
              {stat.name}
            </dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900">
              {stat.value}
            </dd>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Popular Items
          </h3>
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <ul className="divide-y divide-gray-200">
              {analytics.popularItems.map((item) => (
                <li key={item.menuItemId} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} orders
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ${item.revenue.toFixed(2)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Orders by Status
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(analytics.ordersByStatus).map(([status, count]) => (
              <div
                key={status}
                className="bg-white shadow overflow-hidden rounded-lg px-6 py-4"
              >
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">
                  {count}
                </dd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 