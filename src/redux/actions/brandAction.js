import {
  LOAD_BRAND,
  ADD_BRAND,
  DELETE_BRAND,
  UPDATE_BRAND,
} from "../actionTypes/brandActionType";

export const loadBrands = (payload) => {
  return {
    type: LOAD_BRAND,
    payload: payload,
  };
};

export const addBrand = (payload) => {
  return {
    type: ADD_BRAND,
    payload: payload,
  };
};

export const updateBrand = (payload) => {
  return {
    type: UPDATE_BRAND,
    payload: payload,
  };
};

export const deleteBrand = (payload) => {
  return {
    type: DELETE_BRAND,
    payload: payload,
  };
};
