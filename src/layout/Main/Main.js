import React from "react";
import Footer from "./Footer";
import Marquee from "./Marquee";
import Nav from "./Nav";
import { Helmet } from "react-helmet";
import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <div>
      <Helmet>
        <title>Luxurry | Classic Group</title>
      </Helmet>
      <Marquee />
      <Nav />
      <div>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Main;
