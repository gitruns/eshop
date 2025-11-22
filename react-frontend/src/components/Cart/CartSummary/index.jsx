import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../../../redux/actions/cart-actions";

function CartSummary() {
  const cart = useSelector((state) => state.carts);
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 13.71;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onClearCartHandler = () => {
    dispatch(clearCart());
  };

  const onCheckoutHandler = () => {
    navigate("/checkout");
  };

  return (
    <div
      className="card wrapper"
      style={{
        backgroundColor: "var(--bg-primary)",
        boxShadow: "var(--shadow-sm)",
        borderRadius: "var(--border-radius-lg)",
        border: "1px solid var(--color-grey-300)",
      }}
    >
      <div
        className="card-body"
        style={{
          padding: "var(--spacing-lg)",
          backgroundColor: "var(--bg-primary)",
        }}
      >
        <h5
          className="card-title mb-3"
          style={{
            fontSize: "var(--font-size-xxl)",
            fontWeight: "var(--font-weight-semibold)",
            marginBottom: "var(--spacing-lg)",
            color: "var(--color-grey-900)",
          }}
        >
          Cart Summary
        </h5>
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
          <span>${(total + shipping).toFixed(2)}</span>
        </div>
        <button
          onClick={onCheckoutHandler}
          className="btn btn-primary w-100 mt-3"
          style={{
            borderRadius: "var(--border-radius-md)",
            padding: "var(--spacing-sm) var(--spacing-md)",
            fontSize: "var(--font-size-md)",
            fontWeight: "var(--font-weight-medium)",
          }}
        >
          Checkout
        </button>
        <button
          onClick={onClearCartHandler}
          className="btn btn-outline-danger w-100 mt-3"
          style={{
            borderRadius: "var(--border-radius-md)",
            padding: "var(--spacing-sm) var(--spacing-md)",
            fontSize: "var(--font-size-md)",
            fontWeight: "var(--font-weight-medium)",
          }}
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}

export default CartSummary;
