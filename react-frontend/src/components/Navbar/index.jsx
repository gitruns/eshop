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
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-2 py-1">
      <Link className="navbar-brand px-0" to="/">
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
          <li className="nav-item">
            <Link className="nav-link" to="/products">
              Products <span className="sr-only">(current)</span>
            </Link>
          </li>
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
        <div className="form-inline d-flex align-items-center">
          <Link
            to="/cart"
            className={
              "btn mr-2 position-relative d-flex align-items-center justify-content-center rounded-lg p-2 " +
              (cart.length > 0 ? "btn-success" : "btn-outline-success")
            }
          >
            <i className="bx bx-cart bx-sm"></i>
            {cart.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger badge-custom-padding">
                {cart.length}
              </span>
            )}
          </Link>

          {isLoggedIn ? (
            <button
              className="btn btn-outline-danger d-flex align-items-center rounded-lg py-sm-custom px-md-custom"
              onClick={onLogoutHandler}
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="btn btn-outline-success d-flex align-items-center rounded-lg py-sm-custom px-md-custom"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
