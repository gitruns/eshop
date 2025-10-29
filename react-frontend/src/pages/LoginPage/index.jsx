import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'


function LoginPage() {
    const navigate = useNavigate()

    const [requestResponse, setRequestResponse] = useState({
        message: '',
        alertClass: ''
    })

    const initialValues = {
        email: '',
        password: ''
    }
    const onSubmit = values => {
        // console.log(values)
        axios.post('https://api.escuelajs.co/api/v1/auth/login', values)
            .then((response) => {
                // success
                setRequestResponse({
                    message: 'Login successful',
                    alertClass: 'alert alert-success'
                })
                localStorage.setItem('token', response.data.access_token)
                navigate('/')
            }, (error) => {
                // error
                setRequestResponse({
                    message: 'Login failed',
                    alertClass: 'alert alert-danger'
                })
            })
            .catch(err => console.error("Error fetching data:", err))
    }
    const validationSchema = Yup.object({
        email: Yup.string()
            .email('Invalid email format')
            .required('Email is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required')
    })


    return (
        <div className="container">
            <div className="row">
                <div className="col-md-3"></div>
                <div className="col-md-6">
                    <div className="wrapper">
                        <div role="alert" className={requestResponse.alertClass}>{requestResponse.message}</div>
                        <h2>Login</h2>
                        <hr />
                        <Formik
                            initialValues={initialValues}
                            onSubmit={onSubmit}
                            validationSchema={validationSchema}
                            validateOnMount={true}
                        >
                            {(formik) => {
                                const getClasses = (fieldName) => {
                                    return `form-control${formik.errors[fieldName] && formik.touched[fieldName] ? ' is-invalid' : ''}`
                                }

                                return (
                                    <Form>
                                        <div className="form-group">
                                            <label>Email</label>
                                            <Field
                                                type="email"
                                                name="email"
                                                // className={`form-control${emailError ? ' is-invalid' : ''}`}
                                                className={getClasses('email')}
                                            />
                                            <ErrorMessage name="email">
                                                {msg => <small className="text-danger">{msg}</small>}
                                            </ErrorMessage>
                                        </div>
                                        <div className="form-group">
                                            <label>Password</label>
                                            <Field
                                                type="password"
                                                name="password"
                                                // className={`form-control${passwordError ? ' is-invalid' : ''}`}
                                                // className={`form-control${formik.errors.password && formik.touched.password ? ' is-invalid' : ''}`}
                                                className={getClasses('password')}
                                            />
                                            <ErrorMessage name="password">
                                                {msg => <small className="text-danger">{msg}</small>}
                                            </ErrorMessage>
                                        </div>
                                        <input type="submit" value="Login" className="btn btn-primary btn-block"
                                            disabled={!formik.isValid}
                                        />
                                    </Form>
                                )
                            }}
                        </Formik>
                        <div className="mt-2 text-center">
                            <p>Don't have an account? <Link to="/register">Register</Link></p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3"></div>
            </div>
        </div >
    )
}

export default LoginPage