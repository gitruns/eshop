import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axiosConfig";

function Header() {
  const [products, setProducts] = useState([]);
  const [itemsPerView, setItemsPerView] = useState(5);
  const [slideIndex, setSlideIndex] = useState(() => {
    const saved = sessionStorage.getItem("carouselPosition");
    return saved ? parseInt(saved, 10) : 0;
  });

  const fetchData = () => {
    axios
      .get("/api/products")
      .then((res) => setProducts(res.data.slice(0, 30))) // Fetch up to 30 products for cycling
      .catch((err) => console.error("Error fetching data:", err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w >= 1200) setItemsPerView(5);
      else if (w >= 992) setItemsPerView(3);
      else if (w >= 768) setItemsPerView(2);
      else setItemsPerView(1);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (products.length === 0) return;
    const interval = setInterval(() => {
      setSlideIndex(
        (prev) => (prev + 1) % Math.max(1, products.length - itemsPerView + 1)
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [products.length, itemsPerView]);

  useEffect(() => {
    sessionStorage.setItem("carouselPosition", slideIndex.toString());
  }, [slideIndex]);

  return (
    <div
      style={{
        overflow: "hidden",
        marginBottom: "var(--spacing-lg)",
      }}
    >
      <div
        style={{
          display: "flex",
          transition: "transform 0.5s",
          transform: `translateX(-${(slideIndex * 100) / itemsPerView}%)`,
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              flex: `0 0 ${100 / itemsPerView}%`,
              padding: "var(--spacing-sm)",
            }}
          >
            <Link
              to={`/products/${product.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  aspectRatio: "1/1",
                  overflow: "hidden",
                  borderRadius: "var(--border-radius-lg)",
                  boxShadow: "var(--shadow-md)",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                <img
                  src={product.images}
                  alt={product.productName}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    right: "10px",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "var(--border-radius-sm)",
                    fontSize: "var(--font-size-sm)",
                    fontWeight: "var(--font-weight-bold)",
                  }}
                >
                  ${product.price}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Header;
