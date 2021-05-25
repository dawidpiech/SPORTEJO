import React from "react";
import "./Header.scss";
import { NavLink } from "react-router-dom";

import Button from "../../../shared/components/FormElements/Button";

const Header = () => (
  <div className="header">
    <NavLink to="/" className={"nav__link"}>
      <div className="logo_header"></div>
    </NavLink>
    <div className="buttons_header">
      <Button className={"button__primary--header"}>
        <NavLink to="/login" className={"nav__link"}>
          Login
        </NavLink>
      </Button>
      <Button className={"button__primary--header"}>
        <NavLink to="/register" className={"nav__link"}>
          Register
        </NavLink>
      </Button>
    </div>
  </div>
);

export default Header;
