import { PlusIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../components/Shared/Pagination/Pagination";
import { ProductSerdcvices } from "../../../services/product.services";
import ProductTable from "./Table";

const initPageMeta = {
  page: 1,
  count: 5,
};

const Product = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [respMeta, setRespMeta] = useState(initPageMeta);
  const [searchKey, setSearchKey] = useState("");

  const enableEdit = (data) => {
    navigate("/dashboard/edit-product/" + data._id);
  };
  const fethProducts = () => {
    ProductSerdcvices.fetchProducts(respMeta?.page, respMeta?.count, searchKey)
      .then((data) => {
        setProducts(data?.products);
        setRespMeta(data?.meta);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fethProducts();
  }, [respMeta?.page, respMeta?.count, searchKey]);

  const handlePaginationChange = (type, value) => {
    if (type === "page") {
      setRespMeta((prev) => ({ ...prev, page: value }));
    } else if (type === "item") {
      setRespMeta((prev) => ({ ...prev, count: value }));
    }
  };

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
      <ProductTable products={products} enableEdit={enableEdit}>
        <Pagination paginate={handlePaginationChange} meta={respMeta} />
      </ProductTable>
    </div>
  );
};

export default Product;
