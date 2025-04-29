import React from 'react';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  BuildingStorefrontIcon,
} from '@heroicons/react/24/outline';

interface PlatformMetrics {
  totalUsers: number;
  totalRestaurants: number;
  totalOrders: number;
  totalRevenue: number;
  activeUsers: number;
  ordersByStatus: {
    [key: string]: number;
  };
  revenueByDay: {
    date: string;
    amount: number;
  }[];
}

export default function PlatformStats() {
  // In a real app, you would fetch metrics from the Redux store
  const metrics: PlatformMetrics = {
    totalUsers: 0,
    totalRestaurants: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeUsers: 0,
    ordersByStatus: {},
    revenueByDay: [],
  };

  const stats = [
    {
      name: 'Total Users',
      value: metrics.totalUsers,
      icon: UserGroupIcon,
    },
    {
      name: 'Total Restaurants',
      value: metrics.totalRestaurants,
      icon: BuildingStorefrontIcon,
    },
    {
      name: 'Total Orders',
      value: metrics.totalOrders,
      icon: ChartBarIcon,
    },
    {
      name: 'Total Revenue',
      value: `$${metrics.totalRevenue.toFixed(2)}`,
      icon: CurrencyDollarIcon,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Platform Overview
      </h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-8">
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
            Orders by Status
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(metrics.ordersByStatus).map(([status, count]) => (
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

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Revenue Trend (Last 7 Days)
          </h3>
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="p-4">
              {metrics.revenueByDay.map((day) => (
                <div
                  key={day.date}
                  className="flex items-center justify-between py-2"
                >
                  <span className="text-sm text-gray-600">{day.date}</span>
                  <span className="text-sm font-medium text-gray-900">
                    ${day.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 