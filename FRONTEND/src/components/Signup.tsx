import React, { useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Snackbar, { SnackbarCloseReason } from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import { Link as RouterLink } from "react-router-dom";
import Container from "@material-ui/core/Container";
import { useDispatch } from "react-redux";

import { CLEAR_ERROR } from "../store/actions/authActions";
import { signupUser } from "../store/actions/authActions";
import { useAppSelector } from "../store/store";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        TODO MERN APP
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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export function ValidateEmail(mail: string) {
  if (
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      mail
    )
  ) {
    return true;
  }
  return false;
}

export default function SignUp() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { signUpError, signUpLoading, signUpSuccess } = useAppSelector(
    (state) => state.auth
  );
  const [formData, setFormData] = useState({
    firstName: {
      value: "",
      error: false,
      changed: false,
    },
    lastName: {
      value: "",
      error: false,
      changed: false,
    },
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
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const textChangedHandler = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    name: string
  ) => {
    if (name === "firstName") {
      setFormData({
        ...formData,
        firstName: {
          value: e.target.value,
          error: e.target.value.length < 3,
          changed: true,
        },
      });
    }
    if (name === "lastName") {
      setFormData({
        ...formData,
        lastName: {
          value: e.target.value,
          error: e.target.value.length < 3,
          changed: true,
        },
      });
    }
    if (name === "email") {
      setFormData({
        ...formData,
        email: {
          value: e.target.value,
          error: !ValidateEmail(e.target.value),
          changed: true,
        },
      });
    }
    if (name === "password") {
      setFormData({
        ...formData,
        password: {
          value: e.target.value,
          error: e.target.value.length < 6,
          changed: true,
        },
      });
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
    dispatch({ type: CLEAR_ERROR });
  };

  const signUpClickedHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    let message = "";
    if (formData.firstName.error) {
      message = "First name must be 3 characters long";
    }
    if (formData.lastName.error) {
      message = message + " Last name must be 3 character long";
    }
    if (formData.email.error) {
      message = message + " Please enter a valid email";
    }
    if (formData.password.error) {
      message = message + " Password must be 6 characters long.";
    }
    if (message !== "") {
      setOpen(true);
      setMessage(message);
      return;
    }
    if (
      formData.firstName.changed &&
      formData.lastName.changed &&
      formData.password.changed &&
      formData.email.changed
    ) {
      dispatch(
        signupUser({
          name: formData.firstName.value + " " + formData.lastName.value,
          email: formData.email.value,
          password: formData.password.value,
        })
      );
      setFormData({
        firstName: {
          value: "",
          error: false,
          changed: false,
        },
        lastName: {
          value: "",
          error: false,
          changed: false,
        },
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
    }
  };
  useEffect(() => {
    if (signUpError) {
      setOpen(true);
      setMessage(signUpError.message);
    }
  }, [signUpError, dispatch]);

  useEffect(() => {
    if (signUpSuccess) {
      setOpen(true);
      setMessage("Sign up successful. Login Now !");
    }
  }, [signUpSuccess, dispatch]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                onChange={(e) => textChangedHandler(e, "firstName")}
                value={formData.firstName.value}
                error={formData.firstName.error}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                onChange={(e) => textChangedHandler(e, "lastName")}
                value={formData.lastName.value}
                error={formData.lastName.error}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={(e) => textChangedHandler(e, "email")}
                value={formData.email.value}
                error={formData.email.error}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(e) => textChangedHandler(e, "password")}
                value={formData.password.value}
                error={formData.password.error}
              />
            </Grid>
          </Grid>
          {signUpLoading ? (
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
              onClick={(e) => signUpClickedHandler(e)}
            >
              Sign Up
            </Button>
          )}
          <Grid container justify="flex-end">
            <Grid item>
              <RouterLink to="/">Already have an account? Sign in</RouterLink>
            </Grid>
          </Grid>
        </form>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity={signUpSuccess ? "success" : "error"}
          >
            {message}
          </Alert>
        </Snackbar>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
