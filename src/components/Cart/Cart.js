import React from "react";
import { useNavigate } from "react-router-dom";
import cartImg from "../../assests/images/cart.png";
import "../../assests/styles/cart.css";
import PrimaryButton from "../Buttons/PrimaryButton";
import CartProductCard from "./CartProductCard";

import { useSelector } from "react-redux";
import Drawer from "../Shared/Drawer/Drawer";

const Cart = ({ setCartOpen, cartOpen }) => {
  const cartState = useSelector((state) => state.cartState);
  const { cart, cartTotal } = cartState;

  // GO TO CHECKOUT PAGE
  const navigate = useNavigate();
  const handleCheckout = () => {
    navigate("/checkout");
    setCartOpen(false);
  };

  // GO TO MY CART PAGE
  const handleGoCart = () => {
    navigate("/cart");
    setCartOpen(false);
  };

  const handleShopNow = () => {
    navigate("/products");
    setCartOpen(false);
  };
  return (
    <Drawer
      title=""
      isOpen={cartOpen}
      onClose={() => setCartOpen(false)}
      bg="bg-blue-200"
    >
      <div>
        <div className="text-center mt-4 mb-8">
          <h2 className="font-bold text-xl">Your Shopping Cart</h2>
          <h3 className="text-md">
            Selected Items: <strong>{cart.length}</strong>
          </h3>
        </div>

        {cart?.length ? (
          cart?.map((item, index) => (
            <CartProductCard data={item} key={index} />
          ))
        ) : (
          <div className="flex items-center justify-center">
            <img src={cartImg} className=" lg:w-[40%] w-[44%]" alt="" />
          </div>
        )}
        {cartTotal > 0 ? (
          <h2 className="mt-4">
            Subtotal &emsp;{" "}
            <span className="text-3xl font-bold">BDT {cartTotal}</span>{" "}
          </h2>
        ) : (
          <h2 className="mt-2 text-2xl font-bold text-center">
            Your Shopping Cart is Empty{" "}
          </h2>
        )}
        {cart?.length ? (
          <button
            onClick={handleGoCart}
            className="btn btn-outline w-full mt-8 normal-case go-cart"
          >
            &nbsp; Go to Cart
          </button>
        ) : (
          <span></span>
        )}

        {cart?.length ? (
          <button
            onClick={handleCheckout}
            className="btn btn-white w-full mt-3 text-white normal-case"
          >
            Checkout &emsp;
          </button>
        ) : (
          <div className="mt-12 flex justify-center">
            <PrimaryButton eventHandler={handleShopNow}>
              Shop Now{" "}
            </PrimaryButton>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default Cart;
