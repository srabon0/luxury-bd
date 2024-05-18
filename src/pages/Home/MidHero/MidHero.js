import React from "react";
import HeroCarousel from "../../../components/Carousels/HeroCarousel";
import NewArrivalSlider from "../../../components/Slider/NewArrivalSlider";

const MidHero = () => {
  return (
    <section className="flex lg:flex-row flex-col w-11/12 gap-8 mx-auto mb-2">
      <div className="lg:w-2/3">
        <HeroCarousel />
      </div>

      <NewArrivalSlider />
    </section>
  );
};

export default MidHero;
