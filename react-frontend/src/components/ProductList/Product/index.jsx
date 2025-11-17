import { Link } from "react-router-dom";

function Product({ data }) {
  const { id, productName, images, category, price } = data;
  return (
    <div className="col-sm-3">
      <div className="card">
        <img src={images} className="card-img-top" alt={productName} />
        <div className="card-body">
          <h5 className="card-title">{productName}</h5>
          <span class="badge badge-secondary">{category.name}</span>

          <div className="d-flex justify-content-between align-items-center">
            <p className="card-text mb-0">${price}</p>
            <Link to={`/products/${id}`} className="btn btn-primary">
              View
            </Link>
          </div>
          {/* <p className="card-text">${price}</p> */}
          {/* <p>{description}</p> */}
          {/* <a href="#" className="btn btn-primary btn-block">Add to Cart</a> */}
        </div>
      </div>
    </div>
  );
}

export default Product;
