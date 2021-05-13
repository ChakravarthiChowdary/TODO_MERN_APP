import React, { useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Snackbar, { SnackbarCloseReason } from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import Container from "@material-ui/core/Container";
import { Link as RouterLink } from "react-router-dom";

import { ValidateEmail } from "./Signup";
import { useDispatch } from "react-redux";
import { login } from "../store/actions/authActions";
import { useAppSelector } from "../store/store";
import { CircularProgress } from "@material-ui/core";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        TODO MERN App
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: {
      value: "",
      error: false,
      changed: false,
    },
    password: {
      value: "",
      error: false,
      changed: false,
    },
  });

  const inputChangedHandler = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    name: string
  ) => {
    if (name === "password") {
      setFormData({
        ...formData,
        password: {
          value: e.target.value,
          error: false,
          changed: true,
        },
      });
    } else {
      setFormData({
        ...formData,
        email: {
          value: e.target.value,
          error: !ValidateEmail(e.target.value),
          changed: true,
        },
      });
    }
  };

  const loginClickedHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    let message = "";
    if (formData.email.error) {
      message = "Invalid Email !";
    }
    if (message !== "") {
      setOpen(true);
      setMessage(message);
      return;
    }
    if (formData.email.changed && formData.password.changed) {
      dispatch(
        login({
          email: formData.email.value,
          password: formData.password.value,
        })
      );
    }
  };

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
    if (error) {
      setOpen(true);
      setMessage(error.message);
    }
  }, [error]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(e) => inputChangedHandler(e, "email")}
            error={formData.email.error}
            value={formData.email.value}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => inputChangedHandler(e, "password")}
            error={formData.password.error}
            value={formData.password.value}
          />
          {loading ? (
            <CircularProgress
              color="secondary"
              size={20}
              className="my-4 d-block mx-auto"
            />
          ) : (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={(e) => loginClickedHandler(e)}
            >
              Sign In
            </Button>
          )}
          <Grid container justify="flex-end">
            <Grid item>
              <RouterLink to="/signup">
                {"Don't have an account? Sign Up"}
              </RouterLink>
            </Grid>
          </Grid>
        </form>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error">
            {message}
          </Alert>
        </Snackbar>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
