import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./ObjectData.scss";
import { NavLink } from "react-router-dom";

const ObjectData = (props) => {
  const removeObjectFromFavorites = () => {
    props.removeObjectFromFavorites(props._id);
  };

  const addObjectToFavorites = (e) => {
    props.addObjectToFavorites(props._id);
    e.target.style.color = "#961ca6";
  };

  const removeObject = () => {
    props.removeObject(props._id);
  };

  return (
    <div className="object-wrapper">
      <NavLink to={"/object/" + props._id}>
        <img
          src={"http://localhost:8000/uploads/objectImages/" + props.photos[0]}
          alt={"image" + props.photos[0]}
        ></img>
      </NavLink>
      <div className="object_data_wrapper">
        <NavLink to={"/object/" + props._id}>
          <div className="object_main_data">
            <p className="object_title">{props.name}</p>
            <p className="object_adres">{props.adress + ", " + props.city}</p>
            <div className="object_categories">
              {props.categories.map((e, index) => {
                return (
                  <div className="category" key={index}>
                    <FontAwesomeIcon icon={e.icon} />
                    <p>{e.name}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </NavLink>
        <div className="object_others_data">
          <NavLink to={"/object/" + props._id}>
            <p className="price">{props.pricePerHour + " zł/h"}</p>
          </NavLink>
          {props.type === "favorites" ? (
            <p className="favorites-icon" onClick={removeObjectFromFavorites}>
              <FontAwesomeIcon icon={"dumpster-fire"} />
            </p>
          ) : props.type === "dashboard" ? (
            <p className="dashboard-icon" onClick={removeObject}>
              <FontAwesomeIcon icon={"trash"} />
            </p>
          ) : (
            <p className="object-icon" onClick={addObjectToFavorites}>
              <FontAwesomeIcon icon={"fire-alt"} />
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ObjectData;
