import {
  LOAD_BRAND,
  ADD_BRAND,
  UPDATE_BRAND,
  DELETE_BRAND,
} from "../actionTypes/brandActionType";

const initalState = {
  brands: [],
  loading: false,
  error: null,
};

const brandReducer = (state = initalState, action) => {
  console.log(action.payload);
  switch (action.type) {
    case LOAD_BRAND:
      return {
        ...state,
        brands: action.payload,
      };
    case ADD_BRAND:
      return {
        ...state,
        brands: [...state.brands, action.payload],
      };
    case UPDATE_BRAND:
      console.log("action.payload", action.payload);
      const updatedBrand = state.brands.map((brand) => {
        if (brand._id === action.payload._id) {
          return action.payload;
        }
        return brand;
      });
      return {
        ...state,
        brands: updatedBrand,
      };
    case DELETE_BRAND:
      const filteredBrand = state.brands.filter(
        (brand) => brand._id !== action.payload
      );
      return {
        ...state,
        brands: filteredBrand,
      };
    default:
      return state;
  }
};

export default brandReducer;
