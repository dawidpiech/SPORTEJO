import "./LoadingSpinner.scss";

const LoadingSpinner = (props) => {
  return <div className={`lds-dual-ring ${props.classes}`}></div>;
};

export default LoadingSpinner;
