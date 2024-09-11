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
// import Pagination from "../../components/pageProps/shopPage/Pagination";
import Pagination from "../../components/Pagination/Pagination";
import { useGetBrandsQuery } from "../../redux/features/brand/brandApi";
import { useGetCategoriesQuery } from "../../redux/features/categories/categoryApi";
import { useGetProductsQuery } from "../../redux/features/product/productApi";
import { useDebounced } from "../../redux/hook";
import { getImageUrl } from "../../utils";
import SingleSelectFilter from "./SIngleSelectFilter";

const ProductGrid = ({ productData }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
      {productData?.data?.data?.map((product) => (
        <Product
          key={product._id}
          _id={product._id}
          img={getImageUrl(product?.image[0]?.imageUrl)}
          productName={product?.title}
          price={product?.price}
          badge={false}
          category={product?.category?.name}
          subCategory={product?.subCategory}
          brand={product?.brand?.name}
          des={product?.description}
          cartoncapacity={product?.cartoncapacity}
          unit={product?.unit}
        />
      ))}
    </div>
  );
};

export default function Shop() {
  // const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const debouncedSearchTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 1000,
  });
  const [query, setQuery] = useState({});

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handleSizeChange = (size) => {
    setSize(size);
  };

  const handleBrandChange = (brand) => {
    if (selectedBrand === brand) {
      setSelectedBrand(null);
      return;
    }
    setSelectedBrand(brand);
    setPage(1);
  };

  const handleCategoryChange = (category) => {
    if (selectedCat === category) {
      setSelectedCat(null);
      return;
    }
    setSelectedCat(category);
    setPage(1);
  };

  useEffect(() => {
    setQuery({
      limit: size,
      page: page,
      searchTerm: debouncedSearchTerm,
      category: selectedCat,
      brand: selectedBrand,
    });
  }, [size, page, debouncedSearchTerm, selectedCat, selectedBrand]);

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

  const {
    data: productData,
    error: productError,
    isLoading: productLoading,
  } = useGetProductsQuery({
    ...Object.fromEntries(Object.entries(query).filter(([_, v]) => v != null)),
  });

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

  if (brandLoading || catLoading || productLoading) return <FullScreenLoader />;
  if (brandError || catError || productError)
    return <div>Error loading data</div>;

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
                          <SingleSelectFilter
                            options={
                              filters.find((filter) => filter.id === "brand")
                                .options
                            }
                            label={"Brand"}
                            selectedOption={selectedBrand}
                            handleSelect={handleBrandChange}
                            filterId="brand"
                          />
                        </div>
                        <div className="pt-4">
                          <SingleSelectFilter
                            options={
                              filters.find((filter) => filter.id === "category")
                                .options
                            }
                            label={"Category"}
                            selectedOption={selectedCat}
                            handleSelect={handleCategoryChange}
                            filterId="category"
                          />
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
                onKeyUp={handleInputChange}
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
                    onKeyUp={handleInputChange}
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
                  <div className="space-y-6">
                    <SingleSelectFilter
                      options={
                        filters.find((filter) => filter.id === "brand").options
                      }
                      label={"Brand"}
                      selectedOption={selectedBrand}
                      handleSelect={handleBrandChange}
                      filterId="brand"
                    />
                  </div>
                  <div className="pt-4">
                    <SingleSelectFilter
                      options={
                        filters.find((filter) => filter.id === "category")
                          .options
                      }
                      label={"Category"}
                      selectedOption={selectedCat}
                      handleSelect={handleCategoryChange}
                      filterId="category"
                    />
                  </div>
                </form>
              </div>
            </aside>

            {/* Product grid */}
            <div className="lg:col-span-2 xl:col-span-3">
              <ProductGrid productData={productData} />
              <div className="flex justify-center lg:col-span-2 xl:col-span-3 mx-auto">
                <Pagination
                  meta={productData?.data?.meta}
                  onPageChange={handlePageChange}
                  onSizeChange={handleSizeChange}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
