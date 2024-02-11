import { combineReducers } from "redux";

import orderReducer from "./orderReducer";
import userReducer from "./userReducer";
import categoryReducer from "./categoryReducer";
import brandReducer from "./brandReducer";
import productReducer from "./productReducer";
const rootReducer = combineReducers({
  orderState: orderReducer,
  userState: userReducer,
  categoryState: categoryReducer,
  brandState: brandReducer,
  productState: productReducer,
});
export default rootReducer;
