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
      className=" bg-white shadow-md rounded-xl duration-500 hover:scale-102 hover:shadow-xl"
    >
      <div>
        <img
          src={getImageUrl(item?.image?.[0]?.imageUrl)}
          alt="Product"
          className="h-80 w-[352px] object-cover rounded-t-xl"
        />
        <div className="px-4 py-3">
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
  // return (
  //   <div
  //     onClick={navigateToDetails}
  //     className="border border-1 border-gray-300 rounded-md"
  //   >
  //     <div className="group relative block h-80 overflow-hidden bg-gray-100">
  //       <img
  //         src={getImageUrl(item?.image?.[0]?.imageUrl)}
  //         loading="lazy"
  //         alt="Photo by Rachit Tank"
  //         className="h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
  //       />

  //       {/* <span className="absolute left-0 top-0 rounded-br-lg bg-red-500 px-3 py-1.5 text-sm uppercase tracking-wider text-white">
  //         sale
  //       </span> */}
  //     </div>

  //     <div className="flex items-start justify-between rounded-b-lg bg-gray-100 p-4">
  //       <div className="flex flex-col">
  //         <div className="font-bold text-gray-800 transition duration-100 hover:text-gray-500 lg:text-lg">
  //           {item?.title}
  //         </div>
  //         <span className="text-sm text-gray-500 lg:text-base">
  //           by {item?.brand?.name}
  //         </span>
  //         <span>
  //           {item?.category?.name} - {item?.cartoncapacity} pcs
  //         </span>
  //       </div>

  //       <div className="flex flex-col items-end">
  //         <span className="font-bold text-gray-600 lg:text-lg">
  //           &#2547;{item?.price}
  //         </span>
  //         {item?.product?.offer && (
  //           <span className="text-sm text-red-500 line-through">
  //             &#2547;{item?.product?.offer?.priceAfterOffer}
  //           </span>
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default SingleGrid;
