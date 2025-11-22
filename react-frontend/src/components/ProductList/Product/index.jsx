import { Link } from "react-router-dom";

function Product({ data }) {
  const { id, productName, images, category, price } = data;
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
        <img
          src={images}
          className="card-img-top"
          alt={productName}
          style={{
            height: "var(--spacing-xxxxl)",
            objectFit: "cover",
          }}
        />
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
            <Link
              to={`/products/${id}`}
              className="btn btn-primary"
              style={{
                borderRadius: "var(--border-radius-md)",
                padding: "var(--spacing-sm) var(--spacing-md)",
                fontSize: "var(--font-size-md)",
              }}
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
