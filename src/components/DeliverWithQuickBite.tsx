"use client";

import Image from "next/image";
import Link from "next/link";
import { deliveryguy } from "../../public/images";
import { useState } from "react";
import { DeliveryRiderRegisterModal } from "./modals/DeliveryRiderRegisterModal";
import { LoginModal } from "./modals/LoginModal";

export const DeliverWithQuickBite = () => {
  const [isRiderModalOpen, setIsRiderModalOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);

  return (
    <section className="flex flex-col md:flex-row bg-black text-white min-h-[500px] pt-[130px] pb-[70px]  px-40">
      {/* Left Text Block */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 py-20">
        <h2 className="text-[55px] font-bold leading-tight mb-6">
          Deliver with <br /> QuickBite
        </h2>
        <p className="font-semibold mb-2 text-[16px]">
          No boss. Flexible schedule. Quick pay.
        </p>
        <p className="text-gray-300 mb-8 text-[15px] leading-relaxed max-w-md">
          Now you can make money by delivering food orders that people crave
          using the QuickBite app — all while exploring your city.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <button
            onClick={() => setIsRiderModalOpen(true)}
            className="bg-white text-black px-5 py-3 rounded-md font-medium hover:bg-[#FDB940] hover:text-black transition-all"
          >
            Sign up to deliver
          </button>
          <button
            onClick={() => setLoginOpen(true)}
            className="text-sm text-white underline underline-offset-4 hover:text-[#FDB940] transition-all"
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>

      {/* Right Image Block */}
      <div className="w-full md:w-1/2 relative min-h-[400px] ">
        <Image
          src={deliveryguy}
          alt="QuickBite delivery rider"
          fill
          className="object-cover p-10"
        />
      </div>

      <DeliveryRiderRegisterModal
        open={isRiderModalOpen}
        onOpenChange={setIsRiderModalOpen}
      />

      <LoginModal open={isLoginOpen} onOpenChange={setLoginOpen} />
    </section>
  );
};
