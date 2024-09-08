import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import brandReducer from "./features/brand/brandSlice";
import categoryReducer from "./features/categories/categorySlice";
import productReducer from "./features/product/productSlice";
import orebiReducer from "./orebiSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  brand: brandReducer,
  categories: categoryReducer,
  products: productReducer,
  orebi: orebiReducer, // Assuming you want to persist orebiReducer as well
  [baseApi.reducerPath]: baseApi.reducer, // Add the baseApi reducer here
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware), // Add the baseApi middleware here
});

export let persistor = persistStore(store);
