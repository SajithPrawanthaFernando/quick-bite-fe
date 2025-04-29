"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchOrders, updateOrderStatus } from "@/redux/actions/orderAction";

const statusOptions = ["preparing", "packing up", "out for delivery"];

export default function AdminOrdersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading, error } = useSelector(
    (state: RootState) => state.orders
  );

  const [selectedStatuses, setSelectedStatuses] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleStatusChange = (orderId: string, status: string) => {
    setSelectedStatuses((prev) => ({ ...prev, [orderId]: status }));
  };

  const handleUpdateStatus = async (orderId: string) => {
    const newStatus = selectedStatuses[orderId];
    if (!newStatus) {
      alert("Please select a status!");
      return;
    }

    await dispatch(updateOrderStatus(orderId, newStatus));
    alert("Order status updated!");
    dispatch(fetchOrders());
  };

  return (
    <div className="max-w-6xl mx-auto p-6 pt-24">
      <h1 className="text-3xl font-bold text-black mb-6 text-center">
        Manage Orders
      </h1>

      {loading ? (
        <p className="text-center">Loading orders...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-yellow-300/50 rounded-xl p-4"
            >
              <p className="font-bold mb-2">Order ID: {order._id}</p>
              <p>
                Status: <span className="capitalize">{order.status}</span>
              </p>
              <p>Items: {order.items.length} items</p>
              <p>
                Placed on:{" "}
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString()
                  : "N/A"}
              </p>

              <div className="mt-4 flex items-center gap-4">
                <select
                  value={selectedStatuses[order._id!] || order.status || ""}
                  onChange={(e) =>
                    handleStatusChange(order._id!, e.target.value)
                  }
                  className="border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="">Select Status</option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => handleUpdateStatus(order._id!)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded text-sm transition"
                >
                  Update Status
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
