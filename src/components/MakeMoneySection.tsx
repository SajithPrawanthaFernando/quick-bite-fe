"use client";

import Image from "next/image";

export const MakeMoneySection = () => {
  return (
    <section className="py-20 px-40 bg-white">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-14 text-center md:text-left">
        Make money on the go
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
        {/* Block 1 */}
        <div>
          <div className="flex justify-center md:justify-start mb-4">
            <Image
              src="/images/carkeys.svg"
              alt="Vehicle icon"
              width={55}
              height={55}
            />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-black">
            Your vehicle, your time
          </h3>
          <p className="text-[15px] text-gray-600 leading-relaxed">
            Grab your car, bike, scooter, or even shoes and deliver whenever you
            want—for an hour, a weekend, or throughout the week.
          </p>
        </div>

        {/* Block 2 */}
        <div>
          <div className="flex justify-center md:justify-start mb-4">
            <Image
              src="/images/CashinHand.svg"
              alt="Payment icon"
              width={50}
              height={50}
            />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-black">
            Weekly payments
          </h3>
          <p className="text-[15px] text-gray-600 leading-relaxed">
            Get paid once a week and easily keep track of money you&apos;ve made
            within the driver app.
          </p>
        </div>

        {/* Block 3 */}
        <div>
          <div className="flex justify-center md:justify-start mb-4">
            <Image
              src="/images/ShareMyTrip.svg"
              alt="City icon"
              width={50}
              height={50}
            />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-black">
            Enjoy your city
          </h3>
          <p className="text-[15px] text-gray-600 leading-relaxed">
            Between picking up and dropping off deliveries, it’s just you and
            the road—relax, bump your music, and enjoy cruising around town.
          </p>
        </div>
      </div>
    </section>
  );
};
