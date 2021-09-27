import React, { Fragment, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { setAlert } from "../../actions/alertAction";
import { register } from "../../actions/authAction";
const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    conformPassword: "",
  });
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state) => state.authReducer.isAuthenticated
  );
  if (isAuthenticated) {
    return <Redirect to="/profile" />;
  }
  const { name, email, password, conformPassword } = formData;
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password != conformPassword) {
      dispatch(setAlert("password do not match", "danger"));
    } else {
      dispatch(register({ name, email, password }));
    }
  };

  return (
    <Fragment>
      <section className="container">
        <h1 className="large text-primary">Sign Up</h1>
        <p className="lead">
          <i className="fas fa-user"></i> Create Your Account
        </p>
        <form className="form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={name}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={email}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              name="conformPassword"
              value={conformPassword}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <input
            type="submit"
            className="btn btn-primary"
            value="Register"
            onClick={(e) => handleSubmit(e)}
          />
        </form>
        <p className="my-1">
          Already have an account? <a href="/login">Sign In</a>
        </p>
      </section>
    </Fragment>
  );
};

export default Register;
