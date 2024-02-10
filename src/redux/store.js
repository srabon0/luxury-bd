import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from '@redux-devtools/extension';
import thunk from 'redux-thunk'
import cartCounter from "./middleware/cartCounter";
import rootReducer from "./reducers/rootReducer";
const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(cartCounter,thunk))
  );
export default store;