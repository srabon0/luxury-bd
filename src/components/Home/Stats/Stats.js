import React from "react";

const Stats = () => {
  return (
    <div class="bg-white py-6 sm:py-8 lg:py-12">
      <div class="mx-auto max-w-screen-2xl px-4 md:px-8">
        <div class="mb-8 md:mb-12">
          <h2 class="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
            Our Stats
          </h2>

          <p class="mx-auto  text-center text-gray-500 md:text-lg">
            We have been serving our customers for over 20 years. We have a wide
            range of products and a large number of distributors and customers.
            We are committed to providing the best quality products to our
            customers. Also we are the leading sanitary ware manufacturer in
            Bangladesh. We have a large number of products and a large number of
            distributors and customers. We are committed to providing the best
            quality products to our customers. Also we are the leading sanitary
            ware manufacturer in Bangladesh.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-8">
          <div class="flex flex-col items-center justify-center rounded-lg bg-gray-100 p-4 lg:p-8">
            <div class="text-xl font-bold text-indigo-500 sm:text-2xl md:text-3xl">
              200
            </div>
            <div class="text-sm font-semibold sm:text-base">Product</div>
          </div>

          <div class="flex flex-col items-center justify-center rounded-lg bg-gray-100 p-4 md:p-8">
            <div class="text-xl font-bold text-indigo-500 sm:text-2xl md:text-3xl">
              120
            </div>
            <div class="text-sm font-semibold sm:text-base">People</div>
          </div>

          <div class="flex flex-col items-center justify-center rounded-lg bg-gray-100 p-4 md:p-8">
            <div class="text-xl font-bold text-indigo-500 sm:text-2xl md:text-3xl">
              1200+
            </div>
            <div class="text-sm font-semibold sm:text-base">Distributor</div>
          </div>

          <div class="flex flex-col items-center justify-center rounded-lg bg-gray-100 p-4 md:p-8">
            <div class="text-xl font-bold text-indigo-500 sm:text-2xl md:text-3xl">
              100000+
            </div>
            <div class="text-sm font-semibold sm:text-base">Customers</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
