import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// import required modules
import React, { useEffect, useState } from "react";
import { Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import SingleSlide from "./SingleSlide";
const imageUrl =
  "https://images.unsplash.com/photo-1494726161322-5360d4d0eeae?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80";

const categories = [
  { title: "Category 1", image: imageUrl },
  { title: "Category 2", image: imageUrl },
  { title: "Category 3", image: imageUrl },
  { title: "Category 4", image: imageUrl },
  { title: "Category 5", image: imageUrl },
  { title: "Category 6", image: imageUrl },
];
const CatSlides = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    }
  }, [window.innerWidth]);

  return (
    <>
      <section class="text-gray-600 body-font">
        <div class="container px-5 py-10 mx-auto">
          <div class="flex flex-col text-center w-full mb-20">
            <h2 class="text-xs text-indigo-500 tracking-widest font-medium title-font mb-1">
              ROOF PARTY POLAROID
            </h2>
            <h1 class="sm:text-3xl text-2xl font-medium title-font text-gray-900">
              Master Cleanse Reliac Heirloom
            </h1>
          </div>

          <Swiper
            slidesPerView={isMobile ? 1 : 3}
            spaceBetween={isMobile ? 10 : 30}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="mySwiper"
            data-aos="fade-right"
          >
            {categories?.map((category, index) => (
              <SwiperSlide key={index}>
                <SingleSlide category={category} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </>
  );
};

export default CatSlides;
