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
      url: "http://localhost:8000/api/v1/objects/getObjects",
    }).then((res) => {
      console.log(res);
    });
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  return (
    <div className="error_container">
      {isLoading ? (
        <Loader active="loader--show"></Loader>
      ) : (
        <Loader active="loader--hide"></Loader>
      )}
      <Row>
        <Col lg={7} className="home_photo">
          <h1>EROR PAGE</h1>
        </Col>
      </Row>
    </div>
  );
};

export default ErrorPage;
