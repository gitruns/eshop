import { ActionTypes } from "../constants/action-types";

const initialState = {
  cartItemNumbers: 0,
  carts: [],
};

export const cartReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.ADD_TO_CART:
      let updatedCarts;

      // if the cart is empty add the product to the cart
      if (state.carts === 0) {
        let item = {
          ...payload,
          quantity: 1,
        };
        state.carts.push(item);
      } else {
        const existingItem = state.carts.find((item) => item.id === payload.id);

        if (existingItem) {
          // if the product already exist increase the quantity
          updatedCarts = state.carts.map((item) =>
            item.id === payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          // if the product does not exist add it to the cart
          const newItem = { ...payload, quantity: 1 };
          updatedCarts = [...state.carts, newItem];
        }
      }
      return {
        ...state,
        carts: updatedCarts,
        cartItemNumbers: state.cartItemNumbers + 1,
      };
    case ActionTypes.DECREASE_QUANTITY:
      const itemToRemove = state.carts.find((item) => item.id === payload.id);
      if (itemToRemove.quantity === 1) {
        return {
          ...state,
          carts: state.carts.filter((item) => item.id !== payload.id),
          cartItemNumbers: state.cartItemNumbers - 1,
        };
      } else {
        return {
          ...state,
          carts: state.carts.map((item) =>
            item.id === payload.id
              ? { ...item, quantity: item.quantity - 1 }
              : item
          ),
          cartItemNumbers: state.cartItemNumbers - 1,
        };
      }
    case ActionTypes.DELETE_FROM_CART:
      return {
        ...state,
        carts: state.carts.filter((item) => item.id !== payload.id),
        cartItemNumbers: state.cartItemNumbers - payload.quantity,
      };
    // case ActionTypes.GET_TOTAL_CART_AMOUNT:
    //     const { total, quantity } = state.carts.reduce(
    //         (cartTotal, cartItem) => {
    //             const { price, quantity } = cartItem
    //             const itemTotal = price * quantity
    //
    //             cartTotal.total += itemTotal
    //             cartTotal.quantity += quantity
    //
    //             return cartTotal
    //         },
    //         {
    //             total: 0,
    //             quantity: 0
    //         }
    //     )
    //
    //     return {
    //         ...state,
    //         cartTotalAmount: parseFloat(total.toFixed(2)),
    //         cartItemNumbers: quantity
    //     }

    case ActionTypes.EMPTY_CART:
      return {
        ...initialState,
      };

    default:
      return state;
  }
};
