import React from "react";
import { Link } from "react-router-dom";
import "../../assests/styles/style.css";

const NewArrivalCard = ({ data, img }) => {
  const { title, bg, category, _id } = data;
  return (
    <Link to={`/products/${_id}`}>
      <div
        className="w-full h-full flex justify-between items-center rounded px-6 py-4 lg:my-2 product"
        style={{ backgroundColor: `${bg}` }}
      >
        <div>
          <h3 className="font-bold text-lg">{title}</h3>
          <div className="flex gap-2 text-xs">
            <span className="font-bold">Category:</span>
            <span>{category?.name}</span>
          </div>
          {category?.subCategory?.length > 0 && (
            <div className="flex gap-2 text-xs">
              <span className="font-bold">Subclass:</span>
              <span>
                {category?.subCategory?.map((sub) => sub.name).join(", ")}
              </span>
            </div>
          )}
          {/* <h2 className="text-xl mt-2">BDT {price}</h2> */}
        </div>
        <img
          data-aos="zoom-in-down"
          className="lg:h-[100px] md:h-[80px] h-[100px] productImg"
          src={img}
          alt=""
        />
      </div>
    </Link>
  );
};

export default NewArrivalCard;
