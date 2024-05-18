import React from "react";
import { SwiperSlide } from "swiper/react";

const SingleSlide = ({ category }) => {
  return (
    <>
      <div className="rounded-sm">
        <div class="flex flex-row rounded-lg h-24 lg:h-40 bg-base-100 shadow-sm items-start">
          <img
            class="object-cover w-36 rounded-t-lg max-h-24 lg:max-h-40 md:h-auto md:w-32 rounded-md"
            src={category.image}
            alt=""
          />
          <div class="flex flex-col justify-between lg:items-center items-start p-4">
            <h5 class="mb-2 text-xl lg:text-2xl font-bold tracking-tight ">
              {category.title}
            </h5>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleSlide;
