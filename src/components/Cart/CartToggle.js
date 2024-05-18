import React from "react";
import cartImg from "../../assests/images/cart.png"; // Assuming cartImg is imported

const CartToggle = ({ cartOpen, setCartOpen }) => {
  return (
    <div onClick={() => setCartOpen(!cartOpen)}>
      <div className="fixed right-5 top-44 z-50 w-10 md:w-14 h-10 md:h-14 cursor-pointer">
        <img
          src={cartImg}
          alt="cart"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default CartToggle;
