"use client";
import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import DragNDrop from "../../components/Shared/DragNDrop/DragNdrop";
import apiInstance from "../../plugins/axiosIns";
import BrandThunks from "../../redux/thunk/brandThunk";
import CategoryThunks from "../../redux/thunk/categoryThunk";
import { ProductServices } from "../../services/product.services";
import { isNullOrObjectEmpty } from "../../utils/utils";
import PreviousImage from "./components/PreviousImage";

export default function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formDataFile, setFormDataFile] = useState([]);
  const categoryState = useSelector((state) => state)?.categoryState;
  const brandState = useSelector((state) => state)?.brandState;
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const [updatingProduct, setUpdatingProduct] = useState({});
  const { prodId } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(CategoryThunks.fetchCategories());
    dispatch(BrandThunks.fetchBrands());
  }, [dispatch]);

  useEffect(() => {
    if (prodId) {
      fetchProduct();
    } else {
      setUpdatingProduct({});
    }
  }, []);

  const uploadProductImage = async (formData) => {
    const base =
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_BACKEND
        : process.env.REACT_APP_LOCAL_BACKEND;
    const uploadUrl = base + "files/upload-image";
    try {
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });
      if (
        (response?.status === 200 || response?.status === 201) &&
        response.ok
      ) {
        const data = await response.json();
        if (data?.length) toast.success("Image uploaded successfully");
        return await data?.data;
      } else {
        toast.error("Image upload failed");
        return;
      }
    } catch (error) {
      console.log("image upload error", error);
      toast.error("Image upload failed");
    }
  };

  const uploadProductImageToFolder = async (folder, formData) => {
    const base =
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_BACKEND
        : process.env.REACT_APP_LOCAL_BACKEND;
    const uploadUrl = base + "files/upload-to-folder/" + folder;
    try {
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });
      if (
        (response?.status === 200 || response?.status === 201) &&
        response.ok
      ) {
        const data = await response.json();
        if (data?.length) toast.success("Image uploaded successfully");
        return await data?.data;
      } else {
        toast.error("Image upload failed");
        return;
      }
    } catch (error) {
      console.log("image upload error", error);
      toast.error("Image upload failed");
    }
  };

  const addProduct = async (productData) => {
    const payload = {
      ...productData,
      price: parseInt(productData.price),
      cartoncapacity: parseInt(productData.cartoncapacity),
    };
    const url = "products/create-product";
    const response = await apiInstance.post(url, payload);
    if (response) {
      reset();
      setSelectedFiles([]);
      setFormDataFile([]);
    }
    toast.success("Product added successfully");
  };

  const onUpdateProduct = async (id, productData) => {
    const folder = productData?.image[0]?.folder || "tempFolder";
    setIsLoading(true);
    try {
      let newMergedImages = updatingProduct?.image || [];

      if (formDataFile.length > 0) {
        const formData = new FormData();
        formDataFile.forEach((image) => {
          formData.append("image", image);
        });

        const imageInfo = await uploadProductImageToFolder(folder, formData);
        newMergedImages = [...newMergedImages, ...imageInfo];
      }

      const product = { ...productData, image: newMergedImages };
      updateProduct(id, product);
      toast.success("Product updated successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (id, productData) => {
    const paylaod = {
      ...productData,
      price: parseInt(productData.price),
      cartoncapacity: parseInt(productData.cartoncapacity),
    };
    await dispatch(
      ProductServices.updateProduct(id, paylaod).then((res) => {
        if (res?.success) {
          console.log(res);
          setUpdatingProduct(res?.data);
          toast.success(res?.message);
          setIsLoading(false);
          setFormDataFile([]);
          setSelectedFiles([]);
        }
      })
    );
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formDataFile.forEach((image, i) => {
        formData.append("image", image);
      });

      const imageInfo = await uploadProductImage(formData);
      if (!imageInfo) {
        setIsLoading(false);
        toast.error("Image upload failed");
        return;
      }
      console.log("imageInfo", imageInfo);
      const product = await { ...data, image: imageInfo };
      await addProduct(product);
      await setIsLoading(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchProduct = async () => {
    const url = "products/" + prodId;
    const { data } = await apiInstance.get(url);
    setUpdatingProduct(data?.data);
    reset(data?.data);
  };

  const cat = watch("category");

  const getSubCategories = () => {
    return categoryState?.categories?.find((category) => category?._id === cat)
      ?.subCategories;
  };

  const subCat = getSubCategories() || [];

  return (
    <div className="flex flex-col p-5 bg-white rounded-lg">
      <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 className="font-medium text-black ">Add product details</h3>
      </div>
      <div className="flex flex-row gap-10">
        <div className={updatingProduct._id ? "w-8/12" : "w-full"}>
          <form
            onSubmit={
              updatingProduct?._id
                ? handleSubmit((data) =>
                    onUpdateProduct(updatingProduct?._id, data)
                  )
                : handleSubmit(onSubmit)
            }
          >
            <div className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black ">
                    Product name
                  </label>
                  <input
                    {...register("title")}
                    type="text"
                    placeholder="Enter Product name"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter  dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="w-full xl:w-1/3">
                  <label className="mb-2.5 block text-black ">Code</label>
                  <input
                    {...register("code")}
                    type="text"
                    placeholder="Enter Product Code"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter  dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="w-full xl:w-1/3">
                  <label className="mb-2.5 block text-black ">Model</label>
                  <input
                    {...register("model")}
                    type="text"
                    placeholder="Enter Product model"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter  dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black ">Price</label>
                  <input
                    {...register("price")}
                    type="number"
                    placeholder="Enter Product price"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter  dark:bg-form-input dark:focus:border-primary"
                  />
                  {errors.price && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black ">
                    Carton capacity
                  </label>
                  <input
                    {...register("cartoncapacity")}
                    type="number"
                    placeholder="Enter Product carton capacity"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter  dark:bg-form-input dark:focus:border-primary"
                  />
                  {errors.cartoncapacity && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.cartoncapacity.message}
                    </p>
                  )}
                </div>

                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black ">Unit</label>
                  <select
                    {...register("unit")}
                    className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary  dark:bg-form-input"
                  >
                    <option value="" disabled selected>
                      Select Unit
                    </option>
                    <option value="pcs">Pcs</option>
                    <option value="kg">Kg</option>
                    <option value="gm">gm</option>
                    <option value="ltr">Ltr</option>
                    <option value="ml">Ml</option>
                  </select>
                </div>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black ">Category</label>
                  <div className="relative z-20 bg-transparent dark:bg-form-input">
                    <select
                      {...register("category")}
                      className="relative w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary  dark:bg-form-input"
                      defaultValue={updatingProduct?.category?._id || ""}
                    >
                      <option value="" disabled selected>
                        Select Category
                      </option>
                      {categoryState?.categories?.map((category) => (
                        <option key={category?._id} value={category?._id}>
                          {category?.name}
                        </option>
                      ))}
                    </select>
                    <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                      <svg
                        className="fill-current"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.8">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                            fill=""
                          ></path>
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                {/* show subcategories if categories has subcategorires */}

                {subCat?.length ? (
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black ">
                      Sub Category
                    </label>
                    <select
                      {...register("subCategory")}
                      className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary  dark:bg-form-input dark:focus:border-primary"
                    >
                      <option value="" selected>
                        Select Sub Category
                      </option>
                      {subCat?.map((subCategory) => (
                        <option
                          key={subCategory?.name}
                          value={subCategory?.name}
                        >
                          {subCategory?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}

                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black ">Brand</label>
                  <select
                    {...register("brand")}
                    className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary  dark:bg-form-input dark:focus:border-primary"
                    defaultValue={updatingProduct?.brand?._id || ""}
                  >
                    <option value="" disabled selected>
                      Select Brand
                    </option>
                    {brandState?.brands?.map((brand) => (
                      <option key={brand?._id} value={brand?._id}>
                        {brand?.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block text-black ">Description</label>
                <textarea
                  {...register("description")}
                  rows={6}
                  placeholder="Type your message"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter  dark:bg-form-input dark:focus:border-primary"
                ></textarea>
              </div>

              <DragNDrop
                setFormDataFile={setFormDataFile}
                selectedImages={selectedFiles}
                setSelectedImages={setSelectedFiles}
              />

              {!isLoading ? (
                <input
                  disabled={isLoading}
                  type="submit"
                  value={
                    updatingProduct?._id ? "Update Product" : "Add Product"
                  }
                  className="btn btn-secondary btn-md"
                />
              ) : (
                <button className="btn">
                  <span className="loading loading-spinner"></span>
                  {updatingProduct?._id
                    ? "Updating Product..."
                    : "Adding Product..."}
                </button>
              )}
            </div>
          </form>
        </div>
        {isNullOrObjectEmpty(updatingProduct) ? null : (
          <div className="w-3/12 border-l-2">
            <div className="p-3">
              <PreviousImage
                setUpdatingProduct={setUpdatingProduct}
                updatingProduct={updatingProduct}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
