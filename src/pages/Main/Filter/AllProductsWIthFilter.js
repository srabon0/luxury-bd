import React, { useEffect, useRef, useState } from "react";

import { useLocation, useSearchParams } from "react-router-dom";
import { ProductSerdcvices } from "../../../services/product.services";
import Filter from "./components/Filter";
import ProductsGrid from "./components/ProductsGrid";
import Pagination from "../../../components/Shared/Pagination/Pagination";

const removeNullValuesFromRequest = (obj) => {
  for (const key in obj) {
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    }
  }
};

const AllProductsWIthFilter = () => {
  const [products, setProducts] = useState([{}]);
  const { search } = useLocation();
  const [searchParams] = useSearchParams();
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
    removeNullValuesFromRequest(filterProps);

    ProductSerdcvices.searchProducts(filterProps)
      .then((data) => {
        console.log(data);
        setProducts(data?.products);
      })
      .catch((error) => {
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

  return (
    <section>
      {" "}
      {/* Container */}{" "}
      <div className="mx-auto w-full px-5  md:px-10">
        {" "}
        {/* Component */}{" "}
        <div className="flex flex-col gap-12">
          <div className="grid gap-10 md:gap-12 lg:grid-cols-[max-content_1fr]">
            {" "}
            {/* Filters */}
            <Filter setFilterProps={setFilterProps} />
            {/* Decor */}{" "}
            <div className="w-full">
              <ProductsGrid products={products} />

              <Pagination
                currentPage={15}
                itemsPerPage={10}
                onPageChange={(page) => console.log(page)}
                totalItems={100}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllProductsWIthFilter;
