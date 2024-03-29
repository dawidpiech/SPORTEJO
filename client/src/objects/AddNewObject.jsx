import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import Loader from "../shared/components/Loader/Loader";
import "./AddNewObject.scss";
import { useForm } from "./../shared/hooks/form-hook";
import { Form, Col, Row, Alert } from "react-bootstrap";
import Input from "./../shared/components/FormElements/Input";
import InputCheckbox from "./../shared/components/FormElements/InputCheckbox";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_ISNUMBER,
  VALIDATOR_PHONE,
  VALIDATOR_HOUR,
} from "./../shared/util/validators";
import Button from "./../shared/components/FormElements/Button";
import LoadingSpinner from "./../shared/components/others/LoadingSpinner";
import { Multiselect } from "multiselect-react-dropdown";
import MultipleImageUpload from "../shared/components/FormElements/MultipleImageUpload";
import { AuthContext } from "./../shared/context/auth-context";
import { Redirect } from "react-router-dom";

const AddNewObject = () => {
  const [isLoading, setLoading] = useState(true);
  const [isLoadingSpinner, setLoadingSpinner] = useState(false);
  const [daysData, setdaysData] = useState([]);
  const [amenitiesData, setAmenitiesData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [checkedAmenities, setCheckedAmenities] = useState([]);
  const [checkedDays, setCheckedDays] = useState({
    isValid: false,
    isTouched: false,
    data: [],
  });
  const [checkedCategories, setCheckedCategories] = useState({
    isValid: false,
    isTouched: false,
    data: [],
  });
  const [addObjectState, setAddObjectState] = useState();
  const [formState, inputHandler] = useForm({}, false);
  const auth = useContext(AuthContext);

  useEffect(() => {
    if (auth.isLoggedIn) {
      getDays();
      getAmenities();
      getCategories();
      if (amenitiesData.state === true && daysData.state === true) {
        setLoading(false);
      }
    }
  }, [amenitiesData.state, daysData.state, categoriesData.state, auth]);

  const checked = (e) => {
    let a = [];
    if (e.target.checked) {
      if (e.target.name === "day") {
        a = checkedDays.data.map((e) => e);

        let element = daysData.data.find((d) => d.id === e.target.id);
        a.push(element);

        setCheckedDays({
          isValid: a.length > 0 ? true : false,
          isTouched: true,
          data: a,
        });
      }

      if (e.target.name === "amenities") {
        a = checkedAmenities.map((e) => e);

        let element = amenitiesData.data.find((d) => d.id === e.target.id);
        a.push(element);

        setCheckedAmenities(a);
      }
    } else {
      if (e.target.name === "day") {
        a = checkedDays.data.filter((d) => d.id !== e.target.id);
        setCheckedDays({
          isValid: a.length > 0 ? true : false,
          isTouched: true,
          data: a,
        });
      }
      if (e.target.name === "amenities") {
        a = checkedAmenities.filter((d) => d.id !== e.target.id);
        setCheckedAmenities(a);
      }
    }
  };

  const getDays = () => {
    let days = {
      data: [],
      state: false,
      length: null,
    };
    Axios({
      method: "GET",
      withCredentials: true,
      url: process.env.REACT_APP_API_URL + "/api/v1/objects/getDays",
    })
      .then((res) => {
        res.data.forEach((e) => {
          let c = {
            id: e._id,
            name: e.name,
          };

          days.data.push(c);
        });
      })
      .then(() => {
        days.state = true;
        days.length = days.data.length;
        setdaysData(days);
      });
  };

  const getAmenities = () => {
    let amenities = {
      data: [],
      state: false,
      length: null,
    };
    Axios({
      method: "GET",
      withCredentials: true,
      url: process.env.REACT_APP_API_URL + "/api/v1/objects/getAmenities",
    })
      .then((res) => {
        res.data.forEach((e) => {
          let c = {
            id: e._id,
            name: e.name,
            icon: e.icon,
          };

          amenities.data.push(c);
        });
      })
      .then(() => {
        amenities.state = true;
        amenities.length = amenities.data.length;
        setAmenitiesData(amenities);
      });
  };

  const getCategories = () => {
    let categories = {
      data: [],
      state: false,
      length: null,
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

  const checkCategory = (selectedList, selectedItem) => {
    setCheckedCategories({
      isValid: selectedList.length > 0 ? true : false,
      isTouched: true,
      data: selectedList,
    });
  };

  const removeCategory = (selectedList, removedItem) => {
    setCheckedCategories({
      isValid: selectedList.length > 0 ? true : false,
      isTouched: true,
      data: selectedList,
    });
  };

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

  const addNewObject = (e) => {
    e.preventDefault();
    setLoadingSpinner(true);

    const formData = new FormData();

    for (let i = 0; i < formState.inputs.uploadedImages.value.length; i++) {
      const element = formState.inputs.uploadedImages.value[i];
      formData.append("uploadedImages", element);
    }

    formData.append("name", formState.inputs.object_name.value);
    formData.append("adress", formState.inputs.adres.value);
    formData.append("city", formState.inputs.city.value);
    formData.append("categories", JSON.stringify(checkedCategories.data));
    formData.append("description", formState.inputs.description.value);
    formData.append("eMail", formState.inputs.email.value);
    formData.append("phoneNumber", formState.inputs.phone.value);
    formData.append("pricePerHour", formState.inputs.price.value);
    formData.append("openingTime", formState.inputs.hourFrom.value);
    formData.append("closingTime", formState.inputs.hourTo.value);
    formData.append("amenities", JSON.stringify(checkedAmenities));
    formData.append("openingDays", JSON.stringify(checkedDays.data));
    formData.append("userID", auth.userId);

    Axios({
      method: "POST",
      data: formData,
      withCredentials: true,
      url: process.env.REACT_APP_API_URL + "/api/v1/objects/addObject",
    })
      .then((res) => {
        setAddObjectState({
          status: true,
          message: res.data,
        });
        setLoadingSpinner(false);
      })
      .catch((error) => {
        let message = error.response.data.slice(
          error.response.data.search("Error: ") + 6,
          error.response.data.search("<br>")
        );
        setLoadingSpinner(false);

        setAddObjectState({
          status: false,
          message: message,
        });
      });
  };

  const removePhotoFromForm = (index) => {
    formState.inputs.uploadedImages.value.splice(index, 1);
  };

  const reorderPhotos = (photo) => {
    let data = [];
    photo.forEach((e) => {
      data.push(formState.inputs.uploadedImages.value[e.id]);
    });

    formState.inputs.uploadedImages.value = data;
  };
  return auth.isLoggedIn ? (
    <div className="add-new-object-wrapper">
      {isLoading ? (
        <Loader active="loader--show"></Loader>
      ) : (
        <Loader active="loader--hide"></Loader>
      )}

      <div className="add-new-object-form-wrapper">
        <Form className="add-new-object-form" onSubmit={addNewObject}>
          <Form.Group>
            <Row>
              <Col lg={8}>
                <Input
                  id="object_name"
                  element="input"
                  type="text"
                  validators={[
                    VALIDATOR_REQUIRE(),
                    VALIDATOR_MAXLENGTH(250),
                    VALIDATOR_MINLENGTH(20),
                  ]}
                  errorText="Proszę nazwę obiektu, nazwa nie może być krótsza niż 20 znaków i dłuższa niż 250 znaków."
                  onInput={inputHandler}
                  placeholder="Wprowadź nazwę obiektu"
                />
              </Col>
              <Col lg={4}>
                <Input
                  id="price"
                  element="input"
                  type="number"
                  validators={[VALIDATOR_REQUIRE(), VALIDATOR_ISNUMBER()]}
                  errorText="Wprowadzona wartość musi być liczbą całkowitą."
                  onInput={inputHandler}
                  placeholder="Wprowadź cenę za godzinę"
                />
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <MultipleImageUpload
                  center
                  id="uploadedImages"
                  errorText="Możesz dodać maksymalnie 10 zdjęć i nie mogą one ważyć więcej niż 1MB"
                  onInput={inputHandler}
                  removePhotoFromForm={removePhotoFromForm}
                  reorderPhotos={reorderPhotos}
                ></MultipleImageUpload>
              </Col>
            </Row>
            <Row>
              <Col lg={8}>
                <Input
                  id="adres"
                  element="input"
                  type="text"
                  validators={[
                    VALIDATOR_REQUIRE(),
                    VALIDATOR_MINLENGTH(10),
                    VALIDATOR_MAXLENGTH(250),
                  ]}
                  errorText="Proszę wprowadź poprawny adres."
                  onInput={inputHandler}
                  placeholder="Wprowadź adres obiektu"
                />
              </Col>
              <Col lg={4}>
                <Input
                  id="city"
                  element="input"
                  type="text"
                  validators={[
                    VALIDATOR_REQUIRE(),
                    VALIDATOR_MAXLENGTH(250),
                    VALIDATOR_MINLENGTH(3),
                  ]}
                  errorText="Proszę wprowadź miasto."
                  onInput={inputHandler}
                  placeholder="Wprowadź miasto"
                />
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <Input
                  id="phone"
                  element="input"
                  type="tel"
                  validators={[VALIDATOR_REQUIRE(), VALIDATOR_PHONE()]}
                  errorText="Proszę wprowadź prawidłowy numer telefonu."
                  onInput={inputHandler}
                  placeholder="Wprowadź numer telefonu"
                />
              </Col>
              <Col lg={6}>
                <Input
                  id="email"
                  element="input"
                  type="email"
                  validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
                  errorText="Proszę wprowadź prawidłowy adres e-mail."
                  onInput={inputHandler}
                  placeholder="Wprowadź adres e-mail"
                />
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <div>Godziny otwarcia obiektu:</div>
                <Row>
                  <Col lg={6} md={6}>
                    <Input
                      id="hourFrom"
                      element="input"
                      type="time"
                      validators={[VALIDATOR_REQUIRE(), VALIDATOR_HOUR()]}
                      errorText="Proszę wprowadź prawidłową godzinę."
                      onInput={inputHandler}
                      placeholder="Wprowadź godzinę otwarcia"
                    />
                  </Col>
                  <Col lg={6} md={6}>
                    <Input
                      id="hourTo"
                      element="input"
                      type="time"
                      validators={[VALIDATOR_REQUIRE(), VALIDATOR_HOUR()]}
                      errorText="Proszę wprowadź prawidłową godzinę."
                      onInput={inputHandler}
                      placeholder="Wprowadź godzinę zamknięcia"
                    />
                  </Col>
                </Row>
                <div>W które dni?:</div>
                <Row>
                  <Col lg={6} md={6}>
                    {daysData.data
                      ? daysData.data.map((d, index) => {
                          if (index < Math.round(daysData.length / 2)) {
                            return (
                              <InputCheckbox
                                key={index}
                                name="day"
                                id={d.id}
                                value={d.name}
                                label={d.name}
                                onChange={checked}
                              />
                            );
                          } else return "";
                        })
                      : ""}
                  </Col>
                  <Col lg={6} md={6}>
                    {daysData.data
                      ? daysData.data.map((d, index) => {
                          if (index >= Math.round(daysData.length / 2)) {
                            return (
                              <InputCheckbox
                                key={index}
                                name="day"
                                id={d.id}
                                value={d.name}
                                label={d.name}
                                onChange={checked}
                              />
                            );
                          } else return "";
                        })
                      : ""}
                  </Col>
                  {!checkedDays.isValid && checkedDays.isTouched && (
                    <p className="alert">
                      Musisz zaznaczyć co najmniej jeden dzień.
                    </p>
                  )}
                </Row>
              </Col>
              <Col lg={6}>
                <div>Udogodnienia:</div>
                <Row>
                  <Col lg={6} md={6}>
                    {amenitiesData.data
                      ? amenitiesData.data.map((d, index) => {
                          if (index < Math.round(amenitiesData.length / 2)) {
                            return (
                              <InputCheckbox
                                key={index}
                                name="amenities"
                                id={d.id}
                                value={d.name}
                                label={d.name}
                                onChange={checked}
                              />
                            );
                          } else return "";
                        })
                      : ""}
                  </Col>
                  <Col lg={6} md={6}>
                    {amenitiesData.data
                      ? amenitiesData.data.map((d, index) => {
                          if (index >= Math.round(amenitiesData.length / 2)) {
                            return (
                              <InputCheckbox
                                key={index}
                                name="amenities"
                                id={d.id}
                                value={d.name}
                                label={d.name}
                                onChange={checked}
                              />
                            );
                          } else return "";
                        })
                      : ""}
                  </Col>
                </Row>
                <Row>
                  <Col lg={12}>
                    <Multiselect
                      options={categoriesData.data}
                      selectedValues={[]}
                      onSelect={checkCategory}
                      onRemove={removeCategory}
                      displayValue="name"
                      style={multiselectStyles}
                      closeIcon="cancel"
                    />
                    {!checkedCategories.isValid &&
                      checkedCategories.isTouched && (
                        <p className="alert">
                          Musisz wybrać conajmniej jedną kategorię.
                        </p>
                      )}
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <Input
                  id="description"
                  element="textarea"
                  type="text"
                  validators={[
                    VALIDATOR_REQUIRE(),
                    VALIDATOR_MAXLENGTH(5000),
                    VALIDATOR_MINLENGTH(100),
                  ]}
                  errorText="Proszę wprowadź opis obiektu. Opis musi się zawierać między 100, a 800 znaków."
                  onInput={inputHandler}
                  placeholder="Wprowadź opis obiektu"
                  rows="8"
                />
              </Col>
            </Row>
            <Button
              className={"button__primary--register"}
              disabled={
                !formState.isValid &&
                !checkedDays.state &&
                !checkedCategories.state
              }
            >
              {isLoadingSpinner && <LoadingSpinner></LoadingSpinner>}
              Dodaj Obiekt
            </Button>
            {addObjectState && (
              <Alert variant={addObjectState.status ? "success" : "danger"}>
                {addObjectState.message}
              </Alert>
            )}
          </Form.Group>
        </Form>
      </div>
    </div>
  ) : (
    <Redirect to={{ pathname: "/login" }}></Redirect>
  );
};

export default AddNewObject;
