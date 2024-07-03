import { StarIcon, TagIcon } from "@heroicons/react/16/solid";
import { ShoppingBagIcon } from "@heroicons/react/24/solid";
import React from "react";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../../../utils/utils";
const SingleGrid = ({ item }) => {
  const navigate = useNavigate();

  const navigateToDetails = () => {
    navigate(`/product/${item?._id}`);
  };

  return (
    <div
      onClick={navigateToDetails}
      className="shadow-md rounded-xl duration-500 hover:scale-102 hover:shadow-lg"
    >
      <div>
        <img
          src={getImageUrl(item?.image?.[0]?.imageUrl)}
          alt="Product"
          data-aos="zoom-in"
          data-offset="100"
          data-aos-delay="100"
          className="h-64 rounded-t-xl w-full object-cover object-center"
        />
        <div className="px-5 py-2 bg-violet-50">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 mr-3 uppercase text-xs flex gap-1 mb-1">
              <TagIcon className="w-4 h-4" /> {item?.category?.name}
            </span>
            <span className="flex items-center">
              <StarIcon className="w-4 h-4 text-yellow-400" />
              <StarIcon className="w-4 h-4 text-yellow-400" />
              <StarIcon className="w-4 h-4 text-yellow-400" />
              <StarIcon className="w-4 h-4 text-yellow-400" />
              <StarIcon className="w-4 h-4 text-yellow-400" />
            </span>
          </div>
          <p className="text-lg font-bold text-black truncate block capitalize">
            {item?.title}
          </p>
          <div className="flex items-center">
            <p className="text-lg font-semibold text-black cursor-auto my-3">
              &#2547;{item?.price}
            </p>
            {item?.product?.offer && (
              <del>
                <p className="text-sm text-gray-600 cursor-auto ml-2">
                  {item?.product?.offer?.priceAfterOffer}
                </p>
              </del>
            )}
            <div className="ml-auto">
              <ShoppingBagIcon
                onClick={() => console.log("Add to cart")}
                title="Add to cart"
                className="h-6 w-6 text-gray-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleGrid;
