import CartItems from "./CartItems";
import CartSummary from "./CartSummary";

function Cart() {
  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col-lg-9 col-md-8 mb-3">
          <CartItems />
        </div>
        <div className="col-lg-3 col-md-4">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}

export default Cart;
