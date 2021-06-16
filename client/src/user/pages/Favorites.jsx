import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Loader from "./../../shared/components/Loader/Loader";
import Axios from "axios";
import "./Favorites.scss";
import ObjectData from "../components/ObjectData";

const Favorites = () => {
  const [isLoading, setLoading] = useState(true);
  const [objects, setObjects] = useState();

  useEffect(() => {
    getObjects();
  }, []);

  const getObjects = () => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:8000/api/v1/objects/getObjects",
    })
      .then((res) => {
        setObjects(res.data);
      })
      .then(() => {
        setLoading(false);
      });
  };

  const removeObjectFromFavorites = (id) => {
    let objectsList = [...objects];
    const index = objectsList.findIndex((e) => e._id === id);
    objectsList.splice(index, 1);

    setObjects(objectsList);
  };

  return (
    <div className="favorites-wrapper">
      {isLoading ? (
        <Loader active="loader--show"></Loader>
      ) : (
        <Loader active="loader--hide"></Loader>
      )}

      <Container>
        <Row>
          <Col>
            <p className="title">TWOJE OBSERWOWANE OBIEKTY</p>
            <hr></hr>
            {objects ? (
              objects.map((d, index) => {
                return (
                  <ObjectData
                    key={index}
                    {...d}
                    removeObjectFromFavorites={removeObjectFromFavorites}
                  ></ObjectData>
                );
              })
            ) : (
              <h1>Nie ma jeszcze żadnych ulubionych obiektów</h1>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Favorites;
