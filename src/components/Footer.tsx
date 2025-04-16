"use client";
import Image from "next/image";
import Link from "next/link";
import { Globe } from "lucide-react";
import { FaSquareFacebook, FaTwitter, FaInstagram } from "react-icons/fa6";

import logo2 from "../../public/images/logo2.png";
import playStore from "../../public/images/googleplay.png";

export const Footer = () => {
  return (
    <footer className="bg-white  px-40 pt-12 pb-6 text-[15px] text-black">
      <hr className=" border-gray-200 my-8" />
      <div className="flex justify-between">
        {/* Logo + App Stores */}
        <div className="flex flex-col gap-6">
          <Image src={logo2} alt="QuickBite" className="w-[140px] h-auto" />
          <div className="flex space-x-4">
            <Image
              src="/images/applestore.svg"
              width={15}
              height={5}
              alt="Download on App Store"
              className="h-12 w-auto"
            />
            <Image
              src={playStore}
              alt="Get it on Google Play"
              className="h-12 w-auto"
            />
          </div>
          <div className="flex space-x-4 pt-4">
            <FaSquareFacebook className="w-5 h-5" />
            <FaTwitter className="w-5 h-5" />
            <FaInstagram className="w-5 h-5" />
          </div>
        </div>

        <div className="flex flex-col gap-4 ">
          <Link href="#">Get Help</Link>
          <Link href="#">Add your restaurant</Link>
          <Link href="#">Sign up to deliver</Link>
          <Link href="#">Create a business account</Link>
        </div>
        <div className="flex flex-col gap-4 ">
          <Link href="#">Restaurants near me</Link>
          <Link href="#">View all cities</Link>
          <Link href="#">View all countries</Link>
          <Link href="#">Pickup near me</Link>
          <Link href="#">About QuickBite</Link>
          <div className="flex items-center gap-1 pt-1">
            <Globe className="w-4 h-4" />
            <span>English</span>
          </div>
        </div>
      </div>

      <hr className=" border-gray-200 mt-8" />
      {/* Legal Links */}
      <div className="md:col-span-3 mt-8 mb-2 flex   flex-col md:flex-row justify-between text-gray-600 text-xs gap-4">
        <div className="flex flex-wrap gap-4">
          <Link href="#">Privacy Policy</Link>
          <Link href="#">Terms</Link>
          <Link href="#">Pricing</Link>
          <Link href="#">Do not sell or share my personal info</Link>
        </div>
        <div className="text-right md:text-left">
          <p>© 2025 QuickBite Technologies Inc.</p>
        </div>
      </div>
    </footer>
  );
};
