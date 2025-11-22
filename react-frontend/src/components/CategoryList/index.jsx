import { useState, useEffect } from "react";
import axios from "../../api/axiosConfig";
import Category from "./Category";

function CategoryList() {
  const [categories, setCategories] = useState([]);

  const fetchData = () => {
    // axios.get('https://api.escuelajs.co/api/v1/categories')
    axios
      .get("/api/categories")
      .then((res) => setCategories(res.data))
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
        {categories.map((category) => (
          <Category key={category.id} data={category} />
        ))}
      </div>
    </div>
  );
}

export default CategoryList;
