"use client";

import { useState } from "react";
import { PaymentModal } from "@/components/modals/PaymentModal";

export default function PaymentDemoPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <PaymentModal open={open} onOpenChange={setOpen} />

      <button
        onClick={() => setOpen(true)}
        className="bg-black text-white px-6 py-3 rounded-md hover:bg-[#FDB940] hover:text-black transition-all duration-300"
      >
        Launch Payment Modal
      </button>
    </div>
  );
}
