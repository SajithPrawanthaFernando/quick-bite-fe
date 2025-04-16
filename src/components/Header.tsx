"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { logo } from "../../public/images";
import { Menu, ShoppingCart, Search, MapPin, ChevronDown } from "lucide-react";
import { MenuDrawer } from "./MenuDrawer";
import { LoginModal } from "./modals/LoginModal";
import { SignupModal } from "./modals/SignupModal";

export const Header = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const isModalOpen = isLoginOpen || isSignupOpen;

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
      }     ${isModalOpen ? "bg-mainBlack/20 backdrop-blur-sm" : ""}`}
    >
      {isModalOpen && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-md pointer-events-none z-[-1]" />
      )}
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <MenuDrawer />
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
      <div className="flex items-center gap-10">
        <div className="relative">
          <ShoppingCart className="text-black w-5 h-5" />
          <span className="absolute -top-2 -right-2 bg-[#FDB940] text-white text-xs rounded-full px-1.5 py-0.5">
            0
          </span>
        </div>
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
        />
      </div>
    </nav>
  );
};
