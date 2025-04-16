"use client";

export const HowItWorksSteps = () => {
  return (
    <section className=" px-40 bg-white">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
        How it works
      </h2>

      <ol className="relative border-l-2 border-gray-300 ml-3">
        {/* Step 1 */}
        <li className="mb-10 ml-6 relative">
          <div className="absolute w-2.5 h-2.5 bg-black  -left-7.5 top-2" />
          <h3 className="text-lg font-bold text-gray-900">1. Log in</h3>
          <p className="mt-1 text-[15px] text-gray-700">
            Get on the road and log in to the Driver app to begin receiving
            delivery requests.
          </p>
        </li>

        {/* Step 2 */}
        <li className="mb-10 ml-6 relative">
          <div className="absolute w-2.5 h-2.5 bg-black  -left-7.5 top-2" />
          <h3 className="text-lg font-bold text-gray-900">2. Deliver orders</h3>
          <p className="mt-1 text-[15px] text-gray-700">
            Suggested navigation and information from restaurants and your
            customers is provided in the
            <br /> app to help deliveries run smoothly.
          </p>
        </li>

        {/* Step 3 */}
        <li className="ml-6 relative">
          <div className="absolute w-2.5 h-2.5 bg-black  -left-7.5 top-2" />
          <h3 className="text-lg font-bold text-gray-900">3. Earn money</h3>
          <p className="mt-1 text-[15px] text-gray-700">
            You can track your earnings and cash out daily or weekly.
          </p>
        </li>
      </ol>
    </section>
  );
};
