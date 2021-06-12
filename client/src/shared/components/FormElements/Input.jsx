import React, { useReducer, useEffect } from "react";

import { validate } from "./../../util/validators";
import "./Input.scss";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case "TOUCH":
      return { ...state, isTouched: true };

    default:
      return state;
  }
};
const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || "",
    isTouched: false,
    isValid: props.initialValid || false,
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });
  };

  const focusHandler = () => {
    dispatch({ type: "TOUCH" });
  };

  const element =
    props.element === "input" ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={focusHandler}
        value={inputState.value}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={changeHandler}
        onBlur={focusHandler}
        value={inputState.value}
        placeholder={props.placeholder}
      />
    );

  return (
    <div
      className={`form-control_wrapper ${
        !inputState.isValid &&
        inputState.isTouched &&
        "form-control_wrapper--invalid"
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>

      {element}

      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
