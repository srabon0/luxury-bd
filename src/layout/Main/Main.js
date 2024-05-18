import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";

import Cart from "../../components/Cart/Cart";
import CartToggle from "../../components/Cart/CartToggle";
import BrandThunks from "../../redux/thunk/brandThunk";
import CategoryThunks from "../../redux/thunk/categoryThunk";
import Footer from "./Footer";
import Marquee from "./Marquee";
import Navbar from "./Navbar";
const Main = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(CategoryThunks.fetchCategories());
    dispatch(BrandThunks.fetchBrands());
  }, []);
  return (
    <>
      <Helmet>
        <title>Luxurry | Classic Group</title>
      </Helmet>
      <Marquee />
      <Navbar />
      <div className="w-full overflow-hidden">
        <Outlet />
        <Footer />
      </div>

      <div className="w-full">
        <CartToggle cartOpen={cartOpen} setCartOpen={setCartOpen} />
        <Cart setCartOpen={setCartOpen} cartOpen={cartOpen} />
      </div>
    </>
  );
};

export default Main;
