import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";

import TodoList from "./components/TodoList";
import NavBar from "./components/NavBar";
import Login from "./components/Login";
import SignUp from "./components/Signup";
import { useAppSelector } from "./store/store";
import { useDispatch } from "react-redux";
import { LOGIN_SUCCESS, LOG_OUT } from "./store/actions/authActions";

const App: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      const parseduser = JSON.parse(user);

      if (parseduser) {
        if (new Date(parseduser.expiration) > new Date())
          dispatch({ type: LOGIN_SUCCESS, payload: parseduser });
        else dispatch({ type: LOG_OUT });
      }
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <div className="App">
        <NavBar />
        <Switch>
          {user ? (
            <Route path="/">
              <TodoList />
            </Route>
          ) : (
            <>
              <Route path="/" exact>
                <Login />
              </Route>
              <Route path="/signup">
                <SignUp />
              </Route>
            </>
          )}
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default App;
