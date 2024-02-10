import React from "react";
import Footer from "./Footer";
import Marquee from "./Marquee";
import Nav from "./Nav";
import Home from "../../components/Home/Home";
import { Helmet } from "react-helmet";

const Main = () => {
  return (
    <div>
      <Helmet>
        <title>Luxurry | Classic Group</title>
      </Helmet>
      <Marquee />
      <Nav />
      <Home />
      <Footer />
    </div>
  );
};

export default Main;
