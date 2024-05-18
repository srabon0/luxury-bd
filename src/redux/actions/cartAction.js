import {
  ADD_TO_CART,
  DECRESE_QUANTITY,
  REMOVE_FROM_CART,
} from "../actionTypes/cartActionType";

/**
 *
 * @param {*} payload = FruitData
 * @returns  Cart
 */
export const addToCart = (payload) => {
  console.log("Add to cart", payload);
  return {
    type: ADD_TO_CART,
    payload: payload,
  };
};

/**
 *
 * @param {*} payload = FruitData
 * @returns  Cart
 */
export const decreaseQty = (payload) => {
  console.log("Decrease qty ", payload);
  return {
    type: DECRESE_QUANTITY,
    payload: payload,
  };
};

/**
 * Remove Product From cart
 */

export const deleteFromCartStore = (itemId) => {
  console.log("Remove from Cart", itemId);
  return {
    type: REMOVE_FROM_CART,
    payload: itemId,
  };
};
