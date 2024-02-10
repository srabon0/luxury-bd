import { combineReducers } from "redux";
import fruitReducer from "./fruitReducer";
import orderReducer from "./orderReducer";
import userReducer from "./userReducer";
import categoryReducer from "./categoryReducer";
import brandReducer from "./brandReducer";
import productReducer from "./productReducer";
const rootReducer =  combineReducers({
    fruitState:fruitReducer,
    orderState:orderReducer,
    userState:userReducer,
    categoryState:categoryReducer,
    brandState: brandReducer,
    productState: productReducer,
});
export default rootReducer