import {
  ADD_TO_CART,
  DECRESE_QUANTITY,
  DELETE_FRUIT,
  LOAD_FRUITS,
  REMOVE_FROM_CART,
  SET_TEST,
} from "../actionTypes/fruitActionType";

const initialState = {
  test: "test",
  fruits: [],
  cart: [],
  cartTotal: 0,
};

const fruitReducer = (state = initialState, action) => {
  const selectedFruit = state.cart.find(
    (fruit) => fruit._id === action.payload._id
  );
  switch (action.type) {
    case LOAD_FRUITS:
      return {
        ...state,
        fruits: action.payload,
      };
    case SET_TEST:
      return {
        ...state,
        test: action.payload,
      };
    case DELETE_FRUIT:
      return {
        ...state,
        fruits: state.fruits.filter((aFruit) => aFruit._id != action.payload),
      };
    case ADD_TO_CART:
      //if the product already exist in cart
      if (selectedFruit) {
        const otherItems = state.cart.filter(
          (fruit) => fruit._id !== selectedFruit._id
        );
        selectedFruit.quantity = selectedFruit.quantity + 1;
        return {
          ...state,
          cart: [...otherItems, selectedFruit],
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }], //if the product is newly added to cart
      };
    case DECRESE_QUANTITY:
      if (selectedFruit.quantity > 1) {
        const otherItems = state.cart.filter(
          (fruit) => fruit._id !== selectedFruit._id
        );
        selectedFruit.quantity = selectedFruit.quantity - 1;
        return {
          ...state,
          cart: [...otherItems, selectedFruit],
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

export default fruitReducer;
