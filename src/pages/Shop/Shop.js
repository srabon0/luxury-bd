/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { useEffect, useState } from "react";
import { BiChevronDown, BiX } from "react-icons/bi";
import { IoFunnelOutline } from "react-icons/io5";
import Product from "../../components/home/Products/Product";
import FullScreenLoader from "../../components/Loader/FullScreenLoader";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import Pagination from "../../components/pageProps/shopPage/Pagination";
import { useGetBrandsQuery } from "../../redux/features/brand/brandApi";
import { useGetCategoriesQuery } from "../../redux/features/categories/categoryApi";

export default function Shop() {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const {
    data: brandData,
    error: brandError,
    isLoading: brandLoading,
  } = useGetBrandsQuery();
  const {
    data: catData,
    error: catError,
    isLoading: catLoading,
  } = useGetCategoriesQuery();

  useEffect(() => {
    if (brandData && catData) {
      const brandFilter = {
        id: "brand",
        name: "Brand",
        options: brandData.data.data.map((brand) => ({
          value: brand._id,
          label: brand.name,
        })),
      };

      const categoryFilter = {
        id: "category",
        name: "Category",
        options: catData.data.data.map((category) => ({
          value: category._id,
          label: category.name,
        })),
      };

      setFilters([brandFilter, categoryFilter]);
    }
  }, [brandData, catData]);

  const handleItemPerPage = (itemsPerPage) => {
    setItemsPerPage(itemsPerPage);
  };

  if (brandLoading || catLoading) return <FullScreenLoader />;
  if (brandError || catError) return <div>Error loading data</div>;

  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
        <Dialog
          open={mobileFiltersOpen}
          onClose={setMobileFiltersOpen}
          className="relative lg:hidden"
          style={{ zIndex: 999990 }}
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative ml-auto flex h-full w-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full"
            >
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="-mr-2 flex h-10 w-10 items-center justify-center p-2 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close menu</span>
                  <BiX aria-hidden="true" className="h-6 w-6" />
                </button>
              </div>

              {/* Filters */}
              <form className="mt-4">
                {filters.map((section) => (
                  <Disclosure
                    key={section.name}
                    as="div"
                    className="border-t border-gray-200 pb-4 pt-4"
                  >
                    <fieldset>
                      <legend className="w-full px-2">
                        <DisclosureButton className="group flex w-full items-center justify-between p-2 text-gray-400 hover:text-gray-500">
                          <span className="text-sm font-medium text-gray-900">
                            {section.name}
                          </span>
                          <span className="ml-6 flex h-7 items-center">
                            <BiChevronDown
                              aria-hidden="true"
                              className="h-5 w-5 rotate-0 transform group-data-[open]:-rotate-180"
                            />
                          </span>
                        </DisclosureButton>
                      </legend>
                      <DisclosurePanel className="px-4 pb-2 pt-4">
                        <div className="space-y-6">
                          {section.options.map((option, optionIdx) => (
                            <div
                              key={option.value}
                              className="flex items-center"
                            >
                              <input
                                defaultValue={option.value}
                                id={`${section.id}-${optionIdx}-mobile`}
                                name={`${section.id}[]`}
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label
                                htmlFor={`${section.id}-${optionIdx}-mobile`}
                                className="ml-3 text-sm text-gray-500"
                              >
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </DisclosurePanel>
                    </fieldset>
                  </Disclosure>
                ))}
              </form>
            </DialogPanel>
          </div>
        </Dialog>

        <main className="lg:mx-10 md:mx-20 mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-10 lg:max-w-full lg:px-8">
          <div className="flex items-center justify-between">
            <div className="w-auto">
              <Breadcrumbs title="Products" />
            </div>
            <div className="relative mb-6 hidden lg:block w-9/12">
              <input
                type="text"
                placeholder="Search products..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.387a1 1 0 01-1.414 1.414l-4.387-4.387zM8 14a6 6 0 100-12 6 6 0 000 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="pt-5 lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
            <aside>
              <h2 className="sr-only">Filters</h2>

              <div className="mb-6 lg:hidden flex items-center">
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="inline-flex items-center"
                >
                  <IoFunnelOutline
                    title="Filter"
                    className="ml-2 h-6 w-6 text-gray-800"
                  />
                </button>

                <div className="relative ml-4 flex-1">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.387a1 1 0 01-1.414 1.414l-4.387-4.387zM8 14a6 6 0 100-12 6 6 0 000 12z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block">
                <form className="space-y-10 divide-y divide-gray-200">
                  {filters.map((section, sectionIdx) => (
                    <div
                      key={section.name}
                      className={sectionIdx === 0 ? null : "pt-10"}
                    >
                      <fieldset>
                        <legend className="block text-sm font-medium text-gray-900">
                          {section.name}
                        </legend>
                        <div className="space-y-3 pt-6">
                          {section.options.map((option, optionIdx) => (
                            <div
                              key={option.value}
                              className="flex items-center"
                            >
                              <input
                                defaultValue={option.value}
                                id={`${section.id}-${optionIdx}`}
                                name={`${section.id}[]`}
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label
                                htmlFor={`${section.id}-${optionIdx}`}
                                className="ml-3 text-sm text-gray-600"
                              >
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </fieldset>
                    </div>
                  ))}
                </form>
              </div>
            </aside>

            {/* Product grid */}

            <div>Products Are Launcing soon Please Wait Until then</div>
          </div>
        </main>
      </div>
    </div>
  );
}

// <div className="lg:col-span-2 xl:col-span-3">
//               <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

//                 <Product
//                   _id="100005"
//                   img={"https://via.placeholder.com/150"}
//                   productName="Funny toys for babies"
//                   price="60.00"
//                   color="Mixed"
//                   badge={false}
//                   des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis."
//                 />
//                 <Product
//                   _id="100004"
//                   img={"https://via.placeholder.com/150"}
//                   productName="Funny toys for babies"
//                   price="60.00"
//                   color="Mixed"
//                   badge={false}
//                   des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis."
//                 />
//                 <Product
//                   _id="100003"
//                   img={"https://via.placeholder.com/150"}
//                   productName="cloth Basket"
//                   price="80.00"
//                   color="Mixed"
//                   badge={true}
//                   des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis."
//                 />
//                 <Product
//                   _id="100002"
//                   img={"https://via.placeholder.com/150"}
//                   productName="Smart Watch"
//                   price="250.00"
//                   color="Black"
//                   badge={true}
//                   des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis."
//                 />
//                 <Product
//                   _id="100001"
//                   img={"https://via.placeholder.com/150"}
//                   productName="Round Table Clock"
//                   price="44.00"
//                   color="Black"
//                   badge={true}
//                   des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis."
//                 />

//                 <Product
//                   _id="100003"
//                   img={"https://via.placeholder.com/150"}
//                   productName="cloth Basket"
//                   price="80.00"
//                   color="Mixed"
//                   badge={true}
//                   des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis."
//                 />
//                 <Product
//                   _id="100002"
//                   img={"https://via.placeholder.com/150"}
//                   productName="Smart Watch"
//                   price="250.00"
//                   color="Black"
//                   badge={true}
//                   des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis."
//                 />
//                 <Product
//                   _id="100001"
//                   img={"https://via.placeholder.com/150"}
//                   productName="Round Table Clock"
//                   price="44.00"
//                   color="Black"
//                   badge={true}
//                   des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis."
//                 />
//                 <Product
//                   _id="100003"
//                   img={"https://via.placeholder.com/150"}
//                   productName="cloth Basket"
//                   price="80.00"
//                   color="Mixed"
//                   badge={true}
//                   des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis."
//                 />
//                 <Product
//                   _id="100002"
//                   img={"https://via.placeholder.com/150"}
//                   productName="Smart Watch"
//                   price="250.00"
//                   color="Black"
//                   badge={true}
//                   des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis."
//                 />
//                 <Product
//                   _id="100001"
//                   img={"https://via.placeholder.com/150"}
//                   productName="Round Table Clock"
//                   price="44.00"
//                   color="Black"
//                   badge={true}
//                   des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis."
//                 />
//                 <Product
//                   _id="100003"
//                   img={"https://via.placeholder.com/150"}
//                   productName="cloth Basket"
//                   price="80.00"
//                   color="Mixed"
//                   badge={true}
//                   des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis."
//                 />
//                 <Product
//                   _id="100002"
//                   img={"https://via.placeholder.com/150"}
//                   productName="Smart Watch"
//                   price="250.00"
//                   color="Black"
//                   badge={true}
//                   des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis."
//                 />
//                 <Product
//                   _id="100001"
//                   img={"https://via.placeholder.com/150"}
//                   productName="Round Table Clock"
//                   price="44.00"
//                   color="Black"
//                   badge={true}
//                   des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis."
//                 />

//                 {/* Add more products as needed */}
//               </div>
//               <div className="mt-6">
//                 <Pagination
//                   itemsPerPage={itemsPerPage}
//                   handleItemPerPage={handleItemPerPage}
//                 />
//               </div>
//             </div>
