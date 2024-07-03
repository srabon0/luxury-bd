import React from "react";
import basin1 from "../../../assests/products/cat1.png";
const SingleSlide = ({ category, activeCategory }) => {
  // Explicitly check if both activeCategory and category are defined and their _id properties match
  const isActive =
    activeCategory && category && activeCategory._id === category._id;

  return (
    <>
      <div
        className={`${
          isActive
            ? "p-[2px] bg-gradient-to-r from-purple-400 to-blue-300 rounded-md"
            : ""
        }`}
      >
        <div
          className={`card  p-5 bg-base-100 rounded-md flex justify-center ${
            isActive ? "" : ""
          }`}
        >
          <div>
            <div>
              <div className="flex justify-start items-center">
                <img
                  data-aos="zoom-in"
                  src={basin1}
                  alt="shoes"
                  className="w-32 h-32"
                />
                <div>
                  <h2 className="card-title">{category?.name}</h2>
                  <p>If a dog chews shoes whose shoes does he choose?</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleSlide;
