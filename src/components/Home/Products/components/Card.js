import React from "react";
import { getImageUrl } from "../../../../utils/utils";

// {
//     "tags": [],
//     "status": "active",
//     "_id": "65c7b68fcc46cd3a28cfe9fd",
//     "title": "steel water tap",
//     "description": "water tap made of steel metal",
//     "image": [
//         {
//             "_id": "65c7b68fcc46cd3a28cfe9fe",
//             "encoding": "7bit",
//             "imageUrl": "images/1707587214438_830299363.jpg",
//             "destination": "images/",
//             "filename": "1707587214438_830299363.jpg",
//             "path": "images/1707587214438_830299363.jpg",
//             "size": 26212
//         }
//     ],
//     "price": 7584,
//     "category": {
//         "_id": "65c7b4c7cc46cd3a28cfe9ba",
//         "name": "Metal",
//         "description": "this is metal product",
//         "createdAt": "2024-02-10T17:39:19.687Z",
//         "updatedAt": "2024-02-10T17:39:19.687Z",
//         "__v": 0
//     },
//     "model": "LUX-877",
//     "brand": {
//         "_id": "65c7b6e0cc46cd3a28cfea12",
//         "name": "Elegant",
//         "description": "this is elegant brand a branch of classic group",
//         "createdAt": "2024-02-10T17:48:16.658Z",
//         "updatedAt": "2024-02-10T17:48:16.658Z",
//         "__v": 0
//     },
//     "cartoncapacity": 123,
//     "createdAt": "2024-02-10T17:46:55.252Z",
//     "updatedAt": "2024-02-10T17:49:25.543Z",
//     "__v": 1
// },

const Card = ({ product }) => {
  const { _id, title, price, image, category, brand, cartoncapacity } = product;
  const thumbnail = getImageUrl(image[0]?.filename);

  return (
    <div>
      <div className="group relative block h-96 overflow-hidden rounded-t-lg bg-gray-100 cursor-pointer">
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
