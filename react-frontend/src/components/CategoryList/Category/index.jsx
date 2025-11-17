import { Link } from "react-router-dom";

function Category({ data }) {
  const { name, image } = data;
  // const { id, name, image } = data
  return (
    <div className="col-sm-3">
      <div className="card">
        <img src={image} className="card-img-top" alt={name} />
        <div className="card-body">
          <h5 className="card-title">{name}</h5>
          <Link to="/products" className="btn btn-primary btn-block">
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Category;
