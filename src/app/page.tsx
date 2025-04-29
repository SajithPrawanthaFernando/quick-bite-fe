"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { customerService } from "@/redux/services/customer.service";
import { Restaurant } from "@/types/restaurant";
import Image from "next/image";
import { Header } from "@/components";
import { PromoSection } from "@/components/promo-card/promo-section";
interface Category {
  name: string;
  image: string;
}

export default function Home() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState<string>("");
  const [deliveryFeeRange, setDeliveryFeeRange] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingRange, setRatingRange] = useState<string>("");
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await customerService.getRestaurants();
        console.log("Restaurants data:", response);
        setRestaurants(response);
        setError(null);
      } catch (err) {
        console.error("Error in fetchRestaurants:", err);
        setError("Failed to load restaurants. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);
  const handleSearch = () => {
    setSearchQuery(searchTerm);
  };
  const handleViewMenu = (restaurantId: string) => {
    router.push(`/restaurants/${restaurantId}/menu`);
  };
  const getRandomRating = () => {
    return (Math.random() * 2 + 3).toFixed(1);
  };
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisineType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      !selectedCategory ||
      restaurant.cuisineType.toLowerCase() === selectedCategory.toLowerCase();

    const matchesDeliveryFee =
      !deliveryFeeRange ||
      (deliveryFeeRange === "under50" && 0 <= 50) ||
      (deliveryFeeRange === "under100" && 0 <= 100) ||
      (deliveryFeeRange === "under200" && 0 <= 200);

    const matchesPrice =
      !priceRange ||
      (priceRange === "low" && 0 <= 200) ||
      (priceRange === "medium" && 0 > 200 && 0 <= 500) ||
      (priceRange === "high" && 0 > 500);
    const matchesRating =
      !ratingRange ||
      (ratingRange === "1-2" &&
        parseFloat(getRandomRating() ?? "0") >= 1 &&
        parseFloat(getRandomRating() ?? "0") <= 2) ||
      (ratingRange === "2-3" &&
        parseFloat(getRandomRating() ?? "0") >= 2 &&
        parseFloat(getRandomRating() ?? "0") <= 3) ||
      (ratingRange === "3-4" &&
        parseFloat(getRandomRating() ?? "0") >= 3 &&
        parseFloat(getRandomRating() ?? "0") <= 4) ||
      (ratingRange === "4-5" &&
        parseFloat(getRandomRating() ?? "0") >= 4 &&
        parseFloat(getRandomRating() ?? "0") <= 5);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesDeliveryFee &&
      matchesPrice &&
      matchesRating
    );
  });

  const sortedRestaurants = (() => {
    const list = [...filteredRestaurants];
    switch (sortOption) {
      case "rating":
        return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      case "deliveryFeeLowToHigh":
        return list.sort((a, b) => 0 - 0);
      case "under30min":
        return list.filter((restaurant) => 60 <= 30);
      default:
        return list;
    }
  })();

  const categories: Category[] = [
    { name: "Rice", image: "https://img.icons8.com/color/96/rice-bowl.png" },
    {
      name: "Juices",
      image:
        "https://img.icons8.com/?size=100&id=Gk9DGwLAJ4nq&format=png&color=000000",
    },
    { name: "Seafood", image: "https://img.icons8.com/color/96/fish-food.png" },
    { name: "Pizza", image: "https://img.icons8.com/color/96/pizza.png" },
    {
      name: "Bakery",
      image:
        "https://img.icons8.com/?size=100&id=MhYHDvB1fJpn&format=png&color=000000",
    },
    {
      name: "Burgers",
      image:
        "https://img.icons8.com/?size=100&id=TOD1kO8O39SR&format=png&color=000000",
    },
    {
      name: "Convenience",
      image:
        "https://img.icons8.com/?size=100&id=xFTaHKjcfaaL&format=png&color=000000",
    },
    {
      name: " Tea",
      image:
        "https://img.icons8.com/?size=100&id=vt3FjELxZZG0&format=png&color=000000",
    },
    {
      name: "Chinese",
      image:
        "https://img.icons8.com/?size=100&id=zMZO9n0NVrlA&format=png&color=000000",
    },
    {
      name: "Healthy",
      image:
        "https://img.icons8.com/?size=100&id=107450&format=png&color=000000",
    },
    {
      name: "Sweets",
      image:
        "https://img.icons8.com/?size=100&id=uHFJlrVWXrLO&format=png&color=000000",
    },
    {
      name: "Indian",
      image:
        "https://img.icons8.com/?size=100&id=r2CPanP0nY5E&format=png&color=000000",
    },
    {
      name: "Soup",
      image:
        "https://img.icons8.com/?size=100&id=xebNBJdG2QFj&format=png&color=000000",
    },
    {
      name: "Korean",
      image:
        "https://img.icons8.com/?size=100&id=HLBndwTk7Lyv&format=png&color=000000",
    },
    {
      name: "Sushi",
      image:
        "https://img.icons8.com/?size=100&id=lEhilJeBBAKX&format=png&color=000000",
    },
    {
      name: "Thai",
      image:
        "https://img.icons8.com/?size=100&id=WPYkrBKxjmHa&format=png&color=000000",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading restaurants...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!restaurants || restaurants.length === 0) {
    return <div>No restaurants found.</div>;
  }

  return (
    <div className="min-h-screen bg-white pt-[80px]">
      {/* Header */}

      {/* Categories */}
      <div className="bg-white py-4 px-10">
        <div className="flex overflow-x-auto px-6 gap-4">
          {categories.map((category) => (
            <div
              key={category.name}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => setSelectedCategory(category.name)}
            >
              <Image
                src={category.image}
                alt={category.name}
                width={60}
                height={60}
                className="rounded-full"
              />
              <span className="text-sm font-semibold">{category.name}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Filters Dropdowns */}
      <div className="bg-white py-4 flex gap-4 items-center flex-nowrap px-20">
        <select
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          className="bg-gray-200 rounded-full px-4 py-2 text-sm"
        >
          <option value="">Price Range</option>
          <option value="low">Low (≤ $200)</option>
          <option value="medium">Medium ($200 - $500)</option>
          <option value="high">High ($500)</option>
        </select>

        <select
          value={deliveryFeeRange}
          onChange={(e) => setDeliveryFeeRange(e.target.value)}
          className="bg-gray-200 rounded-full px-4 py-2 text-sm"
        >
          <option value="">Delivery Fee</option>
          <option value="under50">Under ₹50</option>
          <option value="under100">Under ₹100</option>
          <option value="under200">Under ₹200</option>
        </select>

        <select
          value={ratingRange}
          onChange={(e) => setRatingRange(e.target.value)}
          className="bg-gray-200 rounded-full px-4 py-2  text-sm"
        >
          <option value="">Rating Range</option>
          <option value="1-2">1-2</option>
          <option value="2-3">2-3</option>
          <option value="3-4">3-4</option>
          <option value="4-5">4-5</option>
        </select>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="bg-gray-200 rounded-full px-4 py-2 text-sm"
        >
          <option value="">Sort</option>
          <option value="rating">Rating High to Low</option>
          <option value="deliveryFeeLowToHigh">Delivery Fee Low to High</option>
          <option value="under30min">Delivery under 30 min</option>
        </select>
      </div>

      <PromoSection />

      <div className="px-10 pt-6 pb-2 flex justify-between items-center">
        <h2 className="text-2xl font-bold px-10">
          Most loved deals on QuickBite
        </h2>
        <button className="text-sm font-medium pr-14">See all</button>
      </div>
      {/* Restaurants */}

      <div className="max-w-screen-xl bg-white mx-auto px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-2 gap-y-6">
        {sortedRestaurants.map((restaurant) => (
          <div
            key={restaurant._id}
            className="bg-white rounded-lg overflow-hidden cursor-pointer"
            onClick={() => handleViewMenu(restaurant._id)}
            style={{ width: "224px", height: "206px" }}
          >
            <img
              src={restaurant.logo}
              alt={restaurant.name}
              style={{ width: "224px", height: "136px" }}
              className="rounded-lg object-cover"
            />
            <div className="p-4">
              <h2 className="font-bold text-lg">{restaurant.name}</h2>

              <span className="text-sm text-gray-600 flex items-center space-x-2">
                <span className="font-bold text-black-500">
                  {getRandomRating()} ⭐
                </span>
                <span>
                  Delivery Fee: ${Math.floor(Math.random() * 100) + 20}
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
