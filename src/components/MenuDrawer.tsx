"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X, ExternalLink } from "lucide-react";
import { FaApple } from "react-icons/fa";
import { GrAndroid } from "react-icons/gr";
import Image from "next/image";
import Link from "next/link";
import { logo2, logo3 } from "../../public/images";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export const MenuDrawer = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="p-2">
          <Menu strokeWidth={2} className="text-black w-6 h-6" />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50  " />
        <Dialog.Content className="drawer-content ">
          <Dialog.Title asChild>
            <VisuallyHidden>Menu</VisuallyHidden>
          </Dialog.Title>
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <Image src={logo2} alt="QuickBite" className="h-8 w-auto" />
              <Dialog.Close asChild>
                <button>
                  <X className="w-5 h-5 text-gray-600 " />
                </button>
              </Dialog.Close>
            </div>

            {/* Primary Actions */}
            <div className="flex flex-col gap-2">
              <Link
                href="/signup"
                className="bg-black hover:bg-black/80 text-white text-center py-4 rounded-md font-medium transition-all duration-300"
              >
                Sign up
              </Link>
              <Link
                href="/login"
                className=" bg-gray-100 hover:bg-gray-200 text-center transition-all duration-300 py-4 rounded-md font-medium text-black "
              >
                Log in
              </Link>
            </div>

            {/* Links */}
            <div className="mt-8 flex flex-col gap-5 text-sm font-medium text-black">
              <Link href="#">Create a business account</Link>
              <Link href="#">Add your restaurant</Link>
              <Link href="#">Sign up to deliver</Link>
              <Link href="#" className="flex items-center gap-1">
                Get a ride <ExternalLink className="ml-[2px] w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* App promo */}
          <div className="mt-8 pt-4 text-black mb-4">
            <hr className="border-gray-200 my-4" />
            <div className="flex items-center gap-1 mb-4">
              <div className=" rounded-md p-1">
                <Image
                  src={logo3}
                  alt="QuickBite"
                  className="h-[80px] w-[105px]"
                />
              </div>
              <p className="text-[16px]">There's more to love in the app.</p>
            </div>
            <div className="flex justify-center gap-2 text-black">
              <button className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm">
                <FaApple className="w-[18px] h-[18px]" />
                iPhone
              </button>
              <button className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm">
                <GrAndroid className="w-4 h-4" />
                Android
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
