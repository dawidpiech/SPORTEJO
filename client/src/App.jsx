import React, { useEffect, useState } from "react";
import { Switch, Route, useHistory, withRouter } from "react-router-dom";
import Axios from "axios";
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
import AddNewObject from "./objects/AddNewObject";
import EditProfile from "./user/pages/EditProfile";
import Search from "./objects/Search";
import ObjectView from "./objects/ObjectView";
import { library } from "@fortawesome/fontawesome-svg-core";
import * as Icons from "@fortawesome/free-solid-svg-icons";
require("dotenv").config();

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userID, setUserID] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [email, setEmail] = useState("");
  const history = useHistory();
  const iconList = Object.keys(Icons)
    .filter((key) => key !== "fas" && key !== "prefix")
    .map((icon) => Icons[icon]);
  library.add(...iconList);

  const login = () => {
    if (localStorage.getItem("userData") !== null) {
      const storedData = JSON.parse(localStorage.getItem("userData"));
      setLoggedIn(true);
      setUserID(storedData.id);
      setName(storedData.username);
      setAvatar(storedData.avatar);
      setEmail(storedData.email);
    } else {
      setLoggedIn(false);
      setUserID("");
      setName("");
      setAvatar("");
      setEmail("");
    }
  };

  const logout = () => {
    setLoggedIn(false);
    setUserID("");
    setName("");
    setAvatar("");
    setEmail("");
    window.localStorage.removeItem("userData");

    Axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:8000/api/v1/users/logout",
    }).then((res) => {
      history.push("/");
    });
  };

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));

    if (storedData) {
      setLoggedIn(true);
      setUserID(storedData.id);
      setName(storedData.username);
      setAvatar(storedData.avatar);
      setEmail(storedData.email);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: loggedIn,
        userId: userID,
        userName: name,
        avatar: avatar,
        email: email,
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
          <Route path="/addNewObject" exact component={AddNewObject} />
          <Route path="/editProfile" exact component={EditProfile} />
          <Route path="/search/:params" exact component={Search} />
          <Route path="/object/:id" exact component={ObjectView} />
          <Route component={errorPage} />
        </Switch>
      </main>
    </AuthContext.Provider>
  );
};

export default withRouter(App);
