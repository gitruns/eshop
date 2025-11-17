import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const cart = useSelector((state) => state.carts);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [isLoggedIn]);

  const onLogoutHandler = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Link className="navbar-brand" to="/">
        EShop
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <Link className="nav-link" to="/">
              Home <span className="sr-only">(current)</span>
            </Link>
          </li>
          {/* <li className="nav-item"> */}
          {/*     <Link className="nav-link" to="/products">Products <span className="sr-only">(current)</span></Link> */}
          {/* </li> */}
          <li className="nav-item">
            <Link className="nav-link" to="/about">
              About <span className="sr-only">(current)</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/contact">
              Contact
            </Link>
          </li>
        </ul>
        <div className="form-inline my-2 my-lg-0">
          <Link
            to="/cart"
            className={
              "btn mr-2 position-relative" +
              (cart.length > 0 ? " btn-success" : " btn-outline-success")
            }
          >
            <i className="bx bx-cart bx-sm"></i>
            {cart.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cart.length}
              </span>
            )}
          </Link>

          {/* <Link to="/cart" className="btn btn-outline-success mr-2">Cart ({cart.length})</Link> */}
          {/* <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" /> */}
          {/* <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button> */}
          {isLoggedIn ? (
            <button
              className="btn btn-outline-danger"
              onClick={onLogoutHandler}
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="btn btn-outline-success">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
