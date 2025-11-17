// import { useDispatch } from "react-redux"
// import { addToCart, decreaseQuantity, deleteFromCart } from "../../../../redux/actions/cart-actions"
// import { Link } from "react-router-dom"
// import './styles.css'
//
// function Item({ data }) {
//     const { id, title, price, images, quantity } = data
//     const dispatch = useDispatch()
//
//     const onAddHandler = () => {
//         dispatch(addToCart(data))
//     }
//     const onRemoveHandler = () => {
//         dispatch(decreaseQuantity(data))
//     }
//     const onDeleteHandler = () => {
//         dispatch(deleteFromCart(data))
//     }
//
//     return (
//         <div className="row align-items-stretch">
//             <div className="col-2">
//                 <div className="wrapper card-item-wrapper">
//                     <Link to={`/products/${id}`} className="me-3">
//                         <img
//                             src={images}
//                             alt={title}
//                             className="rounded product-thumb"
//                         />
//                     </Link>
//                 </div>
//             </div>
//             <div className="col-10">
//                 <div className="wrapper">
//                     <div className="d-flex justify-content-between align-items-center">
//                         <Link to={`/products/${id}`} className="text-decoration-none text-dark">
//                             <h5 className="card-title mb-2">{title}</h5>
//                         </Link>
//                         <button onClick={onDeleteHandler} className="btn btn-outline-danger">
//                             <span>&times;</span>
//                         </button>
//                     </div>
//
//                     <div className="d-flex justify-content-between align-items-center">
//                         <p className="card-text mb-0 fw-semibold">${price}</p>
//
//                         <div className="input-group quantity-group">
//                             <button
//                                 onClick={onRemoveHandler}
//                                 className="btn btn-outline-secondary"
//                                 type="button"
//                             >
//                                 -
//                             </button>
//                             <input
//                                 type="text"
//                                 className="form-control text-center add-sub-input"
//                                 value={quantity}
//                                 readOnly
//                             />
//                             <button
//                                 onClick={onAddHandler}
//                                 className="btn btn-outline-secondary"
//                                 type="button"
//                             >
//                                 +
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }
//
// export default Item

import { useDispatch } from "react-redux";
import {
  addToCart,
  decreaseQuantity,
  deleteFromCart,
} from "../../../../redux/actions/cart-actions";
import { Link } from "react-router-dom";
import "./styles.css";

function Item({ data }) {
  const { id, productName, price, images, quantity } = data;
  const dispatch = useDispatch();

  const onAddHandler = () => dispatch(addToCart(data));
  const onRemoveHandler = () => dispatch(decreaseQuantity(data));
  const onDeleteHandler = () => dispatch(deleteFromCart(data));

  return (
    <div className="wrapper card p-3 mb-3">
      <div className="row g-3 align-items-stretch">
        {/* Left: Image */}
        <div className="col-3 d-flex align-items-center justify-content-center">
          <Link to={`/products/${id}`} className="d-block w-100">
            <img
              src={images}
              alt={productName}
              className="rounded product-thumb"
            />
          </Link>
        </div>

        {/* Right: Content */}
        <div className="col-9 d-flex flex-column justify-content-between">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <Link
              to={`/products/${id}`}
              className="text-decoration-none text-dark"
            >
              <h5 className="card-title mb-0">{productName}</h5>
            </Link>
            <button
              onClick={onDeleteHandler}
              className="btn btn-outline-danger btn-sm"
            >
              &times;
            </button>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <p className="card-text mb-0 fw-semibold">${price}</p>
            <div
              className="input-group quantity-group"
              style={{ width: "120px" }}
            >
              <button
                onClick={onRemoveHandler}
                className="btn btn-outline-secondary"
                type="button"
              >
                -
              </button>
              <input
                type="text"
                className="form-control text-center add-sub-input"
                value={quantity}
                readOnly
              />
              <button
                onClick={onAddHandler}
                className="btn btn-outline-secondary"
                type="button"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Item;
