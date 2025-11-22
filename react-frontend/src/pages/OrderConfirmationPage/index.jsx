import Navbar from "../../components/Navbar";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

function OrderConfirmationPage() {
  const location = useLocation();
  const orderId = location.state?.orderId;

  useEffect(() => {
    // Redirect to home if no order ID (direct navigation to this page)
    if (!orderId) {
      window.location.href = "/";
    }
  }, [orderId]);

  if (!orderId) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="text-center">
              {/* Success Icon */}
              <div className="mb-4">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-success"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M8 12l2 2 4-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h2 className="mb-3 text-success">Order Confirmed!</h2>
              <p className="lead mb-4">
                Thank you for your purchase. Your order has been successfully
                placed.
              </p>

              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <h5 className="card-title">Order Details</h5>
                  <div className="row">
                    <div className="col-sm-6">
                      <strong>Order Number:</strong>
                      <p className="mb-2">#{orderId}</p>
                    </div>
                    <div className="col-sm-6">
                      <strong>Date:</strong>
                      <p className="mb-2">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="alert alert-info">
                    <small>
                      <i className="fas fa-info-circle me-1"></i>
                      You will receive an email confirmation shortly with order
                      details and tracking information.
                    </small>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-center gap-3">
                <Link to="/" className="btn btn-primary">
                  <i className="fas fa-home me-2"></i>
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderConfirmationPage;
