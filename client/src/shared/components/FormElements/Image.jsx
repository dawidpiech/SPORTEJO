import React from "react";
import "./Image.scss";

const Image = (props) => {
  const remove = () => {
    props.removeFile(props.id);
  };

  return (
    <div className="a">
      <img src={props.src} alt="Preview" />
      <button onClick={remove}>delete</button>
    </div>
  );
};

export default Image;
