import {
  ADD_PRODUCT,
  DELETE_PRODUCT,
  LOAD_PRODUCT,
  UPDATE_PRODUCT,
} from "../actionTypes/productActionType";

export const loadProducts = (payload) => {
  return {
    type: LOAD_PRODUCT,
    payload: payload,
  };
};

export const addProduct = (payload) => {
  return {
    type: ADD_PRODUCT,
    payload: payload,
  };
};

export const updateProduct = (payload) => {
  return {
    type: UPDATE_PRODUCT,
    payload: payload,
  };
};

export const deleteProduct = (payload) => {
  return {
    type: DELETE_PRODUCT,
    payload: payload,
  };
};

// Path: src/redux/reducers/productReducer.js
