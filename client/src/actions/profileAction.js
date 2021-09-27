import axios from "axios";
import {
  ACCOUNT_DELETED,
  CLEAR_PROFILE,
  GET_PROFILE,
  GET_PROFILE_ERROR,
} from "../actions/types";
import { setAlert } from "./alertAction";
import { useHistory } from "react-router";

export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/users/me");
    console.log(res.data.profile)
    dispatch({ type: GET_PROFILE, payload: res.data.profile });
  } catch (err) {
    dispatch({
      type: GET_PROFILE_ERROR,
      payload: { msg: err.response.data.msg, status: err.response.status },
    });
  }
};

export const createProfile =
  (formData, history = false) =>
  async (dispatch) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await axios.post("/api/users/update", formData, config);
      if(res.data.exist){
        return dispatch(setAlert("User Already Exist with the Email use a different one","danger"))
      }
      if(res.data.passErr){
        return dispatch(setAlert("password must have atleast 6 characters","danger"))
      }
      dispatch(
        setAlert("Profile Updated", "success")
      );
      history.push('/profile')
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }
      dispatch({
        type: GET_PROFILE_ERROR,
        payload: { msg: err.response.data.msg, status: err.response.status },
      });
    }
  };

export const deleteAccount = (history) => async (dispatch) => {
  
  if (window.confirm("Are you sure you want to delete your account")) {
    try {
      const res = await axios.delete(`/api/users`);
      dispatch({ type: CLEAR_PROFILE });
      dispatch({ type: ACCOUNT_DELETED });
      dispatch(setAlert("Your Account has been permenantly deleted"));
      history.push("/login");
    } catch (err) {
      dispatch({
        type: GET_PROFILE_ERROR,
        payload: { msg: err.response.data.msg, status: err.response.status },
      });
    }
  }
};
