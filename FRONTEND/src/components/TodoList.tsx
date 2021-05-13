import React, { useEffect, useState } from "react";
import CreateTask from "./CreateTask";
import Card from "./Card";
import { useAppSelector } from "../store/store";
import { TaskType } from "../models/Task";
import { getTodos } from "../store/actions/dataActions";
import { useDispatch } from "react-redux";
import { Spinner } from "reactstrap";
import { Paper } from "@material-ui/core";
import Snackbar, { SnackbarCloseReason } from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

const TodoList = () => {
  const [modal, setModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<null | { message: string }>(null);
  const dispatch = useDispatch();
  const { todos, getLoading, deleteError, saveError, getError } =
    useAppSelector((state) => state.todos);
  const { user } = useAppSelector((state) => state.auth);

  const handleClose = (
    event: React.SyntheticEvent<any, Event>,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    dispatch(getTodos(user.id, user.token));
  }, [dispatch, user]);

  useEffect(() => {
    if (deleteError || saveError || getError) {
      setOpen(true);
      if (deleteError) setError(deleteError);
      else if (saveError) setError(saveError);
      else setError(getError);
    }
  }, [deleteError, saveError, getError]);

  const toggle = () => {
    setModal(!modal);
  };

  return (
    <>
      {getLoading ? (
        <div className="center-spinner">
          <Spinner />
        </div>
      ) : todos.length > 0 ? (
        <div className="task-container">
          {todos.length > 0 &&
            todos.map((task: TaskType, index: number) => (
              <Card task={task} index={index} key={task.id} />
            ))}
        </div>
      ) : (
        <div className="center-spinner">
          <Paper className="p-4" elevation={4}>
            <h5>No TODOs found ! Try adding some</h5>
          </Paper>
        </div>
      )}
      <CreateTask toggle={toggle} modal={modal} />
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          {error && error.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default TodoList;
