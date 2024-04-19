import React from "react";
import { getImageUrl } from "../../../../utils/utils";
import { useNavigate } from "react-router-dom";


const Card = ({ product }) => {
  const { _id, title, price, image, category, brand, cartoncapacity } = product;
  const thumbnail = getImageUrl(image[0]?.imageUrl);
  const navigate = useNavigate();

  const navigateToDetails = () => {
    navigate(`/product/${_id}`);
  };

  return (
    <div className="border border-1 border-gray-300 rounded-lg">
      <div
        onClick={navigateToDetails}
        className="group relative block h-96 overflow-hidden rounded-t-lg bg-gray-100 cursor-pointer"
      >
        <img
          src={thumbnail}
          alt={title + _id}
          className="h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
        />

        {product?.offer && (
          <span className="absolute left-0 top-3 rounded-r-lg bg-red-500 px-3 py-1.5 text-sm font-semibold uppercase tracking-wider text-white">
            -50%
          </span>
        )}
      </div>

      <div className="flex items-start justify-between gap-2 rounded-b-lg bg-gray-100 p-4">
        <div className="flex flex-col">
          <div className="font-bold text-gray-800 transition duration-100 hover:text-gray-500 lg:text-lg">
            {title}
          </div>
          <span className="text-sm text-gray-500 lg:text-base">
            by {brand?.name}
          </span>
          <span>
            {category?.name} - {cartoncapacity} pcs
          </span>
        </div>

        <div className="flex flex-col items-end">
          <span className="font-bold text-gray-600 lg:text-lg">
            &#2547;{price}
          </span>
          {product?.offer && (
            <span className="text-sm text-red-500 line-through">
              &#2547;{product?.offer?.priceAfterOffer}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
