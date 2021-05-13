import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";

import CreateTask from "./CreateTask";
import { useAppSelector } from "../store/store";
import { useDispatch } from "react-redux";
import { LOG_OUT } from "../store/actions/authActions";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function NavBar() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal);
  };

  const logoutClickedHandler = () => {
    localStorage.removeItem("user");
    dispatch({ type: LOG_OUT });
  };

  const loginClickedHandler = () => {
    history.replace("/");
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            TODO MERN APP
          </Typography>
          {user && (
            <Button color="inherit" onClick={toggle}>
              Create Task
            </Button>
          )}
          <Button
            color="inherit"
            onClick={user ? logoutClickedHandler : loginClickedHandler}
          >
            {user ? "Log Out" : "Log In"}
          </Button>
        </Toolbar>
      </AppBar>
      <CreateTask toggle={toggle} modal={modal} />
    </div>
  );
}
