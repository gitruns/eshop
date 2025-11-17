import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { clearCart } from "../../../redux/actions/cart-actions";

function CartSummary() {
  const cart = useSelector((state) => state.carts);
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 13.71;

  const dispatch = useDispatch();

  const onClearCartHandler = () => {
    dispatch(clearCart());
  };

  return (
    <div className="card wrapper">
      <div className="card-body">
        <h5 className="card-title mb-3">Cart Summary</h5>
        <div className="d-flex justify-content-between border-top py-2">
          <span>Subtotal:</span>
          <span>${total}</span>
        </div>
        <div className="d-flex justify-content-between border-bottom py-2">
          <span>Shipping:</span>
          <span>${shipping}</span>
        </div>
        <div className="d-flex justify-content-between py-2 fw-semibold">
          <span>Total:</span>
          <span>${total + shipping}</span>
        </div>
        <button className="btn btn-primary w-100 mt-3">Checkout</button>
        <button
          onClick={onClearCartHandler}
          className="btn btn-outline-danger w-100 mt-3"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}

export default CartSummary;
