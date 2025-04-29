"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchOrders, updateOrderStatus } from "@/redux/actions/orderAction";
import { ChevronDown, RefreshCw } from "lucide-react";
import * as Select from "@radix-ui/react-select";
import { useToast } from "@/components/ToastProvider";

const statusOptions = ["preparing", "packing up", "out for delivery"];

export default function AdminOrdersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading, error } = useSelector(
    (state: RootState) => state.orders
  );

  const { showToast } = useToast();

  const [selectedStatuses, setSelectedStatuses] = useState<{
    [key: string]: string;
  }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6;

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleStatusChange = (orderId: string, status: string) => {
    setSelectedStatuses((prev) => ({ ...prev, [orderId]: status }));
  };

  const handleUpdateStatus = async (orderId: string) => {
    const newStatus = selectedStatuses[orderId];
    if (!newStatus) {
      showToast("Missing Status", "Please select a status before updating.");
      return;
    }

    await dispatch(updateOrderStatus(orderId, newStatus));
    showToast("Order Updated", `Order status changed to "${newStatus}".`);
    dispatch(fetchOrders());
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2 text-black">Order Management</h1>
      <p className="text-gray-600 mb-6">
        Manage and update customer orders here.
      </p>

      {loading ? (
        <p className="text-center mt-10 text-gray-500">Loading orders...</p>
      ) : error ? (
        <p className="text-center text-red-500 font-medium">Error: {error}</p>
      ) : orders.length === 0 ? (
        <div className="bg-yellow-50 text-yellow-800 px-4 py-2 rounded mb-4 border border-yellow-200">
          No orders found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border  bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-[#FDB940] text-gray-700 font-semibold">
              <tr>
                <th className="px-4 py-3 text-left">Order ID</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Items</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {currentOrders.map((order, index) => (
                <tr
                  key={order._id}
                  className={`hover:bg-gray-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3 font-mono">{order._id}</td>
                  <td className="px-4 py-3 capitalize">{order.status}</td>
                  <td className="px-4 py-3">{order.items.length} items</td>
                  <td className="px-4 py-3">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <Select.Root
                        value={selectedStatuses[order._id!] || ""}
                        onValueChange={(value) =>
                          handleStatusChange(order._id!, value)
                        }
                      >
                        <Select.Trigger className="bg-gray-100 text-sm px-3 py-2 text-black/70 rounded border border-gray-300 flex items-center justify-between w-[180px]">
                          <Select.Value placeholder="Select Status" />
                          <Select.Icon>
                            <ChevronDown size={16} />
                          </Select.Icon>
                        </Select.Trigger>
                        <Select.Portal>
                          <Select.Content className="bg-white rounded shadow border z-50 text-black/70">
                            <Select.Viewport className="p-1">
                              {statusOptions.map((status) => (
                                <Select.Item
                                  key={status}
                                  value={status}
                                  className="cursor-pointer px-2 py-1 rounded hover:bg-yellow-50"
                                >
                                  <Select.ItemText>{status}</Select.ItemText>
                                </Select.Item>
                              ))}
                            </Select.Viewport>
                          </Select.Content>
                        </Select.Portal>
                      </Select.Root>

                      <button
                        onClick={() => handleUpdateStatus(order._id!)}
                        title="Update Status"
                        className="p-2 rounded-md bg-green-50 text-green-600 hover:bg-green-100 transition"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Footer */}
          <div className="flex justify-between items-center px-4 py-3 border-t border-[#FDB940] bg-white text-sm">
            <div className="text-gray-600">
              Showing {indexOfFirstOrder + 1}–
              {Math.min(indexOfLastOrder, orders.length)} of {orders.length}{" "}
              orders
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPage(currentPage - 1)}
                className="px-3 py-1 border border-gray-200 text-gray-400 rounded hover:bg-gray-100 disabled:opacity-40"
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToPage(idx + 1)}
                  className={`px-3 py-1 border text-gray-400 rounded hover:text-white hover:bg-[#FDB940] ${
                    currentPage === idx + 1
                      ? "bg-[#FDB940] text-white border-[#FDB940] font-semibold"
                      : "border-gray-200"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => goToPage(currentPage + 1)}
                className="px-3 py-1 border rounded hover:bg-gray-100 text-gray-400 border-gray-200 disabled:opacity-40"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
