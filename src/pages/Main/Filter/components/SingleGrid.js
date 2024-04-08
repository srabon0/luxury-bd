import React from "react";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../../../utils/utils";
const SingleGrid = ({ item }) => {
  const navigate = useNavigate();

  const navigateToDetails = () => {
    navigate(`/product/${item?._id}`);
  };
  return (
    <div onClick={navigateToDetails}>
      <div className="group relative mb-2 block h-80 overflow-hidden rounded-lg bg-gray-100 lg:mb-3">
        <img
          src={getImageUrl(item?.image?.[0]?.filename)}
          loading="lazy"
          alt="Photo by Rachit Tank"
          className="h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
        />

        {/* <span className="absolute left-0 top-0 rounded-br-lg bg-red-500 px-3 py-1.5 text-sm uppercase tracking-wider text-white">
          sale
        </span> */}
      </div>

      <div>
        <div className="hover:gray-800 mb-1 text-gray-500 transition duration-100 lg:text-lg">
          {item?.title}
        </div>

        <div className="flex items-end gap-2">
          {/* <span className="font-bold text-gray-800 lg:text-lg">$15.00</span>
          <span className="mb-0.5 text-red-500 line-through">$30.00</span> */}
        </div>
      </div>
    </div>
  );
};

export default SingleGrid;
