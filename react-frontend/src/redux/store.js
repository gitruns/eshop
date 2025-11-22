import { createStore } from "redux";
import { cartReducer } from "./reducers/cartReducer";

const loadState = () => {
  try {
    const serializedState = localStorage.getItem("cart");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (e) {
    return undefined;
  }
};

const saveState = (state) => {
  const serializedState = JSON.stringify(state);
  localStorage.setItem("cart", serializedState);
};

const persistedState = loadState();

const store = createStore(
  cartReducer,
  persistedState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

store.subscribe(() => {
  saveState({
    cartItemNumbers: store.getState().cartItemNumbers,
    carts: store.getState().carts,
  });
});

export default store;
