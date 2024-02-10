import { PlusIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../components/Shared/Pagination/Pagination";
import fetchProducts from "../../../redux/thunk/fetchProducts";
import ProductTable from "./Table";

const Product = () => {
  const navigate = useNavigate();
  const [searchKey, setSearchKey] = useState("");
  const itemsPerPage = useSelector((state) => state.productState.itemsPerPage);
  const totalItems = useSelector((state) => state.productState.totalItems);
  const currentPage = useSelector((state) => state.productState.pageNo);

  const dispatch = useDispatch();

  const enableEdit = (data) => {
    navigate("/dashboard/edit-product/" + data._id);
  };

  useEffect(() => {
    if (searchKey) {
      dispatch(fetchProducts(currentPage, itemsPerPage, searchKey));
    } else {
      dispatch(fetchProducts(currentPage, itemsPerPage));
    }
  }, [dispatch, currentPage, itemsPerPage, searchKey]);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2>Add Product</h2>
        <button
          onClick={() => navigate("/dashboard/add-product")}
          className="btn btn-primary btn-sm"
        >
          <PlusIcon className="h-5 w-5 text-white" /> Add Product
        </button>
      </div>
      <div className="flex justify-between items-center mb-3  border-b-2">
        <input
          onChange={(e) => setSearchKey(e.target.value)}
          type="text"
          placeholder="Search Product"
          className="w-1/2 rounded border-[1.5px] my-4 border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
        />
      </div>
      <ProductTable enableEdit={enableEdit}>
        {/* <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          currentPage={currentPage}
        /> */}
      </ProductTable>
    </div>
  );
};

export default Product;
