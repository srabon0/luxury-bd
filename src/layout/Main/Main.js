import React, { useEffect } from "react";
import Footer from "./Footer";
import Marquee from "./Marquee";
import Nav from "./Nav";
import { Helmet } from "react-helmet";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import CategoryThunks from "../../redux/thunk/categoryThunk";
import BrandThunks from "../../redux/thunk/brandThunk";

const Main = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(CategoryThunks.fetchCategories());
    dispatch(BrandThunks.fetchBrands());
  }, []);
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
