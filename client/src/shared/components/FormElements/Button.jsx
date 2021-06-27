import React from "react";
import "./Button.scss";

const Button = (props) => (
  <button
    className={`button__primary ${props.className}`}
    disabled={props.disabled}
    onClick={props.onClick}
    onMouseEnter={props.onMouseEnter}
    onMouseLeave={props.onMouseLeave}
  >
    {props.children}
  </button>
);

export default Button;
