import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useDispatch } from 'react-redux';
import type { Restaurant, MenuItem } from '@/types/restaurant';

interface MenuManagerProps {
  restaurant: Restaurant;
}

export default function MenuManager({ restaurant }: MenuManagerProps) {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const dispatch = useDispatch();

  const handleAddItem = (item: Omit<MenuItem, 'id'>) => {
    // Here you would typically dispatch an action to add the item
    setIsAddingItem(false);
  };

  const handleEditItem = (item: MenuItem) => {
    // Here you would typically dispatch an action to update the item
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId: string) => {
    // Here you would typically dispatch an action to delete the item
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Menu Management</h2>
        <button
          onClick={() => setIsAddingItem(true)}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Item
        </button>
      </div>

     {/* <div className="space-y-4">
        {restaurant.menu.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div>
              <h3 className="font-medium text-gray-900">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.description}</p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                ${item.price.toFixed(2)}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setEditingItem(item)}
                className="p-2 text-gray-600 hover:text-green-600"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="p-2 text-gray-600 hover:text-red-600"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div> */}

      {/* Add/Edit Item Modal would go here */}
    </div>
  );
} 