import React from "react";
import "./Loader.scss";

const Loader = (props) => (
  <div className={`loader-wrapper ${props.active}`}>
    <div className={"loader"}>
      <div className={"dot1"}></div>
      <div className={"dot2"}></div>
    </div>
  </div>
);

export default Loader;
