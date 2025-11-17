import { ActionTypes } from "../constants/action-types";

export const addToCart = (product) => {
  return {
    type: ActionTypes.ADD_TO_CART,
    payload: product,
  };
};

export const deleteFromCart = (product) => {
  return {
    type: ActionTypes.DELETE_FROM_CART,
    payload: product,
  };
};

export const decreaseQuantity = (product) => {
  return {
    type: ActionTypes.DECREASE_QUANTITY,
    payload: product,
  };
};

export const clearCart = () => {
  return {
    type: ActionTypes.EMPTY_CART,
  };
};
