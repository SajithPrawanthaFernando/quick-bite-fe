"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { logo } from "../../public/images";
import { Menu, ShoppingCart, Search, MapPin, ChevronDown } from "lucide-react";
import { MenuDrawer } from "./MenuDrawer";

export const Header = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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
      className={`fixed top-0 w-full z-[50] flex items-center justify-between px-10 py-4 transition-all duration-300 ${
        isVisible ? "bg-white opacity-100" : "opacity-0 -translate-y-full"
      }`}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <MenuDrawer />
        <Image src={logo} alt="QuickBite" className="w-[120px] h-auto" />
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
      <div className="flex items-center gap-10">
        <div className="relative">
          <ShoppingCart className="text-black w-5 h-5" />
          <span className="absolute -top-2 -right-2 bg-[#FDB940] text-white text-xs rounded-full px-1.5 py-0.5">
            0
          </span>
        </div>
        <Link
          href="/login"
          className="text-[15px] font-medium mr-[-10px] text-black hover:underline"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="text-[15px] font-medium text-black bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200 transition-all duration-300"
        >
          Sign up
        </Link>
      </div>
    </nav>
  );
};
