import React from "react";
import cartImg from "../../assests/images/cart.png"; // Assuming cartImg is imported

const CartToggle = ({ cartOpen, setCartOpen }) => {
  return (
    <div onClick={() => setCartOpen(!cartOpen)}>
      <img
        src={cartImg}
        alt="cart"
        className="fixed right-5 top-44 z-50 w-16 h-16 cursor-pointer"
      />
    </div>
  );
};

export default CartToggle;
