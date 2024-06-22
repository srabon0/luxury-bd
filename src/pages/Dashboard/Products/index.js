import {
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Pagination from "../../../components/Shared/Pagination/Pagination";
import fetchBrands from "../../../redux/thunk/fetchBrands";
import fetchCategories from "../../../redux/thunk/fetchCategories";
import { ProductServices } from "../../../services/product.services";
import ProductTable from "./Table";

const initPageMeta = {
  page: 1,
  limit: 10,
  totalCounts: 0,
};

const Product = () => {
  const navigate = useNavigate();
  const [respMeta, setRespMeta] = useState(initPageMeta);
  const [products, setProducts] = useState([{}]);
  const [isLoading, setIsLoading] = useState(false);
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const [filterProps, setFilterProps] = useState({
    category: query.get("category"),
    brand: query.get("brand"),
    search: query.get("search"),
  });
  const { categoryState, brandState } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchBrands());
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filterProps]);

  const fetchProducts = async () => {
    setIsLoading(true);
    const paylaod = {
      page: filterProps?.page || 1,
      limit: filterProps?.limit || 10,
      search: filterProps?.search || "",
      category: filterProps?.category || null,
      brand: filterProps?.brand || null,
    };
    const data = await ProductServices.fetchProducts(paylaod);
    if (data) {
      console.log("payload", data);
      setProducts(data?.data);
      setRespMeta(data?.meta);
    }
    setIsLoading(false);
  };

  const onchangeInput = (e) => {
    setFilterProps({ ...filterProps, search: e.target.value });
  };

  const onSelectOption = (e) => {
    setFilterProps({ ...filterProps, [e.target.name]: e.target.value });
  };

  const handlePaginationChange = (type, value) => {
    setFilterProps((prev) => {
      if (type === "page") {
        return { ...prev, page: Number(value) };
      } else if (type === "item") {
        return { ...prev, limit: Number(value) };
      }
      return prev;
    });
  };

  const enableEdit = (data) => {
    navigate("/dashboard/edit-product/" + data._id);
  };

  if (isLoading && products?.length === 0) {
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
      <div className="flex justify-between items-center mb-3 border-b-2 py-2 gap-1">
        <label className="input input-bordered flex items-center gap-2 w-2/3">
          <MagnifyingGlassIcon className="w-6 h-6" />
          <input
            onChange={onchangeInput}
            value={filterProps?.search}
            type="text"
            className="grow"
            placeholder="Search Product"
          />
          {filterProps?.search?.length > 0 && (
            <XMarkIcon
              onClick={() => setFilterProps({ ...filterProps, search: "" })}
              className="w-6 h-6 cursor-pointer"
            />
          )}
        </label>

        <select
          name="category"
          onChange={onSelectOption}
          className="select select-bordered w-full max-w-xs"
          defaultValue={filterProps?.category}
        >
          <option value={""} selected>
            All Categories
          </option>
          {categoryState?.categories?.map((category) => (
            <option value={category?._id} key={category._id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          name="brand"
          onChange={onSelectOption}
          className="select select-bordered w-full max-w-xs"
          defaultValue={filterProps?.brand}
        >
          <option value={""} selected>
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
