import React, { useEffect, useState } from "react";
import "./errorPage.scss";
import Axios from "axios";
import { Row, Col } from "react-bootstrap";
import Loader from "../shared/components/Loader/Loader";
const ErrorPage = () => {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getObjects();
  }, []);

  const getObjects = () => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: process.env.REACT_APP_API_URL + "/api/v1/objects/getObjects",
    }).then((res) => {
      console.log(res);
    });
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="error_container">
      {isLoading ? (
        <Loader active="loader--show"></Loader>
      ) : (
        <Loader active="loader--hide"></Loader>
      )}
      <Row>
        <Col>
          <div className="error_content">
            <h1>404! Ta strona nie istnieje.</h1>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ErrorPage;
