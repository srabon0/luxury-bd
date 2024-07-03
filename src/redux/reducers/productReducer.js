import {
  ADD_PRODUCT,
  DELETE_PRODUCT,
  LOAD_PRODUCT,
  UPDATE_PRODUCT,
} from "../actionTypes/productActionType";

const initialState = {
  products: [],
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_PRODUCT:
      return {
        ...state,
        products: action?.payload,
      };
    case ADD_PRODUCT:
      return {
        ...state,
        products: [...state.products, action.payload],
      };
    case UPDATE_PRODUCT:
      const updatedProduct = state.products.map((product) => {
        if (product._id === action.payload._id) {
          return action.payload;
        }
        return product;
      });
      return {
        ...state,
        products: updatedProduct,
      };
    case DELETE_PRODUCT:
      const filteredProduct = state.products.filter(
        (product) => product._id !== action.payload
      );
      return {
        ...state,
        products: filteredProduct,
      };

    default:
      return state;
  }
};

export default productReducer;
