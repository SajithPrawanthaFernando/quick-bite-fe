"use client";
import React, { useEffect, useState } from "react";
import { AppDispatch } from "@/hooks/reduxHooks";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { FaTruckPickup, FaHistory } from "react-icons/fa";
import { getDeliveryOrders, fetchOrders } from "@/redux/actions/orderAction";
import { useToast } from "@/components/ToastProvider";
import { fetchRestaurants } from "@/redux/actions/restaurantAction";
import { Tab } from "@headlessui/react";
import { getUserOrders } from "@/redux/actions/deliveryActions";

export default function OrdersPage() {
  const dispatch = AppDispatch();
  const { showToast } = useToast();
  const [storedUser, setStoredUser] = useState<any | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const userObject = JSON.parse(userString);
        setStoredUser(userObject);

        // initial fetch
        dispatch(getUserOrders("6803430128070e0251d7e0ea"));
        dispatch(fetchOrders());
        dispatch(getDeliveryOrders());
        dispatch(fetchRestaurants());

        // clear interval when component unmounts
      } catch (error) {
        console.error("Error parsing user from localStorage", error);
        showToast("Error loading user data", "error");
      }
    }
  }, [dispatch, showToast]);

  useEffect(() => {
    dispatch(fetchOrders());
  }, []);

  const orders = useSelector((state: RootState) => state.orders.orders);
  const userOrders = useSelector((state: RootState) => state.delivery.ongoing);
  const users = useSelector((state: RootState) => state.user.users);
  const restaurants = useSelector(
    (state: RootState) => state.restaurants.restaurants
  );

  console.log(orders);

  const ordersWithDetails = orders.map((order) => {
    const customer = users.find((user) => user._id === order.customerId);
    const restaurant = restaurants.find(
      (restaurant) => restaurant._id === order.restuarantId
    );
    return {
      ...order,
      customer,
      restaurant,
    };
  });

  // Filter orders based on status
  const pendingOrders = ordersWithDetails.filter(
    (order) => order.status === "pending"
  );

  const ongoingOrders = ordersWithDetails.filter(
    (order) =>
      order.status === "confirmed" ||
      order.status === "preparing" ||
      order.status === "out_for_delivery" ||
      order.status === "delivering"
  );

  const historyOrders = ordersWithDetails.filter(
    (order) => order.status === "delivered" || order.status === "cancelled"
  );

  const renderOrderCard = (order: any) => {
    return (
      <div
        key={order._id}
        className="border-2 border-gray-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 bg-white"
      >
        {/* Order header */}
        <div className="flex justify-between items-start mb-5">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              #{order.orderId}
            </h3>
          </div>
          <div
            className={`px-4 py-2 rounded-full ${getStatusBackground(
              order.status
            )}`}
          >
            <span
              className={`text-sm font-bold ${getStatusTextColor(
                order.status
              )}`}
            >
              {formatStatusText(order.status)}
            </span>
          </div>
        </div>

        {/* Order summary */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-blue-800 mb-1">
                Order Time
              </p>
              <p className="font-semibold text-gray-900">
                {new Date(order.createdAt).toLocaleTimeString("en-LK", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800 mb-1">
                Order Date
              </p>
              <p className="font-semibold text-gray-900">
                {new Date(order.createdAt).toLocaleDateString("en-LK")}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800 mb-1">
                Total Amount
              </p>
              <p className="font-bold text-gray-900">
                LKR {order.totalAmount?.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800 mb-1">
                Delivery Fee
              </p>
              <p className="font-semibold text-gray-900">
                LKR {order.deliveryFee?.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Restaurant and delivery info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-orange-100 p-2 rounded-full">
                <svg
                  className="w-5 h-5 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900">Restaurant</h4>
            </div>
            <p className="text-gray-700 mb-2">
              {order.restaurant?.name || "Pizza Hut"}
            </p>
            <p className="text-sm text-gray-500">
              {order.restaurant?.address || "Address not available"}
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-100 p-2 rounded-full">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900">Delivery To</h4>
            </div>
            <p className="text-gray-700 mb-2">
              {order.deliveryAddress?.houseNumber || ""}{" "}
              {order.deliveryAddress?.lane1 || "Address not specified"}
            </p>
            <p className="text-sm text-gray-500">
              {[order.deliveryAddress?.lane2, order.deliveryAddress?.city]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
        </div>

        {/* Order items */}
        <div className="mb-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            Your Items
          </h4>
          <ul className="divide-y divide-gray-200">
            {order.items?.map((item: any) => (
              <li key={item._id} className="py-3 flex justify-between">
                <div className="flex items-center gap-3">
                  <span className="bg-gray-100 text-gray-800 font-medium px-2 py-1 rounded text-sm">
                    {item.quantity}x
                  </span>
                  <span className="font-medium text-gray-800">{item.name}</span>
                </div>
                <span className="font-bold text-gray-900">
                  LKR {(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const getStatusBackground = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100";
      case "confirmed":
      case "preparing":
        return "bg-blue-100";
      case "out_for_delivery":
      case "delivering":
        return "bg-purple-100";
      case "delivered":
        return "bg-green-100";
      case "cancelled":
        return "bg-red-100";
      default:
        return "bg-gray-100";
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-amber-800";
      case "confirmed":
      case "preparing":
        return "text-blue-800";
      case "out_for_delivery":
      case "delivering":
        return "text-purple-800";
      case "delivered":
        return "text-green-800";
      case "cancelled":
        return "text-red-800";
      default:
        return "text-gray-800";
    }
  };

  const formatStatusText = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="p-4 mx-auto mt-16 bg-white px-4 md:px-20">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">My Orders</h1>

      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <Tab.List className="flex space-x-1 rounded-lg bg-gray-100 p-1">
          <Tab
            className={({ selected }) =>
              `w-full py-2 text-sm font-medium rounded-md transition-colors ${
                selected
                  ? "bg-white shadow text-gray-800"
                  : "text-gray-600 hover:bg-gray-200"
              }`
            }
          >
            <div className="flex items-center justify-center">
              <FaTruckPickup className="mr-2" />
              Pending ({pendingOrders.length})
            </div>
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full py-2 text-sm font-medium rounded-md transition-colors ${
                selected
                  ? "bg-white shadow text-gray-800"
                  : "text-gray-600 hover:bg-gray-200"
              }`
            }
          >
            <div className="flex items-center justify-center">
              <FaTruckPickup className="mr-2" />
              Ongoing ({userOrders.length})
            </div>
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full py-2 text-sm font-medium rounded-md transition-colors ${
                selected
                  ? "bg-white shadow text-gray-800"
                  : "text-gray-600 hover:bg-gray-200"
              }`
            }
          >
            <div className="flex items-center justify-center">
              <FaHistory className="mr-2" />
              History ({historyOrders.length})
            </div>
          </Tab>
        </Tab.List>

        <Tab.Panels className="mt-4">
          <Tab.Panel>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingOrders.length > 0 ? (
                pendingOrders.map((order) => renderOrderCard(order))
              ) : (
                <div className="col-span-3 py-12 text-center text-gray-500">
                  <p className="text-lg">No pending orders</p>
                  <p className="text-sm mt-2">
                    Orders waiting for restaurant confirmation will appear here
                  </p>
                </div>
              )}
            </div>
          </Tab.Panel>

          <Tab.Panel>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userOrders.length > 0 ? (
                userOrders.map((order) => renderOrderCard(order))
              ) : (
                <div className="col-span-3 py-12 text-center text-gray-500">
                  <p className="text-lg">No ongoing orders</p>
                  <p className="text-sm mt-2">
                    Your active orders will appear here
                  </p>
                </div>
              )}
            </div>
          </Tab.Panel>

          <Tab.Panel>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {historyOrders.length > 0 ? (
                historyOrders.map((order) => renderOrderCard(order))
              ) : (
                <div className="col-span-3 py-12 text-center text-gray-500">
                  <p className="text-lg">No order history yet</p>
                  <p className="text-sm mt-2">
                    Your completed orders will appear here
                  </p>
                </div>
              )}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
