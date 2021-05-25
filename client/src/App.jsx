import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Login from "./user/pages/Login";
import Home from "./home/Home";
import Registration from "./user/pages/Registration";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import Header from "./shared/components/Header/Header";
import "./shared/util/conf.scss";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => (
  <BrowserRouter>
    <MainNavigation></MainNavigation>
    <Header></Header>
    <main>
      <Switch>
        <Route path="/login" exact component={Login} />
        <Route path="/register" exact component={Registration} />
        <Route path="/" exact component={Home} />
      </Switch>
    </main>
  </BrowserRouter>
);

export default App;
