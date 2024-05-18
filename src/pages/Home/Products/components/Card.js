import {
  ArchiveBoxArrowDownIcon,
  CubeTransparentIcon,
  StarIcon,
  TagIcon,
} from "@heroicons/react/16/solid";
import React from "react";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../../../utils/utils";
const Card = ({ product }) => {
  const {
    _id,
    title,
    price,
    image,
    category,
    brand,
    cartoncapacity,
    description,
  } = product;
  const thumbnail = getImageUrl(image[0]?.imageUrl) ;
  const navigate = useNavigate();

  const navigateToDetails = () => {
    navigate(`/product/${_id}`);
  };

  return (
    <div
      onClick={navigateToDetails}
      className="p-5 py-10 bg-purple-50 text-center transform duration-500 hover:-translate-y-2 cursor-pointer rounded-md"
    >
      <img className="w-full" src={thumbnail} alt={title + _id} />
      <div className="space-x-1 flex justify-center mt-10">
        <StarIcon className="h-5 text-orange-500" />
        <StarIcon className="h-5 text-orange-500" />
        <StarIcon className="h-5 text-orange-500" />
        <StarIcon className="h-5 text-orange-500" />
        <StarIcon className="h-5 text-orange-500" />
      </div>
      <h1 className="text-xl my-5">{title}</h1>
      <h4 className="flex gap-2 justify-center items-center">
        <span className="flex items-center gap-1">
          <TagIcon className="h-5 text-purple-500" /> <span>{category?.name}</span>
        </span>
        <span className="flex items-center gap-1">
          <CubeTransparentIcon className="h-5 text-purple-500" />{" "}
          <span>{brand?.name}</span>
        </span>
        <span className="flex items-center gap-1">
          <ArchiveBoxArrowDownIcon className="h-5 text-purple-500" />{" "}
          <span>{cartoncapacity} pcs</span>
        </span>
      </h4>
      <p className="truncate overflow-hidden">{description}</p>
      {price && <h2 className="mt-5 mb-3 text-lg font-bold">&#2547; {price}</h2>}
      <button className="p-2 px-6 bg-purple-500 text-white rounded-md hover:bg-purple-600">
        Add To Cart
      </button>
    </div>
  );

  // return (
  //   <div className="border border-1 border-gray-300 rounded-lg">
  //     <div
  //       onClick={navigateToDetails}
  //       className="group relative block h-96 overflow-hidden rounded-t-lg bg-gray-100 cursor-pointer"
  //     >
  //       <img
  //         src={thumbnail}
  //         alt={title + _id}
  //         className="h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
  //       />

  //       {product?.offer && (
  //         <span className="absolute left-0 top-3 rounded-r-lg bg-red-500 px-3 py-1.5 text-sm font-semibold uppercase tracking-wider text-white">
  //           -50%
  //         </span>
  //       )}
  //     </div>

  //     <div className="flex items-start justify-between gap-2 rounded-b-lg bg-gray-100 p-4">
  //       <div className="flex flex-col">
  //         <div className="font-bold text-gray-800 transition duration-100 hover:text-gray-500 lg:text-lg">
  //           {title}
  //         </div>
  //         <span className="text-sm text-gray-500 lg:text-base">
  //           by {brand?.name}
  //         </span>
  //         <span>
  //           {category?.name} - {cartoncapacity} pcs
  //         </span>
  //       </div>

  //       <div className="flex flex-col items-end">
  //         <span className="font-bold text-gray-600 lg:text-lg">
  //           &#2547;{price}
  //         </span>
  //         {product?.offer && (
  //           <span className="text-sm text-red-500 line-through">
  //             &#2547;{product?.offer?.priceAfterOffer}
  //           </span>
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default Card;
