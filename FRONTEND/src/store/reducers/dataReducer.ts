import { AnyAction } from "redux";

import { TaskType } from "../../models/Task";
import { LOG_OUT } from "../actions/authActions";
import {
  DELETE_TODO_FAIL,
  DELETE_TODO_START,
  DELETE_TODO_SUCCESS,
  GET_TODOS_FAIL,
  GET_TODOS_START,
  GET_TODOS_SUCCESS,
  SAVE_TODO_FAIL,
  SAVE_TODO_START,
  SAVE_TODO_SUCCESS,
  UPDATE_TODO_START,
  UPDATE_TODO_SUCCESS,
  UPDATE_TODO_FAIL,
} from "../actions/dataActions";

interface DataState {
  todos: TaskType[];
  saveLoading: boolean;
  saveError: { message: string } | null;
  getLoading: boolean;
  getError: { message: string } | null;
  deleteLoading: boolean;
  deleteError: { message: string } | null;
}

const initialState: DataState = {
  todos: [],
  saveLoading: false,
  saveError: null,
  getLoading: false,
  getError: null,
  deleteLoading: false,
  deleteError: null,
};

const reducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case GET_TODOS_START:
      return {
        ...state,
        getLoading: true,
      };
    case GET_TODOS_SUCCESS:
      return {
        ...state,
        getLoading: false,
        getError: null,
        todos: action.payload,
      };
    case GET_TODOS_FAIL:
      return {
        ...state,
        getLoading: false,
        getError: action.payload,
      };
    case SAVE_TODO_START:
      return {
        ...state,
        saveLoading: true,
      };
    case SAVE_TODO_SUCCESS:
      const updatedTodos = [...state.todos];
      updatedTodos.push(action.payload);
      return {
        ...state,
        saveLoading: false,
        saveError: null,
        todos: updatedTodos,
      };
    case SAVE_TODO_FAIL:
      return {
        ...state,
        saveLoading: false,
        saveError: action.payload,
      };
    case DELETE_TODO_START:
      return {
        ...state,
        deleteLoading: true,
        deleteError: null,
      };
    case DELETE_TODO_SUCCESS:
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
        deleteLoading: false,
        deleteError: null,
      };
    case DELETE_TODO_FAIL:
      return {
        ...state,
        deleteLoading: false,
        deleteError: action.paylaod,
      };
    case UPDATE_TODO_START:
      return {
        ...state,
        updateLoading: true,
        updateError: null,
      };
    case UPDATE_TODO_SUCCESS:
      const foundTodo = state.todos.find(
        (todo) => todo.id === action.payload.id
      );
      let latestTodos: TaskType[] = [];
      if (foundTodo) {
        foundTodo.title = action.payload.title;
        foundTodo.description = action.payload.description;
        latestTodos = state.todos.filter(
          (todo) => todo.id !== action.payload.id
        );
        latestTodos.push(foundTodo);
      }
      return {
        ...state,
        updateLoading: false,
        updateError: null,
        todos: latestTodos,
      };
    case UPDATE_TODO_FAIL:
      return {
        ...state,
        updateLoading: false,
        updateError: action.payload,
      };
    case LOG_OUT:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
