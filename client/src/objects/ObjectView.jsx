import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Carousel } from "react-bootstrap";
import Axios from "axios";
import Loader from "../shared/components/Loader/Loader";
import "./ObjectView.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Geocode from "react-geocode";
import Map from "./components/Map";
import Button from "./../shared/components/FormElements/Button";

const ObjectView = () => {
  const [isLoading, setLoading] = useState(true);
  const [object, setObject] = useState();
  const [coordinates, setCoordinates] = useState();
  let { id } = useParams();

  Geocode.setApiKey("AIzaSyBEde_WpzjOYi-A-Ha2IoIeVx37vYkunYY");

  const getLatLng = (adress) => {
    Geocode.fromAddress(adress).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        setCoordinates({
          lat: lat,
          lng: lng,
        });
      },
      (error) => {
        console.error("ERRORRRR: " + error);
      }
    );
  };

  const changePhoneText = (e) => {
    e.target.innerHTML = `${object.phoneNumber}`;
  };

  const defaultPhoneText = (e) => {
    e.target.innerHTML = `Zadzwoń`;
  };

  const changeMailText = (e) => {
    e.target.innerHTML = `${object.email}`;
  };

  const defaultMailText = (e) => {
    e.target.innerHTML = `Napisz wiadomość`;
  };

  useEffect(() => {
    const getObject = (id) => {
      setLoading(true);
      Axios({
        method: "POST",
        data: { object: id },
        withCredentials: true,
        url: "https://sportejo-production.up.railway.app/api/v1/objects/getObject",
      }).then((res) => {
        setObject(res.data);
        getLatLng(res.data.adress);

        setLoading(false);
      });
    };

    getObject(id);
  }, [id]);

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
                {object.photos.map((e, index) => {
                  return (
                    <Carousel.Item interval={5000} key={index}>
                      <div
                        className="slide-image"
                        style={{
                          backgroundImage: `url(https://sportejo-production.up.railway.app/uploads/objectImages/${e})`,
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
              <hr />
              <div className="categories">
                {object.categories.map((e) => {
                  return (
                    <div className="category" key={e._id}>
                      <FontAwesomeIcon icon={e.icon} />
                      <span>{e.name}</span>
                    </div>
                  );
                })}
              </div>
              <hr />
              <div className="amenities">
                {object.amenities.map((e) => {
                  return (
                    <div className="convenience" key={e._id}>
                      <FontAwesomeIcon icon={e.icon} />
                      <span>{e.name}</span>
                    </div>
                  );
                })}
              </div>
              <hr />
              <div className="contact-buttons">
                {object.email && (
                  <a href={`mailto:${object.email}`}>
                    <Button
                      onMouseEnter={changeMailText}
                      onMouseLeave={defaultMailText}
                      className="button__primary--message"
                    >
                      Napisz wiadomość
                    </Button>
                  </a>
                )}

                {object.phoneNumber && (
                  <Button
                    onMouseEnter={changePhoneText}
                    onMouseLeave={defaultPhoneText}
                    className="button__primary--phone"
                  >
                    Zadzwoń
                  </Button>
                )}
              </div>
              <hr />
              <div className="adress">
                <p>Adres:</p>
                {object.adress + ", " + object.city}
              </div>
              <hr />
              <div className="timetable">
                {object.openingDays.map((e) => {
                  return (
                    <div className="day" key={e._id}>
                      {e.name + ": "}
                      <span>
                        {object.openingTime + " - " + object.closingTime}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Col>
          </Row>
        </Container>
      )}
      {coordinates && (
        <Map
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBEde_WpzjOYi-A-Ha2IoIeVx37vYkunYY&v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `400px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          lat={coordinates.lat}
          lng={coordinates.lng}
          zoom={12}
        />
      )}
    </div>
  );
};

export default ObjectView;
