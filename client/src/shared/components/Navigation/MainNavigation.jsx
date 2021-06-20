import React from "react";
import { NavLink } from "react-router-dom";
import "./MainNavigation.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faSearch,
  faPlusCircle,
  faFireAlt,
} from "@fortawesome/free-solid-svg-icons";

const MainNavigation = () => (
  <div className="nav">
    <div className={"nav__logo"}></div>
    <ul className="nav__links">
      <li>
        <NavLink to="/" className={"nav__link"}>
          <FontAwesomeIcon icon={faHome} />
        </NavLink>
      </li>
      <li>
        <NavLink to="/search/params?" className={"nav__link"}>
          <FontAwesomeIcon icon={faSearch} />
        </NavLink>
      </li>
      <li>
        <NavLink to="/addNewObject" className={"nav__link"}>
          <FontAwesomeIcon icon={faPlusCircle} />
        </NavLink>
      </li>
      <li>
        <NavLink to="/favorites" className={"nav__link"}>
          <FontAwesomeIcon icon={faFireAlt} />
        </NavLink>
      </li>
    </ul>
  </div>
);

export default MainNavigation;
