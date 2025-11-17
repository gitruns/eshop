import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./styles.css";
import axios from "axios";

function RegisterPage() {
  const navigate = useNavigate();

  const initialValues = {
    firstName: "",
    email: "",
    mobile: "",
    password: "",
  };

  const onSubmit = (values) => {
    // map to backend DTO
    const registerPayload = {
      name: values.firstName,
      email: values.email,
      password: values.password,
      role: "ROLE_USER", // Default role
    };

    axios
      .post("http://localhost:9191/api/auth/register", registerPayload)
      .then((response) => {
        console.log("Registration successful:", response.data);
        navigate("/login");
      })
      .catch((error) => {
        console.error("Registration failed:", error.response.data);
      });

    console.log(values);
  };

  // const validate = (values) => {
  //     let errors = {}
  //     if (!values.firstName) {
  //         errors.firstName = "First Name is required"
  //     }
  //     if (!values.email) {
  //         errors.email = "email is required"
  //     } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
  //         errors.email = "Invalid email format"
  //     }
  //     if (!values.mobile) {
  //         errors.mobile = "mobile is required"
  //     } else if (values.mobile.length !== 10) {
  //         errors.mobile = "Mobile number must be 10 digits"
  //     }
  //     if (!values.password) {
  //         errors.password = "password is required"
  //     } else if (values.password.length < 6) {
  //         errors.password = "Password must be at least 6 characters"
  //     }
  //     return errors
  // }
  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    mobile: Yup.string()
      .required("Mobile is required")
      .min(10, "Mobile number must be 10 digits"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  const formik = useFormik({
    initialValues,
    onSubmit,
    // validate,
    validationSchema,
    validateOnMount: true,
  });

  const firstNameError = formik.errors.firstName && formik.touched.firstName;
  const emailError = formik.errors.email && formik.touched.email;
  const mobileError = formik.errors.mobile && formik.touched.mobile;
  const passwordError = formik.errors.password && formik.touched.password;

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-3"></div>
        <div className="col-md-6">
          <div className="wrapper">
            <h2>Register New Account</h2>
            <hr />
            <form onSubmit={formik.handleSubmit}>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className={`form-control${
                    firstNameError ? " is-invalid" : ""
                  }`}
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {firstNameError ? (
                <small className="text-danger">{formik.errors.firstName}</small>
              ) : null}
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  className={`form-control${emailError ? " is-invalid" : ""}`}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {emailError ? (
                <small className="text-danger">{formik.errors.email}</small>
              ) : null}
              <div className="form-group">
                <label>Mobile</label>
                <input
                  type="tel"
                  name="mobile"
                  className={`form-control${mobileError ? " is-invalid" : ""}`}
                  value={formik.values.mobile}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {mobileError ? (
                <small className="text-danger">{formik.errors.mobile}</small>
              ) : null}
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  className={`form-control${
                    passwordError ? " is-invalid" : ""
                  }`}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {passwordError ? (
                <small className="text-danger">{formik.errors.password}</small>
              ) : null}
              <input
                type="submit"
                value="Register"
                className="btn btn-primary btn-block"
                disabled={!formik.isValid}
              />
            </form>
            <div className="mt-2 text-center">
              <p>
                Already Registered? <Link to="/login">Login</Link>
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3"></div>
      </div>
    </div>
  );
}

export default RegisterPage;
