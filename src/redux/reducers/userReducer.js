import {
  RESET_CURRENT_USER,
  SET_CURRENT_USER,
} from "../actionTypes/userActionType";

const initalState = {
  authUser: JSON.parse(localStorage.getItem("currentUser")) || {},
  token: localStorage.getItem("token") || "",
};
const userReducer = (state = initalState, action) => {
  console.log("action", action?.payload);
  switch (action.type) {
    case SET_CURRENT_USER:
      localStorage.setItem("currentUser", JSON.stringify(action.payload?.user));
      localStorage.setItem("token", action.payload.accessToken);
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
