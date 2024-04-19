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
      className="border border-1 border-gray-300 rounded-md"
    >
      <div className="group relative block h-80 overflow-hidden bg-gray-100">
        <img
          src={getImageUrl(item?.image?.[0]?.imageUrl)}
          loading="lazy"
          alt="Photo by Rachit Tank"
          className="h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
        />

        {/* <span className="absolute left-0 top-0 rounded-br-lg bg-red-500 px-3 py-1.5 text-sm uppercase tracking-wider text-white">
          sale
        </span> */}
      </div>

      <div className="flex items-start justify-between rounded-b-lg bg-gray-100 p-4">
        <div className="flex flex-col">
          <div className="font-bold text-gray-800 transition duration-100 hover:text-gray-500 lg:text-lg">
            {item?.title}
          </div>
          <span className="text-sm text-gray-500 lg:text-base">
            by {item?.brand?.name}
          </span>
          <span>
            {item?.category?.name} - {item?.cartoncapacity} pcs
          </span>
        </div>

        <div className="flex flex-col items-end">
          <span className="font-bold text-gray-600 lg:text-lg">
            &#2547;{item?.price}
          </span>
          {item?.product?.offer && (
            <span className="text-sm text-red-500 line-through">
              &#2547;{item?.product?.offer?.priceAfterOffer}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleGrid;
