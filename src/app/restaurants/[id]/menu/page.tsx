"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { StarIcon } from "@heroicons/react/24/solid";
import { customerService } from "@/redux/services/customer.service";
import type { MenuItem } from "@/redux/services/menu.service";
import type { Restaurant } from "@/redux/services/restaurant.service";
import { HeartIcon as OutlineHeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import ArrivalTimePopup from "@/components/arrival-time-popup";
import { Search } from "lucide-react";
import { HandThumbUpIcon as OutlineThumbUpIcon } from "@heroicons/react/24/outline";
import { HandThumbUpIcon as SolidThumbUpIcon } from "@heroicons/react/24/solid";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addToCart } from "@/redux/actions/cartActions";

export default function MenuPage() {
  const params = useParams();
  const restaurantId = params.id as string;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const openingHours = { start: "8:30 PM", end: "9:30 PM" };
  const [quantity, setQuantity] = useState(Math.floor(Math.random() * 10) + 1);
  const [count, setCount] = useState(0); // Initialize count state to 0

  const dispatch = useDispatch<AppDispatch>();

  const handleClick = () => {
    setCount(count + 1); // Increment the count each time the button is clicked
  };
  // Calculate current status
  const getCurrentStatus = () => {
    const currentTime = new Date();

    // Hardcoded opening and closing times (8:30 PM - 9:30 PM)
    const openingHours = "8:30 PM";
    const closingHours = "9:30 PM";

    // Convert the opening and closing times to Date objects
    const openingTime = new Date();
    const closingTime = new Date();
    const randomQuantity = Math.floor(Math.random() * 10) + 1;

    // Parsing the times as 24-hour format by splitting the time string
    const parseTime = (time: string) => {
      const [hourMinute, period] = time.split(" ");
      let [hour, minute] = hourMinute.split(":").map(Number);

      // Convert to 24-hour format
      if (period === "PM" && hour !== 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;

      return { hour, minute };
    };

    const openingParsed = parseTime(openingHours);
    const closingParsed = parseTime(closingHours);

    openingTime.setHours(openingParsed.hour, openingParsed.minute, 0, 0);
    closingTime.setHours(closingParsed.hour, closingParsed.minute, 0, 0);

    // Compare current time with opening and closing times
    if (currentTime >= openingTime && currentTime <= closingTime) {
      return "Open";
    } else {
      return "Closed";
    }
  };

  // Store the status in state so it can be used in the JSX
  const [status, setStatus] = useState(getCurrentStatus());

  // Update status every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(getCurrentStatus());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchRestaurantAndMenu();
  }, [restaurantId]);

  const fetchRestaurantAndMenu = async () => {
    try {
      setLoading(true);

      const [restaurantData, menuDataRaw] = await Promise.all([
        customerService.getRestaurant(restaurantId),
        customerService.getRestaurantMenu(restaurantId),
      ]);

      setRestaurant(restaurantData);

      const menuData = menuDataRaw as { [category: string]: MenuItem[] };
      const items: MenuItem[] = Object.values(menuData).flat();
      setMenuItems(items);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load restaurant information");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const handleAddToCart = (
    item: MenuItem,
    quantity: number = 1,
    specialInstructions: string = ""
  ) => {
    const cartItem = {
      itemId: item._id,
      name: item.name,
      price: item.price,
      quantity,
      specialInstructions,
    };
    dispatch(addToCart(cartItem));
  };

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600">{error || "Restaurant not found"}</p>
      </div>
    );
  }

  const AvailabilityBadge = ({ available }: { available: boolean }) => (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {available ? "Available" : "Unavailable"}
    </span>
  );

  // Filter menu items based on search query
  const filteredMenuItems = menuItems.filter((item) => {
    return (
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description &&
        item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="min-h-screen bg-white relative pt-[80px]">
      <h1 className="mb-12"></h1>
      <main className="max-w-screen-lg mx-auto pl-0 pr-10 -mt-12 relative z-10 space-y-2">
        {/* Restaurant Background Image */}
        {restaurant.logo && (
          <div className="relative h-[250px] w-[1044px] rounded-xl overflow-hidden">
            <img
              src={restaurant.logo}
              alt={restaurant.name}
              className="object-cover w-full h-full rounded-xl"
            />

            {/* Heart Button */}
            <button
              onClick={() => setLiked(!liked)}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md"
            >
              {liked ? (
                <SolidHeartIcon className="h-5 w-5 text-red-500" />
              ) : (
                <OutlineHeartIcon className="h-5 w-5 text-gray-800 hover:text-red-500" />
              )}
            </button>
          </div>
        )}

        {/* Restaurant Info */}
        <div className="py-6 pr-6 w-full flex sm:flex-row flex-col rounded-xl space-y-4">
          {/* Left side Restaurant Details */}
          <div className="flex flex-col sm:w-1/2 w-full sm:mr-8">
            <h1 className="text-[32px] font-bold text-gray-900">
              {restaurant.name}
            </h1>

            <div className="flex items-center space-x-2 mt-2">
              <StarIcon className="h-5 w-5 text-yellow-400" />
              <span className="ml-1 text-gray-600 text-sm">4.5</span>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-gray-600 text-sm">
                {restaurant.cuisineType}
              </span>
              <span className="mx-2 text-gray-400">•</span>
              <span
                className={`text-sm font-semibold ${
                  restaurant.isTemporarilyClosed
                    ? "text-red-500"
                    : "text-green-600"
                }`}
              >
                {restaurant.isTemporarilyClosed ? "Closed" : "Open"}
              </span>
            </div>

            <p className="mt-3 text-gray-600 text-sm">
              {restaurant.description}
            </p>
            <p className="mt-3 text-gray-600 text-sm">{restaurant.address}</p>

            {/* You can add Delivery Fee and Time info here */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:gap-6 text-sm text-gray-700">
              {/* Example:
        <div>Delivery Fee: $3</div>
        <div>Est. Time: 30-40 min</div> 
        */}
            </div>
          </div>

          {/* Right Side (if you want to add something later) */}
        </div>
      </main>

      <div className="flex items-center justify-center space-x-4 px-[170px]">
        {/* Fixed Opening Hours Box */}
        <div className="w-auto max-w-[220px] p-3 rounded-lg border border-gray-200 shadow-sm bg-white z-20">
          {/* Opening Hours */}
          <div className="text-sm text-gray-700">
            <strong>Opening Hours:</strong> {openingHours.start} to{" "}
            {openingHours.end}
            <span
              className={`ml-2 text-sm font-semibold ${
                status === "Closed" ? "text-red-500" : "text-green-600"
              }`}
            ></span>
          </div>
        </div>

        {/* Fixed Estimated Arrival Box */}
        <div className="w-auto max-w-[220px] p-3 rounded-lg border border-gray-200 shadow-sm bg-white z-20">
          <div className="text-sm text-gray-700">
            <ArrivalTimePopup />
          </div>
        </div>

        {/* Search bar */}
        <div className="relative mx-auto max-w-md mb-6 mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search in menu"
              className="w-[500px] pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="max-w-screen-lg mx-auto rounded-lg   lg py-4 mb-5 mt-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Featured items</h2>
        {/* Featured Items */}

        {filteredMenuItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No menu items available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 ml-[-15px]">
            {filteredMenuItems.map((item) => (
              <div
                key={item._id}
                className="relative flex flex-col items-start p-4 "
              >
                <div className="relative w-[170px] h-[188px] mb-3">
                  {item.image && (
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="rounded-lg object-cover w-full h-full"
                    />
                  )}

                  <div className="absolute bottom-2 right-4">
                    <button
                      className="bg-white text-black font-bold text-xl p-3 w-10 h-10 rounded-full shadow-md hover:bg-gray-100 transition flex items-center justify-center"
                      onClick={() => {
                        handleAddToCart(item, 1, "");
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {item.name}
                  </h3>
                  <span className="text-lg font-bold text-gray-900">
                    ${Number(item.price).toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleClick}
                  className="flex items-center space-x-2"
                >
                  {/* Toggle between solid and outline thumbs-up icon */}
                  {liked ? (
                    <SolidThumbUpIcon className="h-6 w-6 text-blue-500" />
                  ) : (
                    <OutlineThumbUpIcon className="h-6 w-6 text-gray-500" />
                  )}
                  <span>({count})</span>
                </button>
                <div className="text-center mt-2">
                  <AvailabilityBadge available={item.isAvailable} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Popup */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-animation ">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 flex flex-col md:flex-row relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl"
            >
              ×
            </button>

            {/* Left: Image */}
            <div className="w-full md:w-1/2 mb-4 md:mb-0 md:mr-6">
              {selectedItem.image && (
                <img
                  src={selectedItem.image || "/placeholder.svg"}
                  alt={selectedItem.name}
                  width={400}
                  height={300}
                  className="rounded-lg object-cover w-full h-auto"
                />
              )}
            </div>

            {/* Right: Details */}
            <div className="w-full md:w-1/2 flex flex-col space-y-3">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedItem.name}
              </h2>
              <p className="text-lg font-semibold text-gray-700">
                ${Number(selectedItem.price).toFixed(2)}
              </p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  selectedItem.isAvailable
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {selectedItem.isAvailable ? "Available" : "Unavailable"}
              </span>
              <h2 className="text-xs text-gray-800">
                {selectedItem.description}
              </h2>
              <label className="text-sm text-gray-600">
                Special Instructions
              </label>
              <textarea
                className="border border-gray-300 rounded p-2 text-sm"
                rows={3}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
              />

              <label className="text-sm text-gray-600">Quantity</label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border border-gray-300 rounded p-2 w-20 text-sm"
              />

              <button
                className={`mt-4 px-4 py-2 rounded ${
                  selectedItem.isAvailable
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                onClick={() => {
                  if (selectedItem.isAvailable) {
                    const cartItem = {
                      itemId: selectedItem._id,
                      name: selectedItem.name,
                      price: selectedItem.price,
                      quantity: quantity,
                      specialInstructions: specialInstructions,
                    };
                    dispatch(addToCart(cartItem));
                    setShowModal(false);
                  }
                }}
                disabled={!selectedItem.isAvailable}
              >
                {selectedItem.isAvailable ? "Add to Cart" : "Item Unavailable"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
