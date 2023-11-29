import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Button from "./../../shared/components/FormElements/Button";
import Axios from "axios";
import { AuthContext } from "./../../shared/context/auth-context";
import Loader from "./../../shared/components/Loader/Loader";
import ObjectData from "./../../objects/components/ObjectData";
import "./Dashboard.scss";
import { NavLink, Redirect } from "react-router-dom";

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  const [objects, setObjects] = useState();
  const auth = useContext(AuthContext);

  const removeObject = (id) => {
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
      url: process.env.REACT_APP_API_URL + "/api/v1/objects/removeObject",
    }).then((res) => {
      setObjects(objectsList);
    });
  };

  useEffect(() => {
    const getObjects = () => {
      Axios({
        method: "POST",
        data: { user: auth.userId },
        withCredentials: true,
        url: process.env.REACT_APP_API_URL + "/api/v1/objects/getUserObjects",
      })
        .then((res) => {
          setObjects(res.data);
        })
        .then(() => {
          setLoading(false);
        });
    };

    if (auth.isLoggedIn) {
      getObjects();
    }
  }, [auth]);

  return auth.isLoggedIn ? (
    <div className="dashboard-wrapper">
      {isLoading ? (
        <Loader active="loader--show"></Loader>
      ) : (
        <Loader active="loader--hide"></Loader>
      )}

      <Container>
        <Row>
          <Col>
            <NavLink to="addNewObject">
              <Button className="button__primary--new_object">
                DODAJ NOWY OBIEKT
              </Button>
            </NavLink>

            <p className="title">TWOJE DODANE OBIEKTY</p>
            <hr></hr>
            {objects ? (
              objects.map((d, index) => {
                return (
                  <ObjectData
                    key={index}
                    type="dashboard"
                    {...d}
                    removeObject={removeObject}
                  ></ObjectData>
                );
              })
            ) : (
              <h1>Nie dodałeś jeszcze żadnych obiektów.</h1>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  ) : (
    <Redirect to={{ pathname: "/login" }}></Redirect>
  );
};

export default Dashboard;
