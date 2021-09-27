import React, { Fragment } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../actions/authAction";
const Navbar = () => {
  const { isAuthenticated, loading } = useSelector(
    (state) => state.authReducer
  );
  const dispatch = useDispatch();
  const history = useHistory();
  const logoutLink = (
    <ul>
      <li>
        <Link to="/profile">
          <i className="fas fa-user">
            {" "}
            <span className="hide-sm">Profile</span>
          </i>
        </Link>
      </li>
      <li>
        <a onClick={() => dispatch(logout(history))} to="!#">
          <i className="fas fa-sign-out-alt">
            {" "}
            <span className="hide-sm">Logout</span>
          </i>
        </a>
      </li>
    </ul>
  );
  const authLink = (
    <ul>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="index.html">
          <i className="fas fa-code"></i> User-login
        </Link>
      </h1>
      {!loading && (
        <Fragment>{isAuthenticated ? logoutLink : authLink}</Fragment>
      )}
    </nav>
  );
};

export default Navbar;
