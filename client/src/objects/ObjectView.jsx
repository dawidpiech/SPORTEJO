import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Carousel } from "react-bootstrap";
import Axios from "axios";
import { AuthContext } from "./../shared/context/auth-context";
import Loader from "../shared/components/Loader/Loader";
import "./ObjectView.scss";

const ObjectView = () => {
  const [isLoading, setLoading] = useState(true);
  const [object, setObject] = useState();
  let { id } = useParams();

  const getObject = (id) => {
    setLoading(true);
    Axios({
      method: "POST",
      data: { object: id },
      withCredentials: true,
      url: "http://localhost:8000/api/v1/objects/getObject",
    }).then((res) => {
      setObject(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    getObject(id);
  }, []);

  return (
    <div className="object-view-wrapper">
      {isLoading ? (
        <Loader active="loader--show"></Loader>
      ) : (
        <Loader active="loader--hide"></Loader>
      )}

      {object && (
        <Container>
          <Row>
            <Col md={8}>
              <div className="title">{object.name}</div>
              <Carousel>
                {object.photos.map((e) => {
                  return (
                    <Carousel.Item interval={15000}>
                      <div
                        className="slide-image"
                        style={{
                          backgroundImage: `url(http://localhost:8000/uploads/objectImages/${e})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center center",
                        }}
                      ></div>
                    </Carousel.Item>
                  );
                })}
              </Carousel>
              <div className="description">{object.description}</div>
            </Col>
            <Col>
              <div className="categories"></div>
              <div className="amenities"></div>
              <div className="contact-buttons"></div>
              <div className="adress"></div>
              <div className="timetable"></div>
            </Col>
          </Row>
          <Row>
            <Col></Col>
          </Row>
        </Container>
      )}
    </div>
  );
};

export default ObjectView;
