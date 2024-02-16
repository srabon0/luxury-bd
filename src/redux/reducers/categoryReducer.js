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
  console.log("action", action);
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
      console.log("action.payload", action.payload._id);
      const updateIndex = state.categories.findIndex(
        (category) => category._id === action.payload._id
      );

      if (updateIndex === -1) {
        console.error("No category found with the given _id");
        return state;
      }

      const updatedCategories = [...state.categories];
      updatedCategories[updateIndex] = action.payload;

      return {
        ...state,
        categories: updatedCategories,
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
