import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Loader from "./../../shared/components/Loader/Loader";
import Axios from "axios";
import "./Favorites.scss";
import ObjectData from "./../../objects/components/ObjectData";
import { AuthContext } from "./../../shared/context/auth-context";

const Favorites = () => {
  const [isLoading, setLoading] = useState(true);
  const [objects, setObjects] = useState();
  const auth = useContext(AuthContext);

  useEffect(() => {
    getObjects();
    auth.login();
  }, []);

  const getObjects = () => {
    let data = {
      user: auth.userId,
    };
    Axios({
      method: "POST",
      data: data,
      withCredentials: true,
      url: "http://localhost:8000/api/v1/objects/getFavoritesObjects",
    })
      .then((res) => {
        console.log(res.data);
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

    let data = {
      user: auth.userId,
      object: id,
    };

    Axios({
      method: "POST",
      withCredentials: true,
      data: data,
      url: "http://localhost:8000/api/v1/objects/removeObjectFromFavorites",
    }).then((res) => {
      setObjects(objectsList);
    });
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
                    type="favorites"
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
