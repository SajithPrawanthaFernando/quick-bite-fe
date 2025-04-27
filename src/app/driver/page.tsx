"use client";

import React, { useEffect, useState } from "react";
import { AppDispatch } from "@/hooks/reduxHooks";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { notFound } from "next/navigation";
import { getOrders } from "@/redux/actions/deliveryActions";

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
interface User {
  id: string;
  fullname: string;
  role: string;
  // Add any other fields you have
}

const DeliveryRiderPage = () => {
  const dispatch = AppDispatch();

  const [storedUser, setStoredUser] = useState<User | null>(null);
  useEffect(() => {
    const userString = localStorage.getItem("user");

    if (userString) {
      try {
        const userObject: User = JSON.parse(userString);
        setStoredUser(userObject);
      } catch (error) {
        console.error("Error parsing user from localStorage", error);
      }
    }
  }, []);

  useEffect(() => {
    if (storedUser?.id) {
      dispatch(getOrders(storedUser.id));
    }
  }, [storedUser, dispatch]);

  const deliveries = useSelector((state: RootState) => state.delivery.orders);

  const [orders, setOrders] = useState<FoodOrder[]>([]);

  // Watch deliveries and update orders when deliveries change
  useEffect(() => {
    if (deliveries && deliveries.length > 0) {
      const del = deliveries[0];
      console.log(del);

      const mappedOrders: FoodOrder[] = del.map((delivery: any) => ({
        orderId: delivery.orderId,
        customerName: delivery.driverName,
        status: mapStatus(delivery.status),
        amount: "$0.00",
        icon: getIcon(delivery.status),

        actualDeliveryTime: delivery.actualDeliveryTime,
        createdAt: delivery.createdAt,
        customerId: delivery.customerId,
        deliveryLocation: {
          city: delivery.deliveryLocation?.city || "",
          district: delivery.deliveryLocation?.district || "",
          houseNumber: delivery.deliveryLocation?.houseNumber || "",
          lane1: delivery.deliveryLocation?.lane1 || "",
        },
        deliveryNotes: delivery.deliveryNotes,
        driverId: delivery.driverId,
        driverName: delivery.driverName,
        estimatedDeliveryTime: delivery.estimatedDeliveryTime,
        pickupLocation: {
          city: delivery.pickupLocation?.city || "",
          district: delivery.pickupLocation?.district || "",
          houseNumber: delivery.pickupLocation?.houseNumber || "",
          lane1: delivery.pickupLocation?.lane1 || "",
          lane2: delivery.pickupLocation?.lane2 || "",
        },
        updatedAt: delivery.updatedAt,
        _id: delivery._id,
      }));
      setOrders(mappedOrders);
    }
  }, [deliveries]);

  function mapStatus(
    status: string
  ): "delivering" | "in transit" | "pending" | "completed" {
    switch (status) {
      case "picked":
        return "delivering";
      case "on_the_way":
        return "in transit";
      case "pending":
        return "pending";
      case "delivered":
        return "completed";
      default:
        return "pending";
    }
  }

  function getIcon(status: string): string {
    switch (status) {
      case "picked":
        return "🚚";
      case "on_the_way":
        return "📦";
      case "pending":
        return "⏳";
      case "delivered":
        return "✅";
      default:
        return "❓";
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2 text-black">
        Welcome, {storedUser?.fullname}
      </h1>
      <p className="text-gray-500 mb-6">
        You have{" "}
        <span className="text-green-500 font-semibold">{orders.length}</span>{" "}
        active deliveries.
      </p>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((order) => (
          <div
            key={order.orderId}
            className={`rounded-lg shadow-md p-4 text-stone-700 bg-amber-50`}
          >
            {/* Header: Icon and Status */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">{order.icon}</span>
              <span className="text-sm bg-white text-black rounded px-2 capitalize">
                {order.status}
              </span>
            </div>

            {/* Customer Details */}
            <div className="font-semibold text-lg mb-2">
              {order.customerName}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-sm">
                <strong>Order ID:</strong><br /> {order.orderId}
              </div>
              <div className="text-sm">
                <strong>Customer ID:</strong><br /> {order.customerId}
              </div>

              {/* Pickup Location */}
              <div className="text-sm">
                <strong>Pickup Location:</strong><br />
                {order.pickupLocation.houseNumber}, {order.pickupLocation.lane1}
                , {order.pickupLocation.district}, {order.pickupLocation.city}
              </div>

              {/* Delivery Location */}
              <div className="text-sm">
                <strong>Delivery Location:</strong><br />
                {order.deliveryLocation.houseNumber},{" "}
                {order.deliveryLocation.lane1},{" "}
                {order.deliveryLocation.district}, {order.deliveryLocation.city}
              </div>
            </div>

            {/* Amount Section */}
            <div className="text-2xl font-bold mt-4">{order.amount}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryRiderPage;
