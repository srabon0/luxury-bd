import {
  LOAD_CATEGORY,
  ADD_CATEGORY,
  DELETE_CATEGORY,
  UPDATE_CATEGORY,
} from "../actionTypes/categoryActionType";

const initalState = {
  categories: [],
  loading: false,
  error: null,
};

const categoryReducer = (state = initalState, action) => {
  switch (action.type) {
    case LOAD_CATEGORY:
      return {
        ...state,
        categories: action.payload,
      };
    case ADD_CATEGORY:
      return {
        ...state,
        categories: [...state.categories, action.payload],
      };
    case UPDATE_CATEGORY:
      const updatedCategory = state.categories.map((category) => {
        if (category._id === action.payload._id) {
          return action.payload;
        }
        return category;
      });
      return {
        ...state,
        categories: updatedCategory,
      };
    case DELETE_CATEGORY:
      const filteredCategory = state.categories.filter(
        (category) => category._id !== action.payload
      );
      return {
        ...state,
        categories: filteredCategory,
      };

    default:
      return state;
  }
};

export default categoryReducer;
