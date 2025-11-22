import { useState, useEffect } from "react";
import axios from "../../api/axiosConfig";
import Product from "./Product";

function ProductList() {
  const [products, setProducts] = useState([]);

  const fetchData = () => {
    // axios.get('https://api.escuelajs.co/api/v1/products')
    axios
      .get("/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching data:", err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div
      className="container"
      style={{
        paddingTop: "var(--spacing-lg)",
        paddingBottom: "var(--spacing-lg)",
      }}
    >
      <div className="row align-items-stretch">
        {products.map((product) => (
          <Product key={product.id} data={product} />
        ))}
      </div>
    </div>
  );
}

export default ProductList;
