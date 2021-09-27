import React, { Fragment, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { setAlert } from "../../actions/alertAction";
import { createProfile, getCurrentProfile } from "../../actions/profileAction";
const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    place: "",
    phone: "",
    password:'',
    email:''
  });
  const { profile, loading } = useSelector((state) => state.profileReducer);
  useEffect(() => {
    dispatch(getCurrentProfile());
    setFormData({
      name: loading || !profile.name ? "" : profile.name,
      age: loading || !profile.age ? "" : profile.age,
      place: loading || !profile.place ? "" : profile.place,
      phone: loading || !profile.phone ? "" : profile.phone,
      email: loading || !profile.email ? "" : profile.email,
    });
  }, [loading]);

  const [socialToggle, setSocialToggle] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const history = useHistory();
  const dispatch = useDispatch();
  const { name, age, place, phone,password } = formData;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
      dispatch(createProfile(formData, history));
    
  };

  return (
    <Fragment>
      <h1 className="large text-primary">Update Your details</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Update your profile informations
      </p>
      <form className="form" onSubmit={(e) => handleSubmit(e)}>
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
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => handleChange(e)}
            name="phone"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Age"
            value={age}
            onChange={(e) => handleChange(e)}
            name="age"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Place"
            value={place}
            onChange={(e) => handleChange(e)}
            name="place"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Password"
            value={password}
            onChange={(e) => handleChange(e)}
            name="password"
          />
        </div>
        <input type="submit" className="btn btn-primary my-1" value='Update'/>
      </form>
    </Fragment>
  );
};

export default EditProfile;
