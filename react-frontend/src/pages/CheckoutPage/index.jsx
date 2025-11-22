import Navbar from "../../components/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { clearCart } from "../../redux/actions/cart-actions";
import axiosInstance from "../../api/axiosConfig";

function CheckoutPage() {
  const cart = useSelector((state) => state.carts);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    nameOnCard: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // If cart is empty, redirect to cart page
  useEffect(() => {
    if (cart.length === 0) {
      navigate("/cart");
    }
  }, [cart, navigate]);

  // Calculate totals
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = 13.71;
  const total = subtotal + shipping;

  const handleShippingChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handlePaymentChange = (e) => {
    setPaymentInfo({
      ...paymentInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError("");

    try {
      // Prepare checkout data - transform cart items to match backend model
      const checkoutData = {
        cartItems: cart.map((item) => ({
          productId: item.id, // Map 'id' to 'productId'
          name: item.productName, // Map 'productName' to 'name'
          quantity: item.quantity, // Map quantity
          price: item.price, // Map price
        })),
        shippingInfo,
        paymentInfo: {
          ...paymentInfo,
          // Convert to payment method - assuming credit card for now
          method: "CREDIT_CARD",
        },
        totalAmount: total,
      };

      // Call order placement API
      console.log("Sending checkout request:", checkoutData);
      const response = await axiosInstance.post(
        "/api/orders/checkout",
        checkoutData
      );

      console.log("Checkout response:", {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers,
      });

      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        console.log("Order placed successfully, order ID:", response.data);
        dispatch(clearCart());
        // Redirect to order confirmation or success page
        setTimeout(() => {
          navigate("/order-confirmation", {
            state: { orderId: response.data },
          });
        }, 1000); // Small delay to show success message
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      // Try multiple ways to extract error message
      let errorMessage = "An error occurred during checkout";

      if (err.response?.data) {
        if (typeof err.response.data === "string") {
          errorMessage = err.response.data;
        } else if (err.response.data.errorMessage) {
          errorMessage = err.response.data.errorMessage;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        } else if (err.response.data.errorDetails) {
          errorMessage = err.response.data.errorDetails;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const cartItemElements = cart.map((item) => (
    <div
      key={item.id}
      className="d-flex justify-content-between align-items-center border-bottom py-2"
    >
      <div className="d-flex align-items-center">
        <img
          src={item.images}
          alt={item.productName}
          style={{
            width: "50px",
            height: "50px",
            objectFit: "cover",
            marginRight: "10px",
          }}
        />
        <div>
          <h6 className="mb-0">{item.productName}</h6>
          <small className="text-muted">Quantity: {item.quantity}</small>
        </div>
      </div>
      <span>${(item.price * item.quantity).toFixed(2)}</span>
    </div>
  ));

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <div className="row">
          <div className="col-lg-8">
            <h2 className="mb-4">Checkout</h2>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success" role="alert">
                Order placed successfully!
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Shipping Information */}
              <div className="card mb-4">
                <div className="card-header">
                  <h5>Shipping Information</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="firstName" className="form-label">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        name="firstName"
                        value={shippingInfo.firstName}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="lastName" className="form-label">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        name="lastName"
                        value={shippingInfo.lastName}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">
                      Address
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="address"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-3 mb-3">
                      <label htmlFor="city" className="form-label">
                        City
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="city"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label htmlFor="state" className="form-label">
                        State
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="state"
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label htmlFor="zipCode" className="form-label">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="zipCode"
                        name="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label htmlFor="country" className="form-label">
                        Country
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="country"
                        name="country"
                        value={shippingInfo.country}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="card mb-4">
                <div className="card-header">
                  <h5>Payment Information</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label htmlFor="cardNumber" className="form-label">
                      Card Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="cardNumber"
                      name="cardNumber"
                      value={paymentInfo.cardNumber}
                      onChange={handlePaymentChange}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="nameOnCard" className="form-label">
                        Name on Card
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="nameOnCard"
                        name="nameOnCard"
                        value={paymentInfo.nameOnCard}
                        onChange={handlePaymentChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="cvv" className="form-label">
                        CVV
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="cvv"
                        name="cvv"
                        value={paymentInfo.cvv}
                        onChange={handlePaymentChange}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="expiryMonth" className="form-label">
                        Expiry Month
                      </label>
                      <select
                        className="form-select"
                        id="expiryMonth"
                        name="expiryMonth"
                        value={paymentInfo.expiryMonth}
                        onChange={handlePaymentChange}
                        required
                      >
                        <option value="">Month</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (month) => (
                            <option key={month} value={month}>
                              {month}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="expiryYear" className="form-label">
                        Expiry Year
                      </label>
                      <select
                        className="form-select"
                        id="expiryYear"
                        name="expiryYear"
                        value={paymentInfo.expiryYear}
                        onChange={handlePaymentChange}
                        required
                      >
                        <option value="">Year</option>
                        {Array.from(
                          { length: 10 },
                          (_, i) => new Date().getFullYear() + i
                        ).map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg w-100"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Processing Payment...
                  </>
                ) : (
                  `Place Order - $${total.toFixed(2)}`
                )}
              </button>
            </form>
          </div>

          <div className="col-lg-4">
            <div className="card">
              <div className="card-header">
                <h5>Order Summary</h5>
              </div>
              <div className="card-body">
                {cartItemElements}
                <div className="d-flex justify-content-between py-2 border-top">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span>Shipping:</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between py-2 fw-bold">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CheckoutPage;
