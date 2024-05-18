import {
  ADD_TO_CART,
  DECRESE_QUANTITY,
  REMOVE_FROM_CART,
} from "../actionTypes/cartActionType";

const initialState = {
  cart: [],
  cartTotal: 0,
};

const CartReducer = (state = initialState, action) => {
  const selectedItem = state.cart.find(
    (item) => item._id === action.payload._id
  );
  switch (action.type) {
    case ADD_TO_CART:
      //if the product already exist in cart
      if (selectedItem) {
        const otherItems = state.cart.filter(
          (item) => item._id !== selectedItem._id
        );
        selectedItem.quantity = selectedItem.quantity + 1;
        return {
          ...state,
          cart: [...otherItems, selectedItem],
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }], //if the product is newly added to cart
      };
    case DECRESE_QUANTITY:
      if (selectedItem.quantity > 1) {
        const otherItems = state.cart.filter(
          (item) => item._id !== selectedItem._id
        );
        selectedItem.quantity = selectedItem.quantity - 1;
        return {
          ...state,
          cart: [...otherItems, selectedItem],
        };
      }
      return {
        ...state,
        cart: state.cart.filter((item) => item._id !== action.payload._id),
      };
    case REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter((item) => item._id !== action.payload),
      };

    default:
      return state;
  }
};

export default CartReducer;
