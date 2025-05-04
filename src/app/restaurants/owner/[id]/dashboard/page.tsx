'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { restaurantService } from '@/redux/services/restaurant.service';
import { availabilityService } from '@/redux/services/availability.service';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
export default function RestaurantOwnerDashboard() {
  const params = useParams();
  const ownerId = params.id as string;

  const [restaurant, setRestaurant] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('week');
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [availability, setAvailability] = useState<any>(null);
  const [specialDays, setSpecialDays] = useState<any[]>([]);
  const [showAddSpecialDayModal, setShowAddSpecialDayModal] = useState(false);
  const [specialDayForm, setSpecialDayForm] = useState({
    date: '',
    isClosed: false,
    openingTime: '',
    closingTime: '',
    reason: ''
  });

  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [menuForm, setMenuForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    isAvailable: true,
  });

  useEffect(() => {
    fetchRestaurantData();
  }, [ownerId, selectedPeriod]);

  const fetchRestaurantData = async () => {
    try {
      setLoading(true);
      const [restaurantData, menuData] = await Promise.all([
        restaurantService.getRestaurantByOwner(ownerId),
        restaurantService.getOwnerMenu(ownerId),
        
      ]);
      console.log("res", restaurantData);
      
      setRestaurant(restaurantData);
      setMenuItems(menuData);
     
      
    } catch (err) {
      setError('Failed to fetch restaurant data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAddMenuItem = async () => {
    try {
      const newItem = {
        ...menuForm,
        price: parseFloat(menuForm.price),
        restaurant: restaurant._id
      };

      console.log(newItem);
      
      await restaurantService.createMenuItem(newItem);
      alert('Menu item added successfully!');
      setShowAddMenuModal(false);
      setMenuForm({
        name: '',
        description: '',
        price: '',
        image: '',
        category: '',
        isAvailable: true,
      });
    } catch (err) {
      console.error('Failed to add menu item', err);
      alert('Failed to add menu item');
    }
  };

  const handleUpdateMenuItem = async (itemId: string, update: any) => {
    try {
      await restaurantService.updateMenuItem(itemId, update);
      fetchRestaurantData();
    } catch (err) {
      console.error('Failed to update menu item', err);
      alert('Failed to update menu item');
    }
  };

  const handleDeleteMenuItem = async (itemId: string) => {
    try {
      await restaurantService.deleteMenuItem(itemId);
      fetchRestaurantData();
    } catch (err) {
      console.error('Failed to delete menu item', err);
      alert('Failed to delete menu item');
    }
  };

  const handleUpdateAvailability = async (isTemporarilyClosed: boolean, endDate?: string) => {
    try {
      await availabilityService.updateRestaurantAvailability(restaurant._id, {
        isTemporarilyClosed,
        temporaryClosureEndDate: endDate
      });
      fetchRestaurantData();
    } catch (err) {
      console.error('Failed to update availability', err);
      alert('Failed to update availability');
    }
  };



  const handleRemoveSpecialDay = async (date: string) => {
    try {
      await availabilityService.removeSpecialDay(restaurant._id, date);
      fetchRestaurantData();
    } catch (err) {
      console.error('Failed to remove special day', err);
      alert('Failed to remove special day');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-500">{error || 'Restaurant not found'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 pt-[80px]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{restaurant.name}</h1>
            <p className="text-gray-600">{restaurant.address}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedPeriod('today')}
              className={`px-4 py-2 rounded-lg ${
                selectedPeriod === 'today' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setSelectedPeriod('week')}
              className={`px-4 py-2 rounded-lg ${
                selectedPeriod === 'week' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setSelectedPeriod('month')}
              className={`px-4 py-2 rounded-lg ${
                selectedPeriod === 'month' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setShowAddMenuModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              + Add Menu Item
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Earnings</h3>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(orders.reduce((sum, order) => sum + order.total, 0))}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Average Order Value</h3>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(
                orders.length > 0
                  ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length
                  : 0
              )}
            </p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow mb-4 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Orders</h2>
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No orders found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order._id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer?.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(order.total)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Menu Items Section */}
        <div className="bg-white  overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Menu Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((item) => (
                <div key={item._id} className="p-4">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded mb-2" />
                  )}
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="font-bold">{formatCurrency(item.price)}</p>
                  <div className="flex justify-between mt-2">
                    <button
                      onClick={() => handleUpdateMenuItem(item._id, { isAvailable: !item.isAvailable })}
                      className={`px-2 py-1 rounded text-sm ${
                        item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </button>
                    <button
                      onClick={() => handleDeleteMenuItem(item._id)}
                      className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Availability Settings */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Availability Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={restaurant.isTemporarilyClosed}
                  onChange={(e) => handleUpdateAvailability(e.target.checked)}
                  className="h-4 w-4"
                />
                <label>Temporarily Closed</label>
              </div>
              {restaurant.isTemporarilyClosed && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reopening Date</label>
                  <input
                    type="datetime-local"
                    value={restaurant.temporaryClosureEndDate || ''}
                    onChange={(e) => handleUpdateAvailability(true, e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
              )}

              {/* Special Days Section */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Special Days</h3>
                  <button
                    onClick={() => setShowAddSpecialDayModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Add Special Day
                  </button>
                </div>
                
                {specialDays.length > 0 ? (
                  <div className="space-y-2">
                    {specialDays.map((day) => (
                      <div key={day.date} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{new Date(day.date).toLocaleDateString()}</p>
                          {day.isClosed ? (
                            <p className="text-red-600">Closed: {day.reason}</p>
                          ) : (
                            <p className="text-green-600">
                              Open: {day.openingTime} - {day.closingTime}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveSpecialDay(day.date)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No special days configured</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Menu Item Modal */}
      {showAddMenuModal && (
  <Dialog.Root open={showAddMenuModal} onOpenChange={(open) => setShowAddMenuModal(open)}>
    <Dialog.Trigger asChild>
      {/* Hidden button or a trigger */}
      <button className="hidden">Add Menu</button>
    </Dialog.Trigger>

    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
      <Dialog.Content
        className="fixed top-1/2 left-1/2 z-100 w-[90%] max-w-md transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl modal-animation"
      >
        <Dialog.Title className="text-xl font-semibold text-black mb-4">
          Add Menu Item
        </Dialog.Title>

        <form className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Name"
              className="mt-1 border border-gray-300 rounded-md text-black px-3 py-2 focus:outline-none focus:ring focus:ring-[#FDB940]"
              value={menuForm.name}
              onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Description"
              className="mt-1 border border-gray-300 rounded-md text-black px-3 py-2 focus:outline-none focus:ring focus:ring-[#FDB940]"
              value={menuForm.description}
              onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="price" className="text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              id="price"
              type="number"
              placeholder="Price"
              className="mt-1 border border-gray-300 rounded-md text-black px-3 py-2 focus:outline-none focus:ring focus:ring-[#FDB940]"
              value={menuForm.price}
              onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="image" className="text-sm font-medium text-gray-700">
              Image URL
            </label>
            <input
              id="image"
              type="text"
              placeholder="Image URL"
              className="mt-1 border border-gray-300 rounded-md text-black px-3 py-2 focus:outline-none focus:ring focus:ring-[#FDB940]"
              value={menuForm.image}
              onChange={(e) => setMenuForm({ ...menuForm, image: e.target.value })}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="category" className="text-sm font-medium text-gray-700">
              Category
            </label>
            <input
              id="category"
              type="text"
              placeholder="Category"
              className="mt-1 border border-gray-300 rounded-md text-black px-3 py-2 focus:outline-none focus:ring focus:ring-[#FDB940]"
              value={menuForm.category}
              onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="isAvailable"
              type="checkbox"
              checked={menuForm.isAvailable}
              onChange={(e) => setMenuForm({ ...menuForm, isAvailable: e.target.checked })}
            />
            <label htmlFor="isAvailable" className="text-sm text-gray-700">
              Available
            </label>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
              onClick={() => setShowAddMenuModal(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="bg-[#FDB940] text-white px-4 py-2 rounded"
              onClick={handleAddMenuItem}
            >
              Add
            </button>
          </div>
        </form>

        <Dialog.Close asChild>
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-black"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
)}

      {/* Add Special Day Modal */}
      {showAddSpecialDayModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Add Special Day</h2>
            <div className="flex flex-col gap-3">
              <input
                type="date"
                value={specialDayForm.date}
                onChange={(e) => setSpecialDayForm({ ...specialDayForm, date: e.target.value })}
                className="border p-2 rounded"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={specialDayForm.isClosed}
                  onChange={(e) => setSpecialDayForm({ ...specialDayForm, isClosed: e.target.checked })}
                />
                Closed
              </label>
              {!specialDayForm.isClosed && (
                <>
                  <input
                    type="time"
                    value={specialDayForm.openingTime}
                    onChange={(e) => setSpecialDayForm({ ...specialDayForm, openingTime: e.target.value })}
                    className="border p-2 rounded"
                    placeholder="Opening Time"
                  />
                  <input
                    type="time"
                    value={specialDayForm.closingTime}
                    onChange={(e) => setSpecialDayForm({ ...specialDayForm, closingTime: e.target.value })}
                    className="border p-2 rounded"
                    placeholder="Closing Time"
                  />
                </>
              )}
              <input
                type="text"
                value={specialDayForm.reason}
                onChange={(e) => setSpecialDayForm({ ...specialDayForm, reason: e.target.value })}
                className="border p-2 rounded"
                placeholder="Reason (optional)"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                  onClick={() => setShowAddSpecialDayModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                  
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
