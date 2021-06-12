import React, { useContext, useEffect } from "react";
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

  const showMenu = (e) => {
    e.target.nextElementSibling.classList.toggle("active");
    e.target.nextElementSibling.classList.toggle("inactive");
  };

  const handleClickOutsideAvatar = (event) => {
    let avatar = document.querySelector(".user_avatar");
    let menu = document.querySelector(".user_menu_popup");
    if (
      menu &&
      !menu.contains(event.target) &&
      !avatar.contains(event.target)
    ) {
      let avatarHandler = document.querySelector(".user_menu_popup");
      avatarHandler.classList.add("inactive");
      avatarHandler.classList.remove("active");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideAvatar);
  }, []);

  if (location.pathname !== "/") {
    return (
      <div className="header">
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
            <NavLink to="/favorites" className="user_favorites">
              <FontAwesomeIcon icon={faFireAlt} />
            </NavLink>
            <div className="user_name">Hi, {auth.userName}</div>
            <div
              className="user_avatar"
              style={{
                background:
                  "url(http://localhost:8000/uploads/avatars/" + auth.avatar,
                backgroundPosition: "center center",
                backgroundSize: "cover",
              }}
              onClick={showMenu}
            ></div>

            <div className="user_menu_popup inactive">
              <NavLink to="/editProfile" className="edit_profile">
                Edytuj profil
              </NavLink>
              <Button
                onClick={auth.logout}
                className={"button__primary--logout"}
              >
                Wyloguj
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return "";
  }
};

export default Header;
