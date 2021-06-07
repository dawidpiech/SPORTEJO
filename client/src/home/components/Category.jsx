import React from "react";
import "./Category.scss";
import { NavLink } from "react-router-dom";

const Category = (props) => (
  <NavLink to={props.id}>
    <div
      className="home_category"
      style={{
        background:
          "url(http://localhost:8000/images/categories/" +
          props.background +
          ")",
        backgroundSize: "cover",
        backgroundPosition: "center center",
      }}
    >
      <div className="home_category_title">{props.name}</div>
    </div>
  </NavLink>
);

export default Category;
