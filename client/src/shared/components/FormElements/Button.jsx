import React from "react";
import "./Button.scss";

const Button = (props) => (
  <button className={`button__primary ${props.className}`}>
    {props.children}
  </button>
);

export default Button;
