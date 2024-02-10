import {
  LOAD_PRODUCT,
  ADD_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
  CHANGE_ITEMS_PER_PAGE,
  CHANGE_PAGE,
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

export const changePage = (payload) => {
  return {
    type: CHANGE_PAGE,
    payload: payload,
  };
};

export const changeItemsPerPage = (payload) => {
  return {
    type: CHANGE_ITEMS_PER_PAGE,
    payload: payload,
  };
};

// Path: src/redux/reducers/productReducer.js
