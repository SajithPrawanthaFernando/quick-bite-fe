"use client";

import React, { useEffect, useState } from "react";
import { AppDispatch } from "@/hooks/reduxHooks";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { notFound } from "next/navigation";
import {
  getOrders,
  changeOrderStatus,
  getDeliveredOrders,
} from "@/redux/actions/deliveryActions";
import { useToast } from "@/components/ToastProvider";
import { useSearch } from "@/components/SearchContext";

interface FoodOrder {
  orderId: string;
  customerName: string;
  status: "delivering" | "in transit" | "pending" | "completed" | "picked";
  amount: string;
  icon: string;
  actualDeliveryTime: string | null;
  createdAt: string;
  customerId: string;
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
  pickupLocation: {
    city: string;
    district: string;
    houseNumber: string;
    lane1: string;
    lane2?: string;
  };
  updatedAt: string;
  _id: string;
}

const DeliveryRiderPage = () => {
  const dispatch = AppDispatch();
  const { showToast } = useToast();
  const { searchTerm } = useSearch();

  const [storedUser, setStoredUser] = useState<any | null>(null);
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: "picked" | "in_transit" | "delivered" | null;
  }>({});

  useEffect(() => {
    const userString = localStorage.getItem("user");

    if (userString) {
      try {
        const userObject: any = JSON.parse(userString);
        setStoredUser(userObject);
      } catch (error) {
        console.error("Error parsing user from localStorage", error);
      }
    }
  }, []);

  useEffect(() => {
    if (storedUser?.id) {
      dispatch(getOrders(storedUser.id));
      dispatch(getDeliveredOrders(storedUser.id));
    }
  }, [storedUser, dispatch]);

  const deliveries = useSelector((state: RootState) =>
    Array.isArray(state.delivery.orders) ? state.delivery.orders : []
  );

  const filteredDeliveries = deliveries.filter((delivery) =>
    Object.values(delivery).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  type OrderStatus = "picked" | "in_transit" | "delivered";
  const handleStatusUpdate = async (id: string, status: OrderStatus) => {
    try {
      setLoadingStates((prev) => ({ ...prev, [id]: status }));
      await dispatch(changeOrderStatus(id, status));
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const statusMessages = {
        picked: `Order has been picked up`,
        in_transit: `Order is now in transit`,
        delivered: `Order has been delivered`,
      };

      showToast(
        status.replace("_", " ").toUpperCase(),
        statusMessages[status],
        "success"
      );
    } catch (error) {
      console.error("Status update failed:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: null }));
      dispatch(getOrders(storedUser.id));
    }
  };

  const Spinner = () => (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  return (
    <div className="p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">
          Ongoing Delivery Orders
        </h1>
        <p className="text-gray-600 mb-6">You are currently delivering...</p>

        {filteredDeliveries?.length === 0 ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  No orders available for delivery at this time. Please check
                  back later.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full space-y-4">
            {filteredDeliveries?.map((order) => (
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
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        order.status === "driver_assigned"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "picked"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "in_transit"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {order.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="text-xl font-bold text-orange-400">
                    ${order.totalAmount?.toFixed(2)}
                  </div>
                </div>

                {/* Main Content */}
                <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                  {/* Customer Details Section */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Customer Details
                    </h3>

                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">
                        Full Name
                      </p>
                      <p className="text-lg font-semibold text-indigo-700">
                        {order.customerName}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">
                        Phone Number
                      </p>
                      <p className="text-gray-600">{order.customerPhone}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">
                        Order Placed
                      </p>
                      <p className="text-gray-600">
                        {new Date(order.createdAt).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Pickup Location */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Pickup Information
                    </h3>

                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">
                        Address
                      </p>
                      <p className="text-gray-800 font-medium">
                        {order.pickupLocation}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">
                        Scheduled Time
                      </p>
                      <p className="text-gray-600">
                        {order.estimatedDeliveryTime
                          ? new Date(
                              order.estimatedDeliveryTime
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Not specified"}
                      </p>
                    </div>
                  </div>

                  {/* Delivery Location */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Delivery Information
                    </h3>

                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">
                        Address
                      </p>
                      <p className="text-gray-800 font-medium">
                        {order.deliveryLocation.houseNumber}{" "}
                        {order.deliveryLocation.lane1}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {order.deliveryLocation.city},{" "}
                        {order.deliveryLocation.district}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">
                        Delivery Notes
                      </p>
                      <p className="text-gray-600">
                        {order.deliveryNotes || "No special instructions"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status Actions */}
                <div className="w-full bg-gray-50 px-6 py-3 border-t flex flex-wrap gap-3 justify-between">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleStatusUpdate(order._id, "picked")}
                      disabled={
                        order.status === "picked" ||
                        order.status === "in_transit" ||
                        order.status === "delivered" ||
                        loadingStates[order._id] === "picked"
                      }
                      className={`px-4 py-2 text-sm font-medium rounded-md min-w-[100px] flex items-center justify-center ${
                        order.status === "picked" ||
                        order.status === "in_transit" ||
                        order.status === "delivered"
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      }`}
                    >
                      {loadingStates[order._id] === "picked" ? (
                        <>
                          <Spinner />
                          Processing...
                        </>
                      ) : (
                        "Picked"
                      )}
                    </button>
                    <button
                      onClick={() =>
                        handleStatusUpdate(order._id, "in_transit")
                      }
                      disabled={
                        order.status === "in_transit" ||
                        order.status === "delivered" ||
                        loadingStates[order._id] === "in_transit"
                      }
                      className={`px-4 py-2 text-sm font-medium rounded-md min-w-[100px] flex items-center justify-center ${
                        order.status === "in_transit" ||
                        order.status === "delivered"
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-purple-100 text-purple-800 hover:bg-purple-200"
                      }`}
                    >
                      {loadingStates[order._id] === "in_transit" ? (
                        <>
                          <Spinner />
                          Processing...
                        </>
                      ) : (
                        "In Transit"
                      )}
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(order._id, "delivered")}
                      disabled={
                        order.status === "delivered" ||
                        loadingStates[order._id] === "delivered"
                      }
                      className={`px-4 py-2 text-sm font-medium rounded-md min-w-[100px] flex items-center justify-center ${
                        order.status === "delivered"
                          ? "bg-green-600 text-white shadow-inner"
                          : "bg-green-100 text-green-800 hover:bg-green-200"
                      }`}
                    >
                      {loadingStates[order._id] === "delivered" ? (
                        <>
                          <Spinner />
                          Processing...
                        </>
                      ) : (
                        "Delivered"
                      )}
                    </button>
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

export default DeliveryRiderPage;