import React from "react";

const imgs =
  "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const Products = () => {
  return (
    <div className="bg-white py-6 sm:py-8 lg:py-12">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <div className="mb-10 md:mb-16">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
            SANITARY WARE
          </h2>

          <p className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg">
            Imagine a bathroom that anticipates your needs, adapts to your
            preferences, and seamlessly blends technology with timeless
            elegance. Discover the future of bath, only with Luxurry.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div>
            <div className="group relative block h-96 overflow-hidden rounded-t-lg bg-gray-100">
              <img
                src={imgs}
                alt="Photo by Austin Wade"
                className="h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
              />

              <span className="absolute left-0 top-3 rounded-r-lg bg-red-500 px-3 py-1.5 text-sm font-semibold uppercase tracking-wider text-white">
                -50%
              </span>
            </div>

            <div className="flex items-start justify-between gap-2 rounded-b-lg bg-gray-100 p-4">
              <div className="flex flex-col">
                <div className="font-bold text-gray-800 transition duration-100 hover:text-gray-500 lg:text-lg">
                  Fancy Outfit
                </div>
                <span className="text-sm text-gray-500 lg:text-base">
                  by Fancy Brand
                </span>
              </div>

              <div className="flex flex-col items-end">
                <span className="font-bold text-gray-600 lg:text-lg">
                  $19.99
                </span>
                <span className="text-sm text-red-500 line-through">
                  $39.99
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="group relative block h-96 overflow-hidden rounded-t-lg bg-gray-100">
              <img
                src={imgs}
                alt="Ph"
                className="h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
              />
            </div>

            <div className="flex items-start justify-between gap-2 rounded-b-lg bg-gray-100 p-4">
              <div className="flex flex-col">
                <div className="font-bold text-gray-800 transition duration-100 hover:text-gray-500 lg:text-lg">
                  Cool Outfit
                </div>
                <span className="text-sm text-gray-500 lg:text-base">
                  by Cool Brand
                </span>
              </div>

              <div className="flex flex-col items-end">
                <span className="font-bold text-gray-600 lg:text-lg">
                  $29.99
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="group relative block h-96 overflow-hidden rounded-t-lg bg-gray-100">
              <img
                src={imgs}
                alt="Photoade"
                className="h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
              />
            </div>

            <div className="flex items-start justify-between gap-2 rounded-b-lg bg-gray-100 p-4">
              <div className="flex flex-col">
                <div className="font-bold text-gray-800 transition duration-100 hover:text-gray-500 lg:text-lg">
                  Nice Outfit
                </div>
                <span className="text-sm text-gray-500 lg:text-base">
                  by Nice Brand
                </span>
              </div>

              <div className="flex flex-col items-end">
                <span className="font-bold text-gray-600 lg:text-lg">
                  $35.00
                </span>
              </div>
            </div>
          </div>
          <div>
            <div className="group relative block h-96 overflow-hidden rounded-t-lg bg-gray-100">
              <img
                src={imgs}
                alt="oto bydsfsadf A"
                className="h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
              />
            </div>

            <div className="flex items-start justify-between gap-2 rounded-b-lg bg-gray-100 p-4">
              <div className="flex flex-col">
                <div className="font-bold text-gray-800 transition duration-100 hover:text-gray-500 lg:text-lg">
                  Nice Outfit
                </div>
                <span className="text-sm text-gray-500 lg:text-base">
                  by Nice Brand
                </span>
              </div>

              <div className="flex flex-col items-end">
                <span className="font-bold text-gray-600 lg:text-lg">
                  $35.00
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
