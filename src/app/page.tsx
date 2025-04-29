"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { customerService } from "@/redux/services/customer.service";
import { Restaurant } from "@/types/restaurant";
import * as Select from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";
import Image from "next/image";

import { Header } from "@/components";
import { PromoSection } from "@/components/promo-card/promo-section";
import { LoginModal } from "@/components/modals/LoginModal";
import { AppDispatch } from "@/hooks/reduxHooks";
import { getUsers } from "@/redux/actions/usersActions";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const dispatch = AppDispatch();

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  useEffect(() => {
    setIsLoggedIn(isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    dispatch(getUsers());
  }, []);

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
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }
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
    <div className="min-h-screen px-40 bg-white pt-[80px]">
      {/* Header */}

      {/* Categories */}
      <div className="bg-white py-4 text-[12px] text-black/70">
        <div className="flex overflow-x-auto  gap-4">
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
      <div className="bg-white py-4 flex gap-4 text-black/70 items-center flex-nowrap">
        {/* Price Range */}
        <Select.Root value={priceRange} onValueChange={setPriceRange}>
          <Select.Trigger className="bg-gray-200 rounded-full px-4 py-2 text-sm flex items-center justify-between min-w-[150px]">
            <Select.Value placeholder="Price Range" />
            <Select.Icon className="ml-2">
              <ChevronDown size={16} />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="bg-white rounded shadow border">
              <Select.Viewport className="p-1">
                <Select.Item value="low">
                  <Select.ItemText>Low (≤ $200)</Select.ItemText>
                </Select.Item>
                <Select.Item value="medium">
                  <Select.ItemText>Medium ($200 - $500)</Select.ItemText>
                </Select.Item>
                <Select.Item value="high">
                  <Select.ItemText>High (&gt; $500)</Select.ItemText>
                </Select.Item>
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>

        {/* Delivery Fee */}
        <Select.Root
          value={deliveryFeeRange}
          onValueChange={setDeliveryFeeRange}
        >
          <Select.Trigger className="bg-gray-200 rounded-full px-4 py-2 text-sm flex items-center justify-between min-w-[150px]">
            <Select.Value placeholder="Delivery Fee" />
            <Select.Icon>
              <ChevronDown size={16} />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="bg-white rounded shadow border">
              <Select.Viewport className="p-1">
                <Select.Item value="under50">
                  <Select.ItemText>Under ₹50</Select.ItemText>
                </Select.Item>
                <Select.Item value="under100">
                  <Select.ItemText>Under ₹100</Select.ItemText>
                </Select.Item>
                <Select.Item value="under200">
                  <Select.ItemText>Under ₹200</Select.ItemText>
                </Select.Item>
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>

        {/* Rating Range */}
        <Select.Root value={ratingRange} onValueChange={setRatingRange}>
          <Select.Trigger className="bg-gray-200 rounded-full px-4 py-2 text-sm flex items-center justify-between min-w-[150px]">
            <Select.Value placeholder="Rating Range" />
            <Select.Icon>
              <ChevronDown size={16} />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="bg-white rounded shadow border">
              <Select.Viewport className="p-1">
                <Select.Item value="1-2">
                  <Select.ItemText>1 - 2</Select.ItemText>
                </Select.Item>
                <Select.Item value="2-3">
                  <Select.ItemText>2 - 3</Select.ItemText>
                </Select.Item>
                <Select.Item value="3-4">
                  <Select.ItemText>3 - 4</Select.ItemText>
                </Select.Item>
                <Select.Item value="4-5">
                  <Select.ItemText>4 - 5</Select.ItemText>
                </Select.Item>
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>

        {/* Sort Option */}
        <Select.Root value={sortOption} onValueChange={setSortOption}>
          <Select.Trigger className="bg-gray-200 rounded-full px-4 py-2 text-sm flex items-center justify-between min-w-[180px]">
            <Select.Value placeholder="Sort" />
            <Select.Icon>
              <ChevronDown size={16} />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="bg-white rounded shadow border">
              <Select.Viewport className="p-1">
                <Select.Item value="rating">
                  <Select.ItemText>Rating High to Low</Select.ItemText>
                </Select.Item>
                <Select.Item value="deliveryFeeLowToHigh">
                  <Select.ItemText>Delivery Fee Low to High</Select.ItemText>
                </Select.Item>
                <Select.Item value="under30min">
                  <Select.ItemText>Delivery under 30 min</Select.ItemText>
                </Select.Item>
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>

      <PromoSection />

      <div className=" pt-6 pb-2 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-black mb-3">
          Most loved deals on QuickBite
        </h2>
        <button className="text-sm font-medium pr-3 text-black/70">
          See all
        </button>
      </div>
      {/* Restaurants */}

      <div className="max-w-screen-xl bg-white mx-auto text-black/70  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-2 gap-y-6">
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
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
    </div>
  );
}
