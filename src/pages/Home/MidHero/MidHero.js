import React, { useEffect, useState } from "react";
import HeroCarousel from "../../../components/Carousels/HeroCarousel";
import NewArrivalSlider from "../../../components/Slider/NewArrivalSlider";
import { ProductServices } from "../../../services/product.services";

const MidHero = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const [slider, setSlider] = useState([]);

  useEffect(() => {
    getAllLatestProducts();
    getSlider();
  }, []);

  const getAllLatestProducts = async () => {
    ProductServices.getLatestProduct().then((res) => {
      setLatestProducts(res);
    });
  };
  const getSlider = async () => {
    ProductServices.getSlider().then((res) => {
      setSlider(res);
    });
  };

  return (
    <section className="flex lg:flex-row flex-col w-11/12 gap-8 mx-auto mb-2">
      <div className="lg:w-2/3">
        <HeroCarousel slider={slider} />
      </div>
      <NewArrivalSlider products={latestProducts} />{" "}
      {/* Ensure latestProducts is correctly accessed */}
    </section>
  );
};

export default MidHero;
