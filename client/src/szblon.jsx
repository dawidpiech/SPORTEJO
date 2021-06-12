import React, { useState, useEffect } from "react";

import Loader from "./../shared/components/Loader/Loader";

const addNewObject = () => {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="container">
      {isLoading ? (
        <Loader active="loader--show"></Loader>
      ) : (
        <Loader active="loader--hide"></Loader>
      )}
    </div>
  );
};

export default addNewObject;
