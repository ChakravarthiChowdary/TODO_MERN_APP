import { AppDispatch } from "../store";

export const LOGIN_START = "LOGIN_START";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAIL = "LOGIN_FAIL";
export const SIGNUP_START = "SIGNUP_START";
export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS";
export const SIGNUP_FAIL = "SIGNUP_FAIL";
export const CLEAR_ERROR = "CLEAR_ERROR";
export const LOG_OUT = "LOG_OUT";

export const signupUser = (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch({ type: SIGNUP_START });
      let response = await fetch("http://localhost:5000/api/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then(async (res) => await res.json())
        .catch((err) => dispatch({ type: SIGNUP_FAIL, payload: err }));

      if (response.requestStatus === "Fail") {
        dispatch({ type: SIGNUP_FAIL, payload: response });
      }
      dispatch({ type: SIGNUP_SUCCESS });
    } catch (error) {
      dispatch({ type: SIGNUP_FAIL, payload: error });
    }
  };
};

export const login = (data: { email: string; password: string }) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch({ type: LOGIN_START });
      let response = await fetch("http://localhost:5000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then(async (res) => await res.json())
        .catch((err) => dispatch({ type: LOGIN_FAIL, payload: err }));

      if (response.requestStatus === "Fail") {
        dispatch({ type: LOGIN_FAIL, payload: response });
        return;
      }
      dispatch({ type: LOGIN_SUCCESS, payload: response });
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...response,
          expiration: new Date(
            new Date().getTime() + 1000 * 60 * 60
          ).toISOString(),
        })
      );
    } catch (error) {
      dispatch({ type: LOGIN_FAIL, payload: error });
    }
  };
};
