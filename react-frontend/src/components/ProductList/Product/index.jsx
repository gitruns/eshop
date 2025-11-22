import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  decreaseQuantity,
} from "../../../redux/actions/cart-actions";

function Product({ data }) {
  const { id, productName, images, category, price } = data;
  const dispatch = useDispatch();
  const carts = useSelector((state) => state.carts);

  const onAddHandler = () => dispatch(addToCart(data));
  const onRemoveHandler = () => dispatch(decreaseQuantity(data));

  const cartItem = carts.find((item) => item.id === data.id);

  return (
    <div className="col-sm-3" style={{ marginBottom: "var(--spacing-xl)" }}>
      <div
        className="card h-100"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderRadius: "var(--border-radius-lg)",
          boxShadow: "var(--shadow-sm)",
          border: "1px solid var(--color-grey-300)",
          overflow: "hidden",
        }}
      >
        <Link to={`/products/${id}`} style={{ textDecoration: "none" }}>
          <img
            src={images}
            className="card-img-top"
            alt={productName}
            style={{
              height: "var(--spacing-xxxxl)",
              objectFit: "cover",
            }}
          />
        </Link>
        <div
          className="card-body"
          style={{
            padding: "1rem",
            backgroundColor: "var(--bg-primary)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flexGrow: 1,
          }}
        >
          <div>
            <Link to={`/products/${id}`} style={{ textDecoration: "none" }}>
              <h5
                className="card-title"
                style={{
                  fontSize: "var(--font-size-xl)",
                  fontWeight: "var(--font-weight-semibold)",
                  marginBottom: "var(--spacing-sm)",
                  color: "var(--color-grey-900)",
                }}
              >
                {productName}
              </h5>
            </Link>
            <span
              className="badge badge-secondary"
              style={{
                borderRadius: "var(--border-radius-sm)",
                backgroundColor: "var(--color-grey-500)",
                color: "var(--color-white)",
                padding: "var(--spacing-xs) var(--spacing-sm)",
                fontSize: "var(--font-size-sm)",
                marginBottom: "var(--spacing-md)",
              }}
            >
              {category.name}
            </span>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <p
              className="card-text mb-0"
              style={{
                fontSize: "var(--font-size-lg)",
                fontWeight: "var(--font-weight-bold)",
                color: "var(--color-grey-700)",
              }}
            >
              ${price}
            </p>
            {cartItem ? (
              <div className="input-group quantity-group">
                <button
                  onClick={onRemoveHandler}
                  className="btn btn-outline-secondary small-square-button quantity-left"
                  type="button"
                >
                  -
                </button>
                <input
                  type="text"
                  className="form-control add-sub-input"
                  value={cartItem.quantity}
                  readOnly
                />
                <button
                  onClick={onAddHandler}
                  className="btn btn-outline-secondary small-square-button quantity-right"
                  type="button"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={onAddHandler}
                className="btn btn-primary small-button px-2"
              >
                Add
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
