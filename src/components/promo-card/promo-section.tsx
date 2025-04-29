import type React from "react";
import { OrangePromoCard } from "./orange-promo-card";
import { GreyPromoCard } from "./grey-promo-card";
import { GreenPromoCard } from "./green-promo-card";

export const PromoSection: React.FC = () => {
  return (
    <div className="w-full py-4 ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <OrangePromoCard logoUrl="https://img.icons8.com/fluency/96/hamburger.png" />
        <GreyPromoCard logoUrl="https://img.icons8.com/color/96/bank-card-back-side.png" />
        <GreenPromoCard logoUrl="https://img.icons8.com/color/96/discount--v1.png" />
      </div>
      <div className="text-xs text-gray-500 mt-2">
        Additional fees may apply. Learn more
      </div>
    </div>
  );
};
