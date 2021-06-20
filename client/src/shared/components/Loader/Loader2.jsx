import React from "react";
import "./Loader2.scss";

const Loader2 = (props) => (
  <div className={`loader2-wrapper ${props.active}`}>
    <div className={"loader2"}>
      <div className={"dot1"}></div>
      <div className={"dot2"}></div>
    </div>
  </div>
);

export default Loader2;
