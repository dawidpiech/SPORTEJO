import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./ObjectData.scss";
import { NavLink } from "react-router-dom";

const ObjectData = (props) => {
  const removeObjectFromFavorites = () => {
    props.removeObjectFromFavorites(props._id);
  };

  return (
    <div className="object-wrapper">
      <NavLink to={"object/" + props._id}>
        <img
          src={"http://localhost:8000/uploads/objectImages/" + props.photos[0]}
        ></img>
      </NavLink>
      <div className="object_data_wrapper">
        <NavLink to={"object/" + props._id}>
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
          <NavLink to={"object/" + props._id}>
            <p className="price">{props.pricePerHour + "/h"}</p>
          </NavLink>
          <p className="favorites-icon" onClick={removeObjectFromFavorites}>
            <FontAwesomeIcon icon={"heart"} />
          </p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ObjectData);
