import React from "react";
// import Banner from "../../components/Banner/Banner";
// import BannerBottom from "../../components/Banner/BannerBottom";
// import BestSellers from "../../components/home/BestSellers/BestSellers";
// import NewArrivals from "../../components/home/NewArrivals/NewArrivals";
// import Sale from "../../components/home/Sale/Sale";
import Hero from "../../components/Hero/Hero";
// import SpecialOffers from "../../components/home/SpecialOffers/SpecialOffers";
// import YearProduct from "../../components/home/YearProduct/YearProduct";

import Feature1 from "../../components/home/Features/Feature1";
import Footer from "../../components/home/Footer/Footer";

const Home = () => {
  return (
    <div className="w-full mx-auto">
      <Hero />
      {/* <FeaturesSection /> */}
      {/* <Banner /> */}
      {/* <BannerBottom /> */}
      <div className="max-w-container mx-auto px-4">
        {/* <Sale /> */}
        <Feature1 />

        {/* <NewArrivals />
        <BestSellers />
        <YearProduct />
        <SpecialOffers /> */}
        <Footer />
      </div>
    </div>
  );
};

export default Home;
