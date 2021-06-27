import React from "react";

import "./InputCheckbox.scss";

const InputCheckbox = (props) => {
  return (
    <div className="input-checkbox-wrapper">
      <label>
        <input
          type="checkbox"
          name={props.name}
          id={props.id}
          onChange={props.onChange}
          value={props.value}
        ></input>
        <span>{props.label}</span>
      </label>
    </div>
  );
};

export default InputCheckbox;
