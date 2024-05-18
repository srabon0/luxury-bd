import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// import required modules
import React, { useEffect, useState } from "react";
import { Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import { useSelector } from "react-redux";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import SingleSlide from "./SingleSlide";

const CatSlides = () => {
  const [isMobile, setIsMobile] = useState(false);
  const categories = useSelector((state) => state.categoryState.categories);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    }
  }, [window.innerWidth]);

  return (
    <>
      <section class="text-gray-600 body-font">
        <div class="container px-5 py-20 mx-auto">
          <div class="flex flex-col text-center w-full mb-10">
            <h2 class="text-xs text-indigo-500 tracking-widest font-medium title-font mb-1">
              Luxurry SanitrayWare and Bath Fittings
            </h2>
            <h1 class="sm:text-3xl text-2xl font-medium title-font text-gray-900">
              Explore Our Categories
            </h1>
          </div>

          <Swiper
            slidesPerView={isMobile ? 1 : 3}
            spaceBetween={isMobile ? 10 : 30}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="mySwiper flex items-center justify-center gap-2"
            data-aos="fade-right"
          >
            {categories.map((category, index) => (
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
