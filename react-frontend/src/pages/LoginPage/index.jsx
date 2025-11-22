import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "../../api/axiosConfig";

function LoginPage() {
  const navigate = useNavigate();

  const [requestResponse, setRequestResponse] = useState({
    message: "",
    alertClass: "",
  });

  const initialValues = {
    email: "",
    password: "",
  };
  const onSubmit = (values) => {
    // map to backend DTO
    const loginPayload = {
      usernameOrEmail: values.email,
      password: values.password,
    };
    // console.log(values)
    // axios.post('https://api.escuelajs.co/api/v1/auth/login', values)
    axios
      .post("/api/auth/login", loginPayload)
      .then(
        (response) => {
          // success
          setRequestResponse({
            message: "Login successful",
            alertClass: "alert alert-success",
          });
          // localStorage.setItem('token', response.data.access_token)
          localStorage.setItem("token", response.data);
          navigate("/");
        },
        (error) => {
          // error
          setRequestResponse({
            message: "Login failed",
            alertClass: "alert alert-danger",
          });
        }
      )
      .catch((err) => console.error("Error fetching data:", err));
  };
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-3"></div>
        <div className="col-md-6">
          <div className="wrapper">
            <div role="alert" className={requestResponse.alertClass}>
              {requestResponse.message}
            </div>
            <h2>Login</h2>
            <hr />
            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              validationSchema={validationSchema}
              validateOnMount={true}
            >
              {(formik) => {
                return (
                  <Form>
                    <div className="form-group mb-4">
                      <label className="fw-medium text-dark mb-2">Email</label>
                      <Field
                        type="email"
                        name="email"
                        className="form-control rounded-lg py-sm-custom px-md-custom"
                      />
                      <ErrorMessage name="email">
                        {(msg) => (
                          <small className="text-danger mt-1">{msg}</small>
                        )}
                      </ErrorMessage>
                    </div>
                    <div className="form-group mb-4">
                      <label className="fw-medium text-dark mb-2">
                        Password
                      </label>
                      <Field
                        type="password"
                        name="password"
                        className="form-control rounded-lg py-sm-custom px-md-custom"
                      />
                      <ErrorMessage name="password">
                        {(msg) => (
                          <small className="text-danger mt-1">{msg}</small>
                        )}
                      </ErrorMessage>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary w-100 fw-medium rounded-lg mt-4 py-sm-custom px-md-custom"
                      disabled={!formik.isValid}
                    >
                      Login
                    </button>
                  </Form>
                );
              }}
            </Formik>
            <div className="mt-2 text-center">
              <p>
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3"></div>
      </div>
    </div>
  );
}

export default LoginPage;
