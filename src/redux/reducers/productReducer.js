import {
  LOAD_PRODUCT,
  ADD_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
  CHANGE_ITEMS_PER_PAGE,
  CHANGE_PAGE,
} from "../actionTypes/productActionType";

const initialState = {
  products: [],
  pageNo: 1,
  itemsPerPage: 20,
  totalItems: 0,
  loading: false,
  error: null,
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_PRODUCT:
      return {
        ...state,
        products: action?.payload?.products,
        itemsPerPage: action?.payload?.itemsPerPage,
        totalItems: action?.payload?.totalProducts,
        pageNo: action?.payload?.pageNo,
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
    case CHANGE_PAGE:
      return {
        ...state,
        pageNo: action.payload,
      };
    case CHANGE_ITEMS_PER_PAGE:
      return {
        ...state,
        itemsPerPage: action.payload,
      };

    default:
      return state;
  }
};

export default productReducer;
