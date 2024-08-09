import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PrimaryButton from "../Buttons/SecondaryButton";
import "./HeroCarousel.css";

const slideStyles = {
  1: { backgroundColor: "#B1D7B4" },
  2: { backgroundColor: "#A8D1D1" },
  3: { backgroundColor: "#FECD70" },
  4: { backgroundColor: "#D6E4E5" },
  5: { backgroundColor: "#F4C8C8" },
  6: { backgroundColor: "#F4D8C8" }, // Example color for slide 6
  7: { backgroundColor: "#E4C8E5" }, // Example color for slide 7
  8: { backgroundColor: "#C8D1F4" }, // Example color for slide 8
  9: { backgroundColor: "#B4D7F4" }, // Example color for slide 9
  10: { backgroundColor: "#A4D1E1" }, // Example color for slide 10
};
const HeroCarousel = ({ slider }) => {
  const [slideNumber, setSlideNumber] = useState(1);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (slideNumber === 10) {
        setSlideNumber(1);
      } else {
        setSlideNumber(slideNumber + 1);
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [slideNumber]);
  return (
    <div className="slider">
      {slider?.map((item, index) => (
        <div
          key={index}
          className={`slide ${slideNumber === index + 1 && "active"}`}
        >
          <div className="image" style={slideStyles[slideNumber] || {}}>
            <img
              data-aos="zoom-in-up"
              data-aos-once="false" // This line ensures the animation repeats
              src={item.image}
              alt=""
              className="relative z-10"
            />
            I
          </div>
          <div className="info">
            <h1 className="lg:text-5xl md:text-4xl text-2xl font-bold uppercase text-white">
              {item?.title}
            </h1>
            <p className="mt-2 lg:mb-8 md:mb-8 mb-5 lg:text-lg md:text-lg text-sm lg:w-3/4 md:w-3/4">
              {item?.description}
            </p>
            <Link to="/products">
              <PrimaryButton>Shop Now</PrimaryButton>
            </Link>
          </div>
        </div>
      ))}
      <div className="navigation">
        {Array.from({ length: 10 }, (_, index) => (
          <div
            key={index + 1}
            className={`navBtn ${slideNumber === index + 1 ? "active" : ""}`}
            onClick={() => setSlideNumber(index + 1)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
