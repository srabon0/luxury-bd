import React, { useEffect, useRef, useState } from "react";

import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useLocation, useSearchParams } from "react-router-dom";
import Pagination from "../../../components/Shared/Pagination/Pagination";
import { ProductSerdcvices } from "../../../services/product.services";
import Filter from "./components/Filter";
import ProductsGrid from "./components/ProductsGrid";

const removeNullValuesFromRequest = (obj) => {
  for (const key in obj) {
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    }
  }
};

const AllProductsWIthFilter = () => {
  const [products, setProducts] = useState([{}]);
  const [isLoading, setIsLoading] = useState(false);
  const { search } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = new URLSearchParams(search);
  const [filterProps, setFilterProps] = useState({
    categoryId: query.get("categoryId"),
    brandId: query.get("brandId"),
    search: query.get("search"),
  });

  const initialRender = useRef(true);

  useEffect(() => {
    setFilterProps({
      categoryId: query.get("categoryId"),
      brandId: query.get("brandId"),
      search: query.get("search"),
    });
  }, [search]);

  const updateURLParameters = () => {
    for (const key in filterProps) {
      if (filterProps[key]) {
        searchParams.set(key, filterProps[key]);
      } else {
        searchParams.delete(key);
      }
    }
  };
  const fetchSearchedProducts = async () => {
    setIsLoading(true);
    removeNullValuesFromRequest(filterProps);

    ProductSerdcvices.searchProducts(filterProps)
      .then((data) => {
        setProducts(data?.products);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      });
  };

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      updateURLParameters();
      fetchSearchedProducts();
    }
  }, [filterProps]);

  const onchangeInput = (e) => {
    const params = new URLSearchParams(search);
    if (e.target.value.trim() !== "") {
      params.set("search", e.target.value);
    } else {
      params.delete("search");
    }
    setFilterProps({ ...filterProps, search: e.target.value });
    setSearchParams(params);
  };

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Page content here */}
        <div className="flex justify-between items-center mx-3 lg:hidden">
          <label className="input input-bordered flex items-center gap-2">
            <input
              onChange={onchangeInput}
              value={searchParams?.get("search") || ""}
              type="text"
              className="grow"
              placeholder="Search"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
          <label
            htmlFor="my-drawer-2"
            className="btn btn-base-200 btn-square drawer-button lg:hidden"
          >
            <FunnelIcon className="w-6 h-6 text-blue-400" />
          </label>
        </div>

        {
          /* Products */
          isLoading && products?.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="rounded-md h-12 w-12 border-4 border-t-4 border-blue-500 animate-spin absolute"></div>
            </div>
          ) : (
            <div className="px-2 mx-auto">
              <ProductsGrid products={products} />

              <Pagination
                currentPage={15}
                itemsPerPage={10}
                onPageChange={(page) => console.log(page)}
                totalItems={100}
              />
            </div>
          )
        }
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-100 p-4 w-80 min-h-full border border-l-0 border-t-0 border-b-0 border-r-2 border-gray-300  text-base-content">
          <div className="flex justify-end">
            <label
              htmlFor="my-drawer-2"
              className="btn btn-base-200 btn-square drawer-button lg:hidden"
            >
              <XMarkIcon className="w-6 h-6 text-blue-400" />
            </label>
          </div>
          {/* Sidebar content here */}
          <Filter filterProps={filterProps} setFilterProps={setFilterProps} />
        </ul>
      </div>
    </div>
  );
};

export default AllProductsWIthFilter;
