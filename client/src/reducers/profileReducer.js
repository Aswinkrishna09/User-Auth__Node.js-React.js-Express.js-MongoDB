import {
  CLEAR_PROFILE,
  GET_PROFILE,
  GET_PROFILE_ERROR,
  UPDATE_PROFILE,
} from "../actions/types";

const initialState = {
  profile: null,
  repos: [],
  loading: true,
  error: {},
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case GET_PROFILE:
    case UPDATE_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false,
      };
    case GET_PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        repos: [],
        loading: false,
      };
    default:
      return state;
  }
}
