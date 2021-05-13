import Task, { TaskType } from "../../models/Task";
import { AppDispatch } from "../store";
import Axios from "axios";
import { User } from "../reducers/authReducer";

export const SAVE_TODO_START = "SAVE_TODO_START";
export const SAVE_TODO_FAIL = "SAVE_TODO_FAIL";
export const SAVE_TODO_SUCCESS = "SAVE_TODO_SUCCESS";
export const GET_TODOS_START = "GET_TODOS_START";
export const GET_TODOS_SUCCESS = "GET_TODOS_SUCCESS";
export const GET_TODOS_FAIL = "GET_TODOS_FAIL";
export const DELETE_TODO_START = "DELETE_TODO_START";
export const DELETE_TODO_SUCCESS = "DELETE_TODO_SUCCESS";
export const DELETE_TODO_FAIL = "DELETE_TODO_FAIL";
export const UPDATE_TODO_START = "UPDATE_TODO_START";
export const UPDATE_TODO_SUCCESS = "UPDATE_TODO_SUCCESS";
export const UPDATE_TODO_FAIL = "UPDATE_TODO_FAIL";

export const saveTodo = (todo: TaskType, user: User) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch({ type: SAVE_TODO_START });
      const postTodo = { ...todo };
      delete postTodo.id;

      const response = await fetch("http://localhost:5000/api/v1/todos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(postTodo),
      })
        .then(async (res) => await res.json())
        .catch((err) => dispatch({ type: SAVE_TODO_FAIL, payload: err }));

      dispatch({
        type: SAVE_TODO_SUCCESS,
        payload: new Task(
          response.title,
          response.description,
          response.userId,
          response.id
        ),
      });
    } catch (error) {
      dispatch({ type: SAVE_TODO_FAIL, payload: error });
    }
  };
};

export const getTodos = (userId: string, userToken: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch({ type: GET_TODOS_START });
      const response = await Axios.get(
        `http://localhost:5000/api/v1/todos/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      const todos: TaskType[] = [];

      for (let key in response.data.todos) {
        todos.push(
          new Task(
            response.data.todos[key].title,
            response.data.todos[key].description,
            response.data.todos[key].userId,
            response.data.todos[key].id
          )
        );
      }

      if (response.data) dispatch({ type: GET_TODOS_SUCCESS, payload: todos });
      else throw new Error("User doesnot have todos yet!");
    } catch (error) {
      dispatch({ type: GET_TODOS_FAIL, payload: error });
    }
  };
};

export const deleteTodo = (user: User, TodoId: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch({ type: DELETE_TODO_START });
      const response = await fetch(
        `http://localhost:5000/api/v1/todos/${TodoId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
        .then(async (res) => await res.json())
        .catch((err) => dispatch({ type: DELETE_TODO_FAIL, payload: err }));

      if (response.requestStatus === "Fail") {
        dispatch({ type: DELETE_TODO_FAIL, payload: response });
        return;
      }
      dispatch({ type: DELETE_TODO_SUCCESS, payload: TodoId });
    } catch (error) {
      dispatch({ type: DELETE_TODO_FAIL, payload: error });
    }
  };
};

export const updateTodo = (
  user: User,
  TodoId: string,
  data: { title: string; description: string }
) => {
  return async (dispatch: AppDispatch) => {
    try {
      console.log(data);
      dispatch({ type: UPDATE_TODO_START });
      const response = await fetch(
        `http://localhost:5000/api/v1/todos/${TodoId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(data),
        }
      )
        .then(async (res) => await res.json())
        .catch((err) => dispatch({ type: UPDATE_TODO_FAIL, payload: err }));
      if (response.requestStatus === "Fail") {
        dispatch({ type: UPDATE_TODO_FAIL, payload: response });
        return;
      }
      dispatch({
        type: UPDATE_TODO_SUCCESS,
        payload: {
          id: TodoId,
          title: data.title,
          description: data.description,
        },
      });
    } catch (error) {
      dispatch({ type: UPDATE_TODO_FAIL, payload: error });
    }
  };
};
