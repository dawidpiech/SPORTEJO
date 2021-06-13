import React from "react";
import "./Image.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const Image = (props) => {
  const remove = () => {
    props.removeFile(props.id);
  };

  return (
    <div className="multiple-image-upload-image">
      <img src={props.src} height="92px" alt="Preview" />
      <button onClick={remove}>
        <FontAwesomeIcon icon={faTrashAlt} />
      </button>
    </div>
  );
};

export default Image;
