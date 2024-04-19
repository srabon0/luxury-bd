import {
  ArchiveBoxArrowDownIcon,
  TagIcon,
  TruckIcon,
  ViewfinderCircleIcon,
} from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProductSerdcvices } from "../../services/product.services";
import { getImageUrl } from "../../utils/utils";
import ImageZoom from "./ImageZoom";
import "./ImageZoom.css"; // Import the CSS file

import { toast } from "react-toastify";
import ProductDetailsSkeleton from "./ProductDetailsSkeleton";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [activeImage, setActiveImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const getProduct = async () => {
    try {
      setIsLoading(true);
      ProductSerdcvices.fetchProductById(id).then((data) => {
        const imgs = createImageUrls(data?.image);
        data.image = imgs;
        setProduct(data);
        setIsLoading(false);
      });
    } catch (error) {
      toast.error("Failed to fetch product details");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  const createImageUrls = (images) => {
    return images?.map((img) => {
      return getImageUrl(img?.imageUrl);
    });
  };

  const swapWithActiveImage = (index) => {
    setProduct((prev) => {
      return {
        ...prev,
        image: product?.image,
      };
    });
    setActiveImage(index);
  };

  const renderImages = () => {
    return product?.image?.map((img, index) => {
      return (
        <div
          key={index}
          className="overflow-hidden rounded-lg bg-gray-100"
          onClick={() => swapWithActiveImage(index)}
        >
          <img
            src={img}
            loading="lazy"
            alt="product photo"
            className="h-full w-full object-cover object-center"
          />
        </div>
      );
    });
  };

  if (isLoading && !product?.length) return <ProductDetailsSkeleton />;

  return (
    <div className="bg-white py-6 sm:py-8 lg:py-12">
      <div className="mx-auto max-w-screen-lg px-4 md:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg bg-gray-100">
              <ImageZoom
                src={product?.image?.[activeImage]}
                alt="selected product photo"
              />

              {/* <span className="absolute left-0 top-0 rounded-br-lg bg-red-500 px-3 py-1.5 text-sm uppercase tracking-wider text-white">
                sale
              </span> */}
            </div>
            <div class="grid grid-cols-2 gap-4">{renderImages()}</div>
          </div>

          <div className="md:py-8">
            <div className="mb-2 md:mb-3">
              <span className="mb-0.5 inline-block text-gray-500">
                {product?.brand?.name}
              </span>
              <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl">
                {product?.title}
              </h2>
            </div>

            <div className="mb-4">
              <div className="flex items-end gap-2">
                {product?.price && (
                  <span className="text-xl font-bold text-gray-800 md:text-2xl">
                    ৳&nbsp; {product?.price}
                  </span>
                )}
                {/* <span className="mb-0.5 text-red-500 line-through">$30.00</span> */}
              </div>

              <span className="text-sm text-gray-500">
                incl. VAT plus shipping
              </span>
            </div>

            <div className="mb-6 flex items-center gap-2 text-gray-500">
              <TruckIcon className="h-6 w-6" />
              <span className="text-sm">2-4 day shipping</span>
            </div>
            <div className="mb-6 flex items-center gap-2 text-gray-500">
              <ArchiveBoxArrowDownIcon className="h-6 w-6" />

              <span className="text-sm">
                {product?.cartoncapacity} per cartoon
              </span>
            </div>
            <div className="mb-6 flex items-center gap-2 text-gray-500">
              <TagIcon className="h-6 w-6" />
              <span className="text-sm">{product?.category?.name}</span>
            </div>
            <div className="mb-6 flex items-center gap-2 text-gray-500">
              <ViewfinderCircleIcon className="h-6 w-6" />
              <span className="text-sm">{product?.model}</span>
            </div>

            <div className="flex gap-2.5">
              <button className="inline-block flex-1 rounded-lg bg-indigo-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 sm:flex-none md:text-base">
                Add to cart
              </button>

              <button className="inline-block rounded-lg bg-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-500 outline-none ring-indigo-300 transition duration-100 hover:bg-gray-300 focus-visible:ring active:text-gray-700 md:text-base">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>

            <div className="mt-10 md:mt-16 lg:mt-20">
              <div className="mb-3 text-lg font-semibold text-gray-800">
                Description
              </div>
              <p className="text-gray-500">{product?.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
