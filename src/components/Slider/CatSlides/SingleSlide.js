import React from "react";
import basin1 from "../../../assests/products/cat1.png";
const SingleSlide = ({ category }) => {
  return (
    <>
      <div>
        <div className="card w-96 p-5  bg-base-100 rounded-md flex justify-center">
          <div className="flex justify-start items-center">
            <img src={basin1} alt="shoes" className="w-32 h-32" />
            <div>
              <h2 className="card-title ">{category?.name}</h2>
              <p>If a dog chews shoes whose shoes does he choose?</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleSlide;
