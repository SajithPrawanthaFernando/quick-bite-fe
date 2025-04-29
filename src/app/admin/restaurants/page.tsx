"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Restaurant } from "@/types/restaurant";
import { adminService } from "@/redux/services/admin.service";

export default function AdminRestaurantsPage() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRestaurant(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchRestaurants();
  }, [statusFilter]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      switch (statusFilter) {
        case "pending":
          response = await adminService.getPendingRestaurants();
          break;
        case "approved":
          response = await adminService.getApprovedRestaurants();
          break;
        case "rejected":
          response = await adminService.getRejectedRestaurants();
          break;
        default:
          response = await adminService.getAllRestaurants();
      }

      if (Array.isArray(response)) {
        setRestaurants(response);
      } else {
        setError("No restaurants found.");
        setRestaurants([]);
      }
    } catch (err) {
      console.error("Error fetching restaurants:", err);
      setError("Failed to fetch restaurants.");
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    restaurantId: string,
    newStatus: "approved" | "rejected"
  ) => {
    try {
      setLoading(true);
      const isApproved = newStatus === "approved";

      setRestaurants((prev) =>
        prev.map((r) =>
          r._id === restaurantId
            ? { ...r, isApproved, isActive: isApproved, status: newStatus }
            : r
        )
      );

      await adminService.verifyRestaurant(restaurantId, {
        approved: isApproved,
        notes: isApproved ? "Approved by admin" : "Rejected by admin",
      });
    } catch (err) {
      console.error("Error updating status:", err);
      await fetchRestaurants();
    } finally {
      setLoading(false);
    }
  };

  const filteredRestaurants = restaurants.filter((restaurant) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "pending")
      return !restaurant.isApproved && restaurant.isActive;
    if (statusFilter === "approved")
      return restaurant.isApproved && restaurant.isActive;
    if (statusFilter === "rejected") return !restaurant.isActive;
    return true;
  });

  return (
    <div className="min-h-screen  p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-4">
          Restaurant Management
        </h1>

        {/* Filter buttons */}
        <div className="flex gap-4 mb-6">
          {["all", "pending", "approved", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                statusFilter === status
                  ? "bg-[#FDB940] text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-gray-600 text-sm">Loading restaurants...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                className="bg-white rounded-xl shadow border overflow-hidden min-h-[400px] flex flex-col"
              >
                <div className="p-4 flex-1 flex flex-col">
                  {restaurant.logo && (
                    <img
                      src={restaurant.logo}
                      alt={restaurant.name}
                      className="h-40 w-full object-cover rounded-lg mb-3"
                    />
                  )}
                  <h2 className="text-lg font-bold text-black mb-1">
                    {restaurant.name}
                  </h2>
                  <p className="text-gray-600 text-sm mb-1">
                    {restaurant.address}
                  </p>
                  <p className="text-gray-500 text-sm mb-2 line-clamp-3">
                    {restaurant.description}
                  </p>
                  <span className="text-xs text-gray-400 mb-4">
                    {restaurant.cuisineType}
                  </span>

                  <button
                    onClick={() => openModal(restaurant)}
                    className="mt-auto w-full py-2 text-sm border border-black bg-black text-white hover:border-[#FDB940] hover:bg-[#FDB940] rounded-lg transition"
                  >
                    View
                  </button>

                  <div className="mt-3 space-y-2">
                    {statusFilter === "pending" && !restaurant.isApproved && (
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleStatusChange(restaurant._id, "approved")
                          }
                          className="flex-1 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
                          disabled={loading}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(restaurant._id, "rejected")
                          }
                          className="flex-1 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                          disabled={loading}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {restaurant.isApproved && (
                      <span className="block text-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Approved
                      </span>
                    )}
                    {!restaurant.isActive && (
                      <span className="block text-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                        Rejected
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedRestaurant && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center text-black">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <h2 className="text-xl font-bold mb-2 text-black">
              {selectedRestaurant.name}
            </h2>
            {selectedRestaurant.logo && (
              <img
                src={selectedRestaurant.logo}
                alt={selectedRestaurant.name}
                className="w-full h-40 object-cover rounded mb-4"
              />
            )}
            <p className="text-sm mb-1">
              <strong>Address:</strong> {selectedRestaurant.address}
            </p>
            <p className="text-sm mb-1">
              <strong>Description:</strong> {selectedRestaurant.description}
            </p>
            <p className="text-sm mb-1">
              <strong>Type:</strong> {selectedRestaurant.cuisineType}
            </p>
            <p className="text-sm mb-2">
              <strong>Rating:</strong>{" "}
              {selectedRestaurant.rating?.toFixed(1) ?? "N/A"}
            </p>

            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
