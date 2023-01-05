import React, { useContext, useEffect } from "react";
import "./Header.scss";
import { NavLink, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFireAlt } from "@fortawesome/free-solid-svg-icons";

import Button from "../../../shared/components/FormElements/Button";

const Header = () => {
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
                Zaloguj
              </NavLink>
            </Button>
            <Button className={"button__primary--header"}>
              <NavLink to="/register" className={"nav__link"}>
                Zarejestruj
              </NavLink>
            </Button>
          </div>
        )}

        {auth.isLoggedIn && (
          <div className="user_menu">
            <NavLink to="/favorites" className="user_favorites">
              <FontAwesomeIcon icon={faFireAlt} />
            </NavLink>
            <div className="user_name">Hej {auth.userName}</div>
            <div
              className="user_avatar"
              style={{
                backgroundPosition: "center center",
                backgroundSize: "cover",
                backgroundImage:
                  "url(https://sportejo-production.up.railway.app/uploads/avatars/" + auth.avatar,
              }}
              onClick={showMenu}
            ></div>

            <div className="user_menu_popup inactive">
              <NavLink to="/dashboard" className="user_menu_link">
                Dashboard
              </NavLink>
              <NavLink to="/editProfile" className="user_menu_link">
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
