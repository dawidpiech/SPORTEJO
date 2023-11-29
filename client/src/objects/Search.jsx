import React, { useState, useEffect, useContext } from "react";
import { useLocation, useHistory } from "react-router-dom";
import queryString from "query-string";
import "./Search.scss";
import { useForm } from "./../shared/hooks/form-hook";
import Input from "./../shared/components/FormElements/Input";
import { Multiselect } from "multiselect-react-dropdown";
import Axios from "axios";
import Loader2 from "./../shared/components/Loader/Loader2";
import { Container, Row, Col } from "react-bootstrap";
import {
  VALIDATOR_ISNUMBER,
  VALIDATOR_REQUIRE,
} from "../shared/util/validators";
import Button from "../shared/components/FormElements/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ObjectData from "./../objects/components/ObjectData";
import { AuthContext } from "./../shared/context/auth-context";

const Search = () => {
  const [isLoading, setLoading] = useState(true);
  const location = useLocation();
  let history = useHistory();
  const [categoriesData, setCategoriesData] = useState([]);
  const [checkedCategories, setCheckedCategories] = useState([]);
  const [formState, inputHandler] = useForm({}, false);
  const [objects, setObjects] = useState([]);
  const auth = useContext(AuthContext);

  const multiselectStyles = {
    multiselectContainer: {
      background: "rgba(55,55,55, 0.1)",
      borderRadius: "15px",
    },
    searchBox: {
      border: "none",
    },
    chips: {
      background: "rgba(150, 28, 166, 0.7)",
    },
  };

  const submitSearch = () => {
    let categories = "";
    checkedCategories.forEach((e) => {
      categories = categories.concat("category=" + e.id + "&");
    });

    let data = {
      name: formState.inputs.name.value,
      categories: categories,
      city: formState.inputs.city.value,
      priceFrom: formState.inputs.priceFrom.value,
      priceTo: formState.inputs.priceTo.value,
    };

    let dataToGet = {
      name: formState.inputs.name.value,
      category: checkedCategories.map((e) => e.id),
      city: formState.inputs.city.value,
      priceFrom: formState.inputs.priceFrom.value,
      priceTo: formState.inputs.priceTo.value,
    };

    history.push(
      `/search/params?name=${data.name}&${data.categories}city=${data.city}&priceFrom=${data.priceFrom}&priceTo=${data.priceTo}`
    );

    getItems(dataToGet);
  };

  const checkCategory = (selectedList) => {
    setCheckedCategories(selectedList);
  };

  const removeCategory = (selectedList) => {
    setCheckedCategories(selectedList);
  };

  const getCategories = () => {
    let categories = {
      state: false,
      length: null,
      data: [],
    };
    Axios({
      method: "GET",
      withCredentials: true,
      url: process.env.REACT_APP_API_URL + "/api/v1/objects/getCategories",
    })
      .then((res) => {
        res.data.forEach((e) => {
          let c = {
            id: e._id,
            name: e.name,
            photo: e.photo,
            icon: e.icon,
          };

          categories.data.push(c);
        });
      })
      .then(() => {
        categories.state = true;
        categories.length = categories.data.length;
        setCategoriesData(categories);
      });
  };

  const showFilters = () => {
    let handler = document.querySelector(".params");
    handler.classList.toggle("open");
    handler.classList.toggle("closed");

    let showButton = document.querySelector(".show-filters");

    if (handler.classList.contains("open")) {
      showButton.children[0].innerHTML = "Ukryj dodatkowe filtry";
      showButton.children[1].style["transform"] = "rotate(180deg)";
    } else {
      showButton.children[0].innerHTML = "Pokaż dodatkowe filtry";
      showButton.children[1].style["transform"] = "rotate(0deg)";
    }
  };

  const getItems = (params) => {
    setLoading(true);

    Axios({
      method: "POST",
      withCredentials: true,
      data: params,
      url: process.env.REACT_APP_API_URL + "/api/v1/objects/getObjectsByParams",
    }).then((res) => {
      setTimeout(() => {
        setObjects(res.data);
        setLoading(false);
      }, 1000);
    });
  };

  const addObjectToFavorites = (id) => {
    let data = {
      user: auth.userId,
      object: id,
    };
    Axios({
      method: "POST",
      withCredentials: true,
      data: data,
      url:
        process.env.REACT_APP_API_URL + "/api/v1/objects/addObjectToFavorites",
    }).then((res) => {});
  };

  useEffect(() => {
    const searchParams = queryString.parse(location.search);
    getCategories();
    getItems(searchParams);
  }, [location]);

  return (
    <div className="search-wrapper">
      <Container>
        <Row>
          <Col md={12}>
            <Input
              id="name"
              element="input"
              type="text"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="To pole nie może być puste."
              onInput={inputHandler}
              placeholder="Wprowadź nazwę obiektu"
            />
          </Col>
        </Row>
        <Row className="params closed">
          <Col className="categories">
            <Multiselect
              options={categoriesData.data}
              selectedValues={[]}
              onSelect={checkCategory}
              onRemove={removeCategory}
              displayValue="name"
              style={multiselectStyles}
              closeIcon="cancel"
            />
          </Col>
          <Col>
            <Input
              id="priceFrom"
              element="input"
              type="number"
              validators={[VALIDATOR_ISNUMBER()]}
              errorText="Wprowadzona wartość musi być liczbą."
              onInput={inputHandler}
              placeholder="Wprowadź cenę od"
            />
            <Input
              id="priceTo"
              element="input"
              type="number"
              validators={[VALIDATOR_ISNUMBER()]}
              errorText="Wprowadzona wartość musi być liczbą."
              onInput={inputHandler}
              placeholder="Wprowadź cenę do"
            />
          </Col>
          <Col className="city">
            <Input
              id="city"
              element="input"
              type="text"
              validators={[]}
              errorText="Wprowadź miasto."
              onInput={inputHandler}
              placeholder="Wprowadź nazwę miasta"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="show-filters" onClick={showFilters}>
              <span className="opened">Pokaż dodatkowe filtry</span>
              <FontAwesomeIcon icon="chevron-down" className="opened" />
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button className="button__primary--search" onClick={submitSearch}>
              Wyszukaj
            </Button>
          </Col>
        </Row>
        <Row>
          <Col style={{ minHeight: "100px" }}>
            {isLoading ? (
              <Loader2 active="loader2--show"></Loader2>
            ) : (
              <Loader2 active="loader2--hide"></Loader2>
            )}
            {objects.length > 0 &&
              objects.map((e, index) => (
                <ObjectData
                  key={index}
                  addObjectToFavorites={addObjectToFavorites}
                  {...e}
                ></ObjectData>
              ))}
            {objects.length === 0 && (
              <h1>Nie znaleziono żadnych obiektów o takich kryteriach</h1>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Search;
