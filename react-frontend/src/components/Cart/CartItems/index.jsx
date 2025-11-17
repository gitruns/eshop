import { useSelector } from "react-redux";
import Item from "./CartItem";

function CartItems() {
  const cart = useSelector((state) => state.carts);

  return (
    <>
      {cart.map((item, index) => (
        <Item key={index} data={item} />
      ))}
    </>
  );
}

export default CartItems;
