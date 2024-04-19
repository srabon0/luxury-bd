import {
  RESET_CURRENT_USER,
  SET_CURRENT_USER,
} from "../actionTypes/userActionType";

const initalState = {
  authUser: JSON.parse(localStorage.getItem("currentUser")) || {},
};

const userReducer = (state = initalState, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      localStorage.setItem("currentUser", JSON.stringify(action.payload));
      return {
        ...state,
        authUser: action.payload,
      };
    case RESET_CURRENT_USER: {
      return {
        ...state,
        authUser: {},
      };
    }
    default:
      return state;
  }
};

export default userReducer;
