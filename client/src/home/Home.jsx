import React, { useEffect, useState } from "react";
import "./Home.scss";
import { Row, Col, Form } from "react-bootstrap";
import Button from "../shared/components/FormElements/Button";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Category from "./components/Category";

const Home = () => {
  const [categories, setCategories] = useState("");

  const a = [
    {
      id: "1",
      name: "Football",
      background: "red",
    },
    {
      id: "2",
      name: "Volleyball",
      background: "blue",
    },
    {
      id: "3",
      name: "Basketball",
      background: "orange",
    },
    {
      id: "4",
      name: "DUPA TEST",
      background: "green",
    },
  ];

  const setStateOnLoad = () => {
    setCategories(a);
  };

  const submitSearch = (e) => {
    e.preventDefault();
    alert("asdfasd");
    console.log(e);
    window.location.href = e.target[0].value;
  };

  useEffect(() => {
    setStateOnLoad();
  }, []);

  return (
    <div className="home_container">
      <Row>
        <Col lg={7} className="home_photo">
          <div className="home_photo_title_wrapper">
            <div className="home_photo_title_bg"></div>
            <div className="home_photo_title">SPORTEJO</div>
          </div>
          <div className="home_photo_subtitle_wrapper">
            <div className="home_photo_subtitle_bg"></div>
            <div className="home_photo_subtitle">Find place to game</div>
          </div>
        </Col>
        <Col lg={5} className="home_search">
          <div className="home_buttons">
            <NavLink to="/login">
              <Button className="home_button">Login</Button>
            </NavLink>
            <NavLink to="/register">
              <Button className="home_button">Register</Button>
            </NavLink>
          </div>
          <div className="search_wrapper">
            <p className="search_title">Let's go</p>
            <Form className="authorization__form" onSubmit={submitSearch}>
              <Form.Group>
                <Form.Control
                  type="text"
                  name="search"
                  id="search_input"
                  placeholder="Search place"
                />
              </Form.Group>
              <FontAwesomeIcon icon={faSearch} className="search_icon" />
            </Form>
          </div>
          <div className="search_category_wrapper">
            {categories ? (
              categories.map((d) => <Category key={d.id} {...d}></Category>)
            ) : (
              <h1>Categories unavailable</h1>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
