"use client";

import Image from "next/image";

export const HowItWorksSection = () => {
  return (
    <section className="pt-20 bg-white px-40  w-screen">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-start">
        How QuickBite works for restaurant partners
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Step 1 */}
        <div className="flex flex-col items-start text-start">
          <div className="w-full h-[300px] relative mb-6">
            <Image
              src="/images/CustomersOrder.svg"
              alt="Customers order"
              fill
              className="object-contain"
            />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-black">
            Customers order
          </h3>
          <p className="text-[15px] text-gray-600">
            A customer finds your restaurant and places an order through the
            QuickBite app.
          </p>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-start text-center">
          <div className="w-full h-[300px] relative mb-6">
            <Image
              src="/images/YouPrepare.svg"
              alt="You prepare"
              fill
              className="object-contain"
            />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-black">You prepare</h3>
          <p className="text-[15px] text-gray-600">
            Your restaurant accepts and prepares the order.
          </p>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-start text-start">
          <div className="w-full h-[300px] relative mb-6">
            <Image
              src="/images/DeliveryPeopleArrive.svg"
              alt="Delivery partners arrive"
              fill
              className="object-contain"
            />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-black">
            Delivery partners arrive
          </h3>
          <p className="text-[15px] text-gray-600">
            Delivery people using the QuickBite platform pick up the order from
            your restaurant, then deliver it to the customer.
          </p>
        </div>
      </div>
    </section>
  );
};
