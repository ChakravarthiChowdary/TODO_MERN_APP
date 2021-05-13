import { AnyAction } from "redux";

import {
  SIGNUP_START,
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  CLEAR_ERROR,
  LOGIN_START,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOG_OUT,
} from "../actions/authActions";

export interface User {
  name: string;
  email: string;
  token: string;
  id: string;
}

interface AuthState {
  user: { name: string; email: string; token: string; id: string } | null;
  loading: boolean;
  error: { message: string; statusCode: number; status: string } | null;
  signUpLoading: boolean;
  signUpError: { message: string } | null;
  signUpSuccess: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  signUpLoading: false,
  signUpError: null,
  signUpSuccess: false,
};

const reducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case SIGNUP_START:
      return {
        ...state,
        signUpLoading: true,
        signUpError: null,
        signUpSuccess: false,
      };
    case SIGNUP_SUCCESS:
      return {
        ...state,
        signUpLoading: false,
        signUpError: null,
        signUpSuccess: true,
      };
    case SIGNUP_FAIL:
      return {
        ...state,
        signUpLoading: false,
        signUpError: action.payload,
        signUpSuccess: false,
      };
    case CLEAR_ERROR:
      return {
        ...state,
        signUpError: null,
        signUpSuccess: false,
        error: null,
      };
    case LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        user: action.payload.userInfo,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        user: null,
      };
    case LOG_OUT:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export default reducer;
