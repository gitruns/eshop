import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "../../api/axiosConfig";
import Product from "./Product";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get("category") || "";
  const sortByParam = searchParams.get("sortBy") || "price";
  const sortOrderParam = searchParams.get("order") || "asc";

  const fetchData = () => {
    // axios.get('https://api.escuelajs.co/api/v1/products')
    axios
      .get("/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching data:", err));

    axios
      .get("/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  };

  // Filter and sort products based on params
  const getFilteredProducts = () => {
    let filtered = products;

    if (categoryParam) {
      filtered = filtered.filter(
        (product) =>
          product.category &&
          product.category.name.toLowerCase() === categoryParam.toLowerCase()
      );
    }

    filtered = filtered.sort((a, b) => {
      let comparison = 0;
      if (sortByParam === "alphabetical") {
        comparison = a.productName.localeCompare(b.productName);
      } else {
        const priceA = parseFloat(a.price);
        const priceB = parseFloat(b.price);
        comparison = priceA - priceB;
      }
      return sortOrderParam === "asc" ? comparison : -comparison;
    });

    return filtered;
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    const params = { sortBy: sortByParam, order: sortOrderParam };
    if (category) {
      params.category = category;
    }
    setSearchParams(params);
  };

  const handleSortByChange = (e) => {
    const sortBy = e.target.value;
    const params = { sortBy, order: sortOrderParam };
    if (categoryParam) {
      params.category = categoryParam;
    }
    setSearchParams(params);
  };

  const handleOrderToggle = () => {
    const newOrder = sortOrderParam === "asc" ? "desc" : "asc";
    const params = { sortBy: sortByParam, order: newOrder };
    if (categoryParam) {
      params.category = categoryParam;
    }
    setSearchParams(params);
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
      {/* Filters */}
      <div
        className="d-flex justify-content-between align-items-end mb-4"
        style={{
          flexWrap: "wrap",
          gap: "var(--spacing-lg)",
        }}
      >
        {/* Left: Category Filter */}
        <div style={{ minWidth: "200px" }}>
          <select
            id="category-select"
            value={categoryParam}
            onChange={handleCategoryChange}
            style={{
              padding: "var(--spacing-sm)",
              border: "1px solid var(--color-grey-300)",
              borderRadius: "var(--border-radius-md)",
              backgroundColor: "var(--bg-primary)",
              color: "var(--color-text-primary)",
              fontSize: "var(--font-size-base)",
            }}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Right: Sorting */}
        <div
          style={{
            display: "flex",
            alignItems: "end",
            gap: "var(--spacing-md)",
            flexWrap: "wrap",
          }}
        >
          <div>
            <select
              id="sort-by-select"
              value={sortByParam}
              onChange={handleSortByChange}
              style={{
                padding: "var(--spacing-sm)",
                border: "1px solid var(--color-grey-300)",
                borderRadius: "var(--border-radius-md)",
                backgroundColor: "var(--bg-primary)",
                color: "var(--color-text-primary)",
                fontSize: "var(--font-size-base)",
              }}
            >
              <option value="alphabetical">Alphabetical</option>
              <option value="price">Price</option>
            </select>
          </div>

          <div>
            <button
              id="order-toggle"
              onClick={handleOrderToggle}
              type="button"
              className="btn"
              style={{
                padding: "var(--spacing-sm) var(--spacing-md)",
                border: "1px solid var(--color-grey-300)",
                borderRadius: "var(--border-radius-md)",
                backgroundColor: "var(--bg-primary)",
                color: "var(--color-text-primary)",
                fontSize: "var(--font-size-base)",
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-xs)",
              }}
            >
              {sortOrderParam === "asc" ? (
                <>
                  <i className="bx bx-sort-up"></i>
                  Ascending
                </>
              ) : (
                <>
                  <i className="bx bx-sort-down"></i>
                  Descending
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="row align-items-stretch">
        {getFilteredProducts().map((product) => (
          <Product key={product.id} data={product} />
        ))}
      </div>
    </div>
  );
}

export default ProductList;
