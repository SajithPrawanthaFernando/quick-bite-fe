"use client";

import React, { useEffect, useState } from "react";
import { AppDispatch } from "@/hooks/reduxHooks";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getDeliveredOrders } from "@/redux/actions/deliveryActions";
import { useToast } from "@/components/ToastProvider";

interface FoodOrder {
  orderId: string;
  customerName: string;
  status: "delivering" | "in_transit" | "pending" | "completed" | "picked" | "delivered";
  totalAmount: number;
  actualDeliveryTime: string | null;
  createdAt: string;
  customerId: string;
  customerPhone: string;
  deliveryLocation: {
    city: string;
    district: string;
    houseNumber: string;
    lane1: string;
  };
  deliveryNotes: string;
  driverId: string;
  driverName: string;
  estimatedDeliveryTime: string;
  pickupLocation: string;
  updatedAt: string;
  _id: string;
}

const DeliveredOrdersPage = () => {
  const dispatch = AppDispatch();
  const { showToast } = useToast();
  const [storedUser, setStoredUser] = useState<any | null>(null);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const userObject = JSON.parse(userString);
        setStoredUser(userObject);
      } catch (error) {
        console.error("Error parsing user from localStorage", error);
      }
    }
  }, []);

  useEffect(() => {
    if (storedUser?.id) {
      dispatch(getDeliveredOrders(storedUser.id));
    }
  }, [storedUser, dispatch]);

  const deliveries = useSelector((state: RootState) => state.delivery.delivered);

  return (
    <div className="p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">
          Delivered Orders History
        </h1>
        <p className="text-gray-600 mb-6">Your completed deliveries</p>

        {deliveries?.length === 0 ? (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  No delivered orders found in your history yet.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full space-y-4">
            {deliveries?.map((order) => (
              <div
                key={order._id}
                className="w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm"
              >
                {/* Card Header */}
                <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center w-full">
                  <div className="flex items-center space-x-4">
                    <span className="font-semibold text-gray-900">
                      #{order.orderId}
                    </span>
                    <span className="px-3 py-1 text-xs rounded-full font-medium bg-green-100 text-green-800">
                      Delivered
                    </span>
                  </div>
                  <div className="text-xl font-bold text-green-600">
                    ${order.totalAmount?.toFixed(2)}
                  </div>
                </div>

                {/* Main Content */}
                <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                  {/* Customer Details */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Customer Details
                    </h3>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">Full Name</p>
                      <p className="text-lg font-semibold text-indigo-700">
                        {order.customerName}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">Phone</p>
                      <p className="text-gray-600">{order.customerPhone}</p>
                    </div>
                  </div>

                  {/* Delivery Information */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Delivery Details
                    </h3>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">Delivered On</p>
                      <p className="text-gray-600">
                        {new Date(order.updatedAt).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">Location</p>
                      <p className="text-gray-800">
                        {order.deliveryLocation.houseNumber} {order.deliveryLocation.lane1}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {order.deliveryLocation.city}, {order.deliveryLocation.district}
                      </p>
                    </div>
                  </div>

                  {/* Order Information */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Order Summary
                    </h3>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">Placed On</p>
                      <p className="text-gray-600">
                        {new Date(order.createdAt).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">Notes</p>
                      <p className="text-gray-600">
                        {order.deliveryNotes || "No special instructions"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveredOrdersPage;