import React, { useEffect, useState, useContext } from "react";
import "./Home.scss";
import { Row, Col, Form } from "react-bootstrap";
import Axios from "axios";
import Button from "../shared/components/FormElements/Button";
import { NavLink, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFireAlt } from "@fortawesome/free-solid-svg-icons";
import Category from "./components/Category";
import { AuthContext } from "./../shared/context/auth-context";

import Loader from "../shared/components/Loader/Loader";

const Home = () => {
  const [categories, setCategories] = useState("");
  const [isLoading, setLoading] = useState(true);
  const auth = useContext(AuthContext);
  let history = useHistory();

  const submitSearch = (e) => {
    e.preventDefault();
    history.push(`/search/params?name=${e.target[0].value}`);
  };

  const showMenu = (e) => {
    e.target.nextElementSibling.classList.toggle("active");
    e.target.nextElementSibling.classList.toggle("inactive");
  };

  const handleClickOutsideAvatar = (event) => {
    let avatar = document.querySelector(".user_avatar");
    let menu = document.querySelector(".home_user_menu");
    if (
      menu &&
      !menu.contains(event.target) &&
      !avatar.contains(event.target)
    ) {
      let avatarHandler = document.querySelector(".home_user_menu");
      avatarHandler.classList.add("inactive");
      avatarHandler.classList.remove("active");
    }
  };

  useEffect(() => {
    const categoriesData = [];
    const getCategories = () => {
      Axios({
        method: "GET",
        withCredentials: true,
        url: "http://localhost:8000/api/v1/objects/getCategories",
      })
        .then((res) => {
          res.data.forEach((e) => {
            let c = {
              id: e._id,
              name: e.name,
              background: e.photo,
            };

            categoriesData.push(c);
          });
        })
        .then(() => {
          setCategories(categoriesData);
        })
        .then(() => {
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        });
    };

    getCategories();

    document.addEventListener("mousedown", handleClickOutsideAvatar);
  }, []);

  return (
    <div className="home_container">
      {isLoading ? (
        <Loader active="loader--show"></Loader>
      ) : (
        <Loader active="loader--hide"></Loader>
      )}
      <Row>
        <Col lg={7} className="home_photo">
          <div className="home_photo_title_wrapper">
            <div className="home_photo_title_bg"></div>
            <div className="home_photo_title">SPORTEJO</div>
          </div>
          <div className="home_photo_subtitle_wrapper">
            <div className="home_photo_subtitle_bg"></div>
            <div className="home_photo_subtitle">Znajdź miejsce do gry</div>
          </div>
        </Col>
        <Col lg={5} className="home_search">
          {!auth.isLoggedIn && (
            <div className="home_buttons">
              <NavLink to="/login">
                <Button className="home_button">Zaloguj</Button>
              </NavLink>
              <NavLink to="/register">
                <Button className="home_button">Zarejestruj</Button>
              </NavLink>
            </div>
          )}
          {auth.isLoggedIn && (
            <div className="home_user_bar">
              <NavLink to="/favorites" className="user_favorites">
                <FontAwesomeIcon icon={faFireAlt} />
              </NavLink>
              <div className="user_name">Hej {auth.userName}</div>
              <div
                className="user_avatar"
                style={{
                  background:
                    "url(http://localhost:8000/uploads/avatars/" + auth.avatar,
                  backgroundPosition: "center center",
                  backgroundSize: "cover",
                }}
                onClick={showMenu}
              ></div>

              <div className="home_user_menu inactive">
                <NavLink to="/dashboard" className="user_menu_link">
                  Dashboard
                </NavLink>
                <NavLink to="/editProfile" className="user_menu_link">
                  Edytuj profil
                </NavLink>
                <Button
                  onClick={auth.logout}
                  className={"button__primary--logout"}
                >
                  Wyloguj
                </Button>
              </div>
            </div>
          )}
          <div className="search_wrapper">
            <p className="search_title">Zaczynajmy...</p>
            <Form className="search_form" onSubmit={submitSearch}>
              <Form.Group>
                <Form.Control
                  type="text"
                  name="search"
                  id="search_input"
                  placeholder="Wyszukaj miejsce"
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
