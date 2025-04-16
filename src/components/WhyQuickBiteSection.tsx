"use client";

export const WhyQuickBiteSection = () => {
  return (
    <section className="pt-20 bg-white px-40">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center md:text-left">
        Why QuickBite?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-gray-700 text-center md:text-left">
        {/* Card 1 */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Deliver your way</h3>
          <p className="text-[15px] leading-relaxed">
            Our offerings are flexible so you can customize them to your needs.
            Get started with your delivery people or connect with delivery
            people through the QuickBite platform.
          </p>
        </div>

        {/* Card 2 */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Boost your visibility</h3>
          <p className="text-[15px] leading-relaxed">
            Stand out with in-app marketing to reach even more customers and
            increase sales.
          </p>
        </div>

        {/* Card 3 */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Connect with customers</h3>
          <p className="text-[15px] leading-relaxed">
            Turn customers into regulars with actionable data insights, respond
            to reviews or offer a loyalty program.
          </p>
        </div>
      </div>
    </section>
  );
};
