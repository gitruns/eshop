import { Link } from "react-router-dom";

function EmptyCart() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <h1>Cart is empty</h1>
        <Link to="/products" className="btn btn-primary">
          Start Shopping
        </Link>
      </div>
    </div>
  );
}

export default EmptyCart;
