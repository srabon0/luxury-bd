import React from 'react';

const ProductDetailsSkeleton = () => {
    return (
        <div className="bg-white py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-screen-lg px-4 md:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-lg bg-gray-100">
                <div className="skeleton h-96 w-full"></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-4 w-52">
                  <div className="skeleton h-32 w-full"></div>
                  <div className="skeleton h-4 w-28"></div>
                  <div className="skeleton h-4 w-full"></div>
                  <div className="skeleton h-4 w-full"></div>
                </div>
              </div>
            </div>
      
            <div className="md:py-8">
              <div className="mb-2 md:mb-3">
                <div className="flex flex-col gap-4 w-52">
                  <div className="skeleton h-4 w-28"></div>
                  <div className="skeleton h-4 w-full"></div>
                </div>
              </div>
      
              <div className="mb-4">
                <div className="flex items-end gap-2">
                  <div className="flex flex-col gap-4 w-52">
                    <div className="skeleton h-4 w-28"></div>
                  </div>
                </div>
              </div>
      
              <div className="mb-6 flex items-center gap-2 text-gray-500">
                <div className="skeleton h-6 w-6"></div>
                <div className="flex flex-col gap-4 w-52">
                  <div className="skeleton h-4 w-28"></div>
                </div>
              </div>
      
              <div className="flex gap-2.5">
                <button className="inline-block flex-1 rounded-lg bg-indigo-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 sm:flex-none md:text-base">
                  <div className="skeleton h-3 w-20"></div>
                </button>
      
                <button className="inline-block rounded-lg bg-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-500 outline-none ring-indigo-300 transition duration-100 hover:bg-gray-300 focus-visible:ring active:text-gray-700 md:text-base">
                  <div className="skeleton h-6 w-6"></div>
                </button>
              </div>
      
              <div className="mt-10 md:mt-16 lg:mt-20">
                <div className="mb-3 text-lg font-semibold text-gray-800">
                  <div className="skeleton h-4 w-28"></div>
                </div>
                <div className="flex flex-col gap-4 w-52">
                  <div className="skeleton h-4 w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default ProductDetailsSkeleton;