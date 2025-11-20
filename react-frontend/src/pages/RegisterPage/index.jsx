import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./styles.css";
import axios from "axios";

function RegisterPage() {
  const navigate = useNavigate();
  const [registrationError, setRegistrationError] = useState("");

  const initialValues = {
    name: "",
    username: "",
    email: "",
    password: "",
  };

  const onSubmit = (values) => {
    // Clear any previous errors
    setRegistrationError("");

    // map to backend DTO
    const registerPayload = {
      name: values.name,
      username: values.username,
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
        console.error("Registration failed:", error.response?.data);
        if (error.response?.data) {
          setRegistrationError(error.response.data);
        } else {
          setRegistrationError(
            "An error occurred during registration. Please try again."
          );
        }
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
    name: Yup.string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters"),
    username: Yup.string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
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

  const nameError = formik.errors.name && formik.touched.name;
  const usernameError = formik.errors.username && formik.touched.username;
  const emailError = formik.errors.email && formik.touched.email;
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
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  className={`form-control${nameError ? " is-invalid" : ""}`}
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {nameError ? (
                <small className="text-danger">{formik.errors.name}</small>
              ) : null}
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  className={`form-control${
                    usernameError ? " is-invalid" : ""
                  }`}
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {usernameError ? (
                <small className="text-danger">{formik.errors.username}</small>
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
            {registrationError && (
              <div className="alert alert-danger mt-3" role="alert">
                {registrationError}
              </div>
            )}
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
