import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "../../../components/Shared/Pagination/Pagination";
import { ProductSerdcvices } from "../../../services/product.services";
import ProductTable from "./Table";

const initPageMeta = {
  page: 1,
  count: 5,
};

const removeNullValuesFromRequest = (obj) => {
  for (const key in obj) {
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    }
  }
};

const Product = () => {
  const navigate = useNavigate();
  const [debounceTimeoutId, setDebounceTimeoutId] = useState(null);

  const [respMeta, setRespMeta] = useState(initPageMeta);
  const [products, setProducts] = useState([{}]);
  const [isLoading, setIsLoading] = useState(false);
  const { search } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = new URLSearchParams(search);
  const [filterProps, setFilterProps] = useState({
    categoryId: query.get("categoryId"),
    brandId: query.get("brandId"),
    search: query.get("search"),
    page: respMeta?.page,
    count: respMeta?.count,
  });

  const { categoryState, brandState } = useSelector((state) => state);

  const initialRender = useRef(true);

  useEffect(() => {
    setFilterProps({
      categoryId: query.get("categoryId"),
      brandId: query.get("brandId"),
      search: query.get("search"),
    });
  }, [search]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      updateURLParameters();
    }
  }, []);

  useEffect(() => {
    if (!initialRender.current) {
      clearTimeout(debounceTimeoutId);
      const id = setTimeout(fetchSearchedProducts, 500); // delay of 500ms
      setDebounceTimeoutId(id);
    }
  }, [filterProps]);

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
    console.log(filterProps);
    ProductSerdcvices.searchProducts(filterProps)
      .then((data) => {
        setProducts(data?.products);
        setRespMeta(data?.meta);

        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      });
  };

  // ...

  // ...
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

  const onSelectOption = (e) => {
    const params = new URLSearchParams(search);
    if (e.target.value) {
      params.set(e.target.name, e.target.value);
    } else {
      params.delete(e.target.name);
    }
    setFilterProps({ ...filterProps, [e.target.name]: e.target.value });
    setSearchParams(params);
  };

  const handlePaginationChange = (type, value) => {
    setFilterProps((prev) => {
      if (type === "page") {
        return { ...prev, page: Number(value) };
      } else if (type === "item") {
        return { ...prev, count: Number(value) };
      }
      return prev;
    });
  };

  const enableEdit = (data) => {
    navigate("/dashboard/edit-product/" + data._id);
  };

  if (isLoading && products.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="rounded-md h-12 w-12 border-4 border-t-4 border-blue-500 animate-spin absolute"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center py-2">
        <h2>Product List</h2>
        <button
          onClick={() => navigate("/dashboard/add-product")}
          className="btn btn-sm"
        >
          <PlusIcon className="h-5 w-5" /> Add Product
        </button>
      </div>
      <div className="flex justify-between items-center mb-3 border-b-2 py-2">
        <label className="input input-bordered flex items-center gap-2">
          <MagnifyingGlassIcon className="w-6 h-6" />
          <input
            onChange={onchangeInput}
            value={searchParams?.get("search") || ""}
            type="text"
            className="grow"
            placeholder="Search Product"
          />
        </label>

        <select
          name="categoryId"
          onChange={onSelectOption}
          className="select select-bordered w-full max-w-xs"
          defaultValue={filterProps?.categoryId}
        >
          <option value={null} selected>
            All Categories
          </option>
          {categoryState?.categories?.map((category) => (
            <option value={category?._id} key={category._id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          name="brandId"
          onChange={onSelectOption}
          className="select select-bordered w-full max-w-xs"
          defaultValue={filterProps?.brandId}
        >
          <option value={null} selected>
            All Brands
          </option>
          {brandState?.brands?.map((brand) => (
            <option value={brand?._id} key={brand._id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>
      <ProductTable
        setProducts={setProducts}
        products={products}
        enableEdit={enableEdit}
      >
        <Pagination paginate={handlePaginationChange} meta={respMeta} />
      </ProductTable>
    </div>
  );
};

export default Product;
