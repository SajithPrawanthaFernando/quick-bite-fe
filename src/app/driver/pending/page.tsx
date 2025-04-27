"use client";
import React, { useEffect, useState } from "react";
import { AppDispatch } from "@/hooks/reduxHooks";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { notFound } from "next/navigation";
import { FaTruckPickup } from "react-icons/fa";
import { getDeliveryOrders, changeOrderStatus } from "@/redux/actions/orderAction";
import { addDeliveryOrder } from "@/redux/actions/deliveryActions";
import { getAllUsers } from "@/redux/actions/usersActions";
import { fetchRestaurants } from "@/redux/actions/restaurantAction";
import { useToast } from "@/components/ToastProvider";

export default function PendingPage() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = AppDispatch();
  const { showToast } = useToast();

  const [storedUser, setStoredUser] = useState<any | null>(null);
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
    dispatch(getDeliveryOrders());
    dispatch(getAllUsers());
    dispatch(fetchRestaurants());
  }, [dispatch]);

  const orders = useSelector((state: RootState) => state.orders.orders);
  const users = useSelector((state: RootState) => state.user.users);
  const restaurants = useSelector(
    (state: RootState) => state.restaurants.restaurants
  );

  const ordersWithCustomerDetails = orders.map((order) => {
    const customer = users.find((user) => user._id === order.customerId);
    const restaurant = restaurants.find(
      (restaurant) => restaurant._id === order.restuarantId
    );

    const orderWithDetails = { ...order };

    if (customer) {
      orderWithDetails.customer = customer;
    }

    if (restaurant) {
      orderWithDetails.restaurant = restaurant;
    }

    return orderWithDetails;
  });

  const handleAcceptDelivery = async (order: any) => {
    setIsLoading(true);
    try {
      const deliveryOrderData = {
        orderId: order.orderId,
        customerId: order.customerId,
        customerName: order?.customer?.fullname,
        customerPhone: order?.customer?.phone,

        totalAmount: order?.totalAmount,

        driverId: storedUser?.id,
        driverName: storedUser?.fullname,
        driverPhone: storedUser?.phone,
        pickupLocation: order?.restaurant?.address,
        deliveryLocation: {
          houseNumber: order?.deliveryAddress?.houseNumber,
          lane1: order?.deliveryAddress?.lane1,
          city: order?.deliveryAddress?.city,
          district: order?.deliveryAddress?.district,
        },
        estimatedDeliveryTime: new Date(Date.now() + 30 * 60000),
      };

      console.log(order);
      

      await dispatch(addDeliveryOrder(deliveryOrderData));
      setSelectedOrder(order._id);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showToast(
        "Delivery Accepted",
        `Order #${order.orderId} is now assigned to you`,
        "success"
      );
      dispatch(changeOrderStatus(order._id,"confirmed"));
      dispatch(getDeliveryOrders());
    } catch (error) {
      showToast(
        "Failed To Accept",
        `Order #${order.orderId} couldn't be accepted`,
        "error" // ← This should be "error" not "success"
      );
    } finally {
      setIsLoading(false);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      dispatch(getDeliveryOrders());
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">
          Available Delivery Orders
        </h1>
        <p className="text-gray-600 mb-6">
          Select an order below to begin your delivery
        </p>

        {ordersWithCustomerDetails?.length === 0 ? (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ordersWithCustomerDetails?.map((order) => (
              <div
                key={order._id}
                className="border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
              >
                <div className="mb-4">
                  <div className="flex flex-col mb-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        Order #{order?.orderId}
                      </span>
                      <span className="text-sm font-medium text-gray-600">
                        ${order?.totalAmount?.toFixed(2)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Customer
                      </h3>
                      <p className="text-gray-900 font-medium">
                        {order.customer?.fullname}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Pickup Location
                        </h3>
                        <p className="text-gray-900 text-sm">
                          {order.restaurant?.address
                            ? `${order.restaurant.address}, `
                            : "Location not specified"}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {order.pickupAddress?.district || ""}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Delivery Location
                        </h3>
                        <p className="text-gray-900 text-sm">
                          {order.deliveryAddress
                            ? `${order.deliveryAddress.houseNumber}, ${order.deliveryAddress.lane1}`
                            : "Location not specified"}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {order.deliveryAddress?.district || ""}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Contact
                      </h3>
                      <p className="text-gray-900 text-sm">
                        {order?.customer?.phone || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleAcceptDelivery(order)}
                  className="mt-auto w-full bg-gray-800 hover:bg-orange-400 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  {isLoading && selectedOrder === order._id ? (
                    <span className="flex items-center">
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
                      Processing...
                    </span>
                  ) : selectedOrder === order._id ? (
                    "Delivery Accepted"
                  ) : (
                    <>
                      <FaTruckPickup className="mr-2" />
                      Accept Delivery
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
