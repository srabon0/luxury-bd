import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { ProductSerdcvices } from "../../services/product.services";
import NewArrivalCard from "../Cards/NewArrivalCard";
import slider1 from "../../assests/sliderImage/slider1.png";
import slider2 from "../../assests/sliderImage/slider2.png";
import slider3 from "../../assests/sliderImage/slider3.png";
import slider4 from "../../assests/sliderImage/slider4.png";
import slider5 from "../../assests/sliderImage/slider5.png";

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

const imagearray = [slider1, slider2, slider3, slider4, slider5];

export default function NewArrivalSlider() {
  const [newarrival, setNewarrival] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await ProductSerdcvices.getLatestProduct();
        setNewarrival(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProduct();
  }, []);

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
            img={imagearray[Math.floor(Math.random() * imagearray.length)]}
          />
        ))}
      </Slider>
    </div>
  );
}
