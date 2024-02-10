import {
  LOAD_CATEGORY,
  ADD_CATEGORY,
  DELETE_CATEGORY,
  UPDATE_CATEGORY,
} from "../actionTypes/categoryActionType";

export const loadCategory = (payload) => {
  return {
    type: LOAD_CATEGORY,
    payload: payload,
  };
};

export const addCategory = (payload) => {
  return {
    type: ADD_CATEGORY,
    payload: payload,
  };
};

export const updateCategory = (payload) => {
  return {
    type: UPDATE_CATEGORY,
    payload: payload,
  };
};
export const deleteCategory = (payload) => {
  return {
    type: DELETE_CATEGORY,
    payload: payload,
  };
};
