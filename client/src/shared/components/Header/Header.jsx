import React, { useContext } from "react";
import "./Header.scss";
import Axios from "axios";
import { NavLink, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFireAlt } from "@fortawesome/free-solid-svg-icons";

import Button from "../../../shared/components/FormElements/Button";

const Header = (props) => {
  const auth = useContext(AuthContext);
  const location = useLocation();

  const logout = () => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:8000/api/v1/users/logout",
    }).then((res) => {
      console.log(res.data);
      //setData("Wylogowany");
    });
  };

  if (location.pathname !== "/") {
    return (
      <div className="header">
        {console.log()}
        <NavLink to="/" className={"nav__link"}>
          <div className="logo_header"></div>
        </NavLink>
        {!auth.isLoggedIn && (
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
        )}

        {auth.isLoggedIn && (
          <div className="user_menu">
            <NavLink to="/" className="user_favorites">
              <FontAwesomeIcon icon={faFireAlt} />
            </NavLink>
            <div className="user-name">Hi, </div>
            <div
              className="user-avatar"
              style={{ background: "../../../img/avatar.png" }}
            ></div>
          </div>
        )}
      </div>
    );
  } else {
    return "";
  }
};

export default Header;
