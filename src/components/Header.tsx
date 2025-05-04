"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import * as Avatar from "@radix-ui/react-avatar";
import { Menu, ShoppingCart, Search, MapPin, ChevronDown } from "lucide-react";

import { logo } from "../../public/images";
import { MenuDrawer } from "./MenuDrawer";
import { LoginModal } from "./modals/LoginModal";
import { SignupModal } from "./modals/SignupModal";
import { UserProfileModal } from "./modals/UserProfileModal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchCart } from "@/redux/actions/cartActions";

export const Header = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { cart, loading } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const user1 = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = {
    name: "Sajith Fernando",
    email: "sajith@example.com",
    role: "Rider",
    avatarUrl: "/images/user.jpg",
  };

  const isModalOpen = isLoginOpen || isSignupOpen || isProfileOpen;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 10) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-0 w-full z-1 flex items-center justify-between pl-10 pr-12 py-4 transition-all duration-300 ${
        isVisible ? "bg-white opacity-100" : "opacity-0 -translate-y-full"
      } ${isModalOpen ? "bg-mainBlack/20 backdrop-blur-sm" : ""}`}
    >
      {isModalOpen && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-md pointer-events-none z-[-1]" />
      )}

      {/* Left Section */}
      <div className="flex items-center gap-4">
        <MenuDrawer
          onLogin={() => setIsLoginOpen(true)}
          onSignup={() => setIsSignupOpen(true)}
        />
        <Link href="/">
          <Image src={logo} alt="QuickBite" className="w-[120px] h-auto" />
        </Link>

        <div className="flex items-center bg-gray-100 rounded-full p-1">
          <button className="px-4 py-1 rounded-full bg-white text-[15px] font-medium text-black">
            Delivery
          </button>
          <button className="px-4 py-1 text-[15px] text-black">Pickup</button>
        </div>
      </div>

      {/* Center Section */}
      <div className="flex items-center gap-6">
        <div className="flex items-center text-[15px] text-black gap-1">
          <MapPin className="w-4 h-4" />
          <span>30 Layards Rd</span>
          <span className="text-gray-500 flex items-center gap-1">
            · Now <ChevronDown className="w-4 h-4" />
          </span>
        </div>
        <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 w-[300px]">
          <Search className="text-gray-500 mr-2 w-4 h-4" />
          <input
            type="text"
            placeholder="Search QuickBite"
            className="bg-transparent outline-none text-[15px] text-black w-full"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className={`flex items-center ${user ? "gap-7" : "gap-10"}`}>
        <div>
          <Link href="/myOrders">
            <div className="text-black">My Orders</div>
          </Link>
        </div>
        <div className="relative">
          <Link href="/cart">
            <ShoppingCart className="text-black w-5 h-5" />
          </Link>

          <span className="absolute -top-2 -right-2 bg-[#FDB940] text-white text-xs rounded-full px-1.5 py-0.5">
            {loading ? (
              <div className="w-2 h-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              cart.length
            )}
          </span>
        </div>

        {user1 ? (
          <>
            <button
              onClick={() => setIsProfileOpen(true)}
              className="focus:outline-none"
            >
              <Avatar.Root className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 overflow-hidden">
                <Avatar.Image
                  src={user.avatarUrl}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
                <Avatar.Fallback className="text-sm font-medium text-black">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </Avatar.Fallback>
              </Avatar.Root>
            </button>

            <UserProfileModal
              open={isProfileOpen}
              onOpenChange={setIsProfileOpen}
            />
          </>
        ) : (
          <>
            <LoginModal
              open={isLoginOpen}
              onOpenChange={setIsLoginOpen}
              trigger={
                <button className="text-[15px] font-medium mr-[-10px] text-black hover:underline">
                  Log in
                </button>
              }
            />
            <SignupModal
              open={isSignupOpen}
              onOpenChange={setIsSignupOpen}
              trigger={
                <button className="text-[15px] font-medium text-black bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200 transition-all duration-300">
                  Sign up
                </button>
              }
              triggerLogin={() => setIsLoginOpen(true)}
            />
          </>
        )}
      </div>
    </nav>
  );
};
