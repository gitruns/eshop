import { Link } from "react-router-dom";

function Category({ data }) {
  const { name, image } = data;
  // const { id, name, image } = data
  return (
    <div className="col-sm-3" style={{ marginBottom: "var(--spacing-xl)" }}>
      <Link
        to={`/products?category=${encodeURIComponent(name)}`}
        style={{ textDecoration: "none" }}
      >
        <div
          className="card h-100"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderRadius: "var(--border-radius-lg)",
            boxShadow: "var(--shadow-sm)",
            border: "1px solid var(--color-grey-300)",
            overflow: "hidden",
            position: "relative",
            cursor: "pointer",
            transition:
              "transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "var(--shadow-lg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "var(--shadow-sm)";
          }}
        >
          <img
            src={image}
            alt={name}
            style={{
              height: "var(--spacing-xxxxl)",
              objectFit: "cover",
              display: "block",
              width: "100%",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.1) 100%)",
              padding: "var(--spacing-lg)",
              color: "white",
            }}
          >
            <h5
              style={{
                fontSize: "var(--font-size-xl)",
                fontWeight: "var(--font-weight-semibold)",
                margin: 0,
                textShadow: "0 1px 3px rgba(0,0,0,0.8)",
              }}
            >
              {name}
            </h5>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default Category;
