import React, { Fragment, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { deleteAccount, getCurrentProfile } from "../../actions/profileAction";
import Spinner from "../layout/Spinner";
const Profile = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.profileReducer);
  const delAcc = (e) => {
    dispatch(deleteAccount(history));
  };
  useEffect(() => {
    dispatch(getCurrentProfile());
  }, []);
  return (
    <Fragment>
      {loading || profile === null ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="large text-primary">Profile</h1>
          <div className="row">
            <div className="col-md-4"></div>
            <div className="col-md-4">
              <h1>
                name :{" "}
                {profile.name && (
                  <span className="hide-sm">{profile.name}</span>
                )}{" "}
              </h1>{" "}
              <br />
              <h1>
                email:{" "}
                {profile.email && (
                  <span className="hide-sm">{profile.email}</span>
                )}{" "}
              </h1>{" "}
              <br />
              <h1>
                Age :{" "}
                {profile.age && <span className="hide-sm">{profile.age}</span>}
              </h1>{" "}
              <br />
              <h1>
                phone :{" "}
                {profile.phone && (
                  <span className="hide-sm">{profile.phone}</span>
                )}
              </h1>{" "}
              <br />
              <h1>
                place :{" "}
                {profile.place && (
                  <span className="hide-sm">{profile.place}</span>
                )}
              </h1>{" "}
              <br />
            </div>
            <div className="col-md-4"></div>
          </div>

          <Link to="/edit-profile" className="btn btn-primary">
            <i className="fas fa-user-circle text-primary"></i> Edit Profile
          </Link>
          <button className="btn btn-danger" onClick={(e) => delAcc(e)}>
            <i className="fas fa-user-circle text-primary"></i> Delete Account
          </button>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Profile;
