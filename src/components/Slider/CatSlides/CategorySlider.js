import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// import required modules
import React, { useEffect, useRef, useState } from "react";
import { Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import SingleSlide from "./SingleSlide";

const CatSlides = ({ noHeading = false, activeFunctionalities = false }) => {
  const [isMobile, setIsMobile] = useState(false);
  const categories = useSelector((state) => state.categoryState.categories);
  const [activeCategory, setActiveCategory] = useState(null);
  const currentUrl = useRef(window.location.href);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    }
  }, [window.innerWidth]);

  const handleSetActiveCategory = (category) => {
    if (!activeFunctionalities) {
      return;
    }
    console.log(category);
    if (activeCategory?._id === category._id) {
      setActiveCategory(null);
      return;
    }
    setActiveCategory(category);
    const urlName = category.name.toLowerCase().split(" ").join("-");
    window.history.pushState(null, null, `${currentUrl.current}/${urlName}`);
  };

  return (
    <>
      <section class="text-gray-600 body-font">
        <div class="container px-5 py-20 mx-auto">
          {!noHeading && (
            <div class="flex flex-col text-center w-full mb-10">
              <h2 class="text-xs text-indigo-500 tracking-widest font-medium title-font mb-1">
                Luxurry SanitrayWare and Bath Fittings
              </h2>
              <h1 class="sm:text-3xl text-2xl font-medium title-font text-gray-900">
                Explore Our Categories
              </h1>
            </div>
          )}

          <Swiper
            slidesPerView={isMobile ? 1 : 3}
            spaceBetween={isMobile ? 10 : 30}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="mySwiper flex items-center justify-center gap-2"
          >
            {categories.map((category, index) => (
              <SwiperSlide key={index}>
                <Link to={"/categories/" + activeCategory?.name}>
                  <div onClick={() => handleSetActiveCategory(category)}>
                    <SingleSlide
                      activeCategory={activeCategory}
                      category={category}
                    />
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="flex flex-wrap">
          {activeCategory?.subCategories?.map((cat) => (
            <div key={cat._id} className="w-1/4 p-2">
              <div className="p-4 bg-white shadow-md rounded-md">
                <h3 className="text-lg font-semibold text-gray-800">
                  {cat.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default CatSlides;
