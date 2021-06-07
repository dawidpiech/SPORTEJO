import React, { useEffect, useState } from "react";
import { Switch, Route, useHistory, withRouter } from "react-router-dom";

import Login from "./user/pages/Login";
import Home from "./home/Home";
import Registration from "./user/pages/Registration";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import Header from "./shared/components/Header/Header";
import errorPage from "./errorPage/errorPage";
import "./shared/util/conf.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthContext } from "./shared/context/auth-context";
import Favorites from "./user/pages/Favorites";
import Dashboard from "./user/pages/Dashboard";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userID, setUserID] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const history = useHistory();

  const login = () => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    setLoggedIn(true);
    setUserID(storedData.id);
    setName(storedData.username);
    setAvatar(storedData.avatar);
  };

  const logout = () => {
    setLoggedIn(false);
    window.localStorage.removeItem("userData");
    history.push("/");
  };

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));

    if (storedData) {
      setLoggedIn(true);
      setUserID(storedData.id);
      setName(storedData.username);
      setAvatar(storedData.avatar);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: loggedIn,
        userId: userID,
        userName: name,
        avatar: avatar,
        login: login,
        logout: logout,
      }}
    >
      <MainNavigation></MainNavigation>
      <Header></Header>
      <main>
        <Switch>
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Registration} />
          <Route path="/" exact component={Home} />
          <Route path="/favorites" exact component={Favorites} />
          <Route path="/dashboard" exact component={Dashboard} />
          <Route component={errorPage} />
        </Switch>
      </main>
    </AuthContext.Provider>
  );
};

export default withRouter(App);
