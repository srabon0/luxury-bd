import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { getImageUrl } from "../../utils/utils";
import NewArrivalCard from "../Cards/NewArrivalCard";

const bg = [
  "#DAC2FF",
  "#FFE7CC",
  "#D7E9B9",
  "#E8D3FF",
  "#CEE5D0",
  "#F0997D",
  "#F7E2D6",
  "#F4FFB2",
];

export default function NewArrivalSlider({ products }) {
  const [newarrival, setNewarrival] = useState(null);

  useEffect(() => {
    if (products) {
      setNewarrival(products);
    }
  }, [products?.length]);

  var settings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 3000,
    vertical: true,
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          vertical: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          vertical: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          vertical: false,
        },
      },
    ],
  };
  return (
    <div className="lg:w-1/3 lg:h-[480px]">
      <div className="mb-3">
        <div className="badge badge-secondary badge-lg">New Arrivals</div>
      </div>
      <Slider {...settings}>
        {newarrival?.map((item, index) => (
          <NewArrivalCard
            key={index}
            data={{
              ...item,
              bg: bg[Math.floor(Math.random() * bg.length - index)],
            }}
            img={getImageUrl(item?.image?.[0]?.imageUrl)}
          />
        ))}
      </Slider>
    </div>
  );
}
