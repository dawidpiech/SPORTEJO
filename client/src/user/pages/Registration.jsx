import React, { useState, useEffect } from "react";
import "./Registration.scss";
import Axios from "axios";
import Loader from "./../../shared/components/Loader/Loader";
import { NavLink, Redirect } from "react-router-dom";
import { Container, Row, Col, Form, Alert } from "react-bootstrap";
import Button from "./../../shared/components/FormElements/Button";
import ImageUpload from "./../../shared/components/FormElements/ImageUpload";
import { useHistory } from "react-router-dom";

import { useForm } from "./../../shared/hooks/form-hook";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
  VALIDATOR_SAMEVALUE,
} from "./../../shared/util/validators";
import Input from "./../../shared/components/FormElements/Input";
import LoadingSpinner from "../../shared/components/others/LoadingSpinner";

const Registration = () => {
  const [isLoading, setLoading] = useState(true);
  const [registerState, setRegisterState] = useState({
    status: "",
    message: "",
  });
  const [isLoadingSpinner, setLoadingSpinner] = useState(false);

  const [formState, inputHandler] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      email: {
        value: "",
        isValid: false,
      },
      avatar: {
        value: null,
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  let history = useHistory();

  const register = (e) => {
    setLoadingSpinner(true);
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", formState.inputs.email.value);
    formData.append("username", formState.inputs.name.value);
    formData.append("password", formState.inputs.password.value);
    formData.append("avatar", formState.inputs.avatar.value);

    Axios({
      method: "POST",
      data: formData,
      withCredentials: true,
      url: "http://localhost:8000/api/v1/users/register",
    })
      .then((res) => {
        setRegisterState({
          status: true,
          message: res.data,
        });
        setLoadingSpinner(false);
        history.push("/login");
      })
      .catch((error) => {
        let message = error.response.data.slice(
          error.response.data.search("Error: ") + 6,
          error.response.data.search("<br>")
        );
        setLoadingSpinner(false);

        setRegisterState({
          status: false,
          message: message,
        });
      });
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // const login = () => {
  //   Axios({
  //     method: "POST",
  //     data: {
  //       username: loginUsername,
  //       password: loginPassword,
  //     },
  //     withCredentials: true,
  //     url: "http://localhost:8000/api/v1/users/login",
  //   }).then((res) => console.log(res));
  // };

  // const getUser = () => {
  //   Axios({
  //     method: "GET",
  //     withCredentials: true,
  //     url: "http://localhost:8000/api/v1/users/getUser",
  //   }).then((res) => {
  //     setData(res.data);
  //     console.log(res.data);
  //   });
  // };

  // const logout = () => {
  //   Axios({
  //     method: "GET",
  //     withCredentials: true,
  //     url: "http://localhost:8000/api/v1/users/logout",
  //   }).then((res) => {
  //     console.log(res.data);
  //     setData("Wylogowany");
  //   });
  // };

  return (
    <div className="registration_wrapper">
      {isLoading ? (
        <Loader active="loader--show"></Loader>
      ) : (
        <Loader active="loader--hide"></Loader>
      )}
      <Container>
        <img src="http://localhost:8000/uploads/avatars/64f8b45b-f2e0-489c-ac54-4344b0d284fc.jpeg" />
        <Row className="justify-content-md-center pb-5">
          <Col xl={5} className="registration_form">
            <p className="registration_form_register_link">
              Masz już konto?
              <NavLink to="/register">Zaloguj się!</NavLink>
            </p>
            <Form className="authorization__form" onSubmit={register}>
              <Form.Group>
                {registerState.message !== "" ? (
                  <Alert variant={registerState.status ? "success" : "danger"}>
                    {registerState.message}
                  </Alert>
                ) : (
                  ""
                )}
                <ImageUpload
                  center
                  id="avatar"
                  errorText="To zdjęcie jest zbyt duże"
                  onInput={inputHandler}
                />
                <Input
                  id="email"
                  element="input"
                  type="email"
                  validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
                  errorText="Proszę wprowadź prawidłowy adres e-mail."
                  onInput={inputHandler}
                  placeholder="Wprowadź adres e-mail"
                />
                <Input
                  id="name"
                  element="input"
                  type="text"
                  validators={(VALIDATOR_REQUIRE(), [VALIDATOR_MINLENGTH(5)])}
                  errorText="Login nie może być krótszy niż 5 znaków."
                  onInput={inputHandler}
                  placeholder="Wprowadź login"
                />
                <Input
                  id="password"
                  element="input"
                  type="password"
                  validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(8)]}
                  errorText="Hasło musi zawierać przynajmniej 8 znaków."
                  onInput={inputHandler}
                  placeholder="Wprowadź hasło"
                />
                <Input
                  id="confirmpassword"
                  element="input"
                  type="password"
                  validators={[
                    VALIDATOR_REQUIRE(),
                    VALIDATOR_MINLENGTH(8),
                    VALIDATOR_SAMEVALUE(formState.inputs.password.value),
                  ]}
                  errorText="Hasła muszą być takie same."
                  onInput={inputHandler}
                  placeholder="Powtórz hasło"
                />
                <Button
                  className={"button__primary--login"}
                  disabled={!formState.isValid}
                >
                  {isLoadingSpinner && <LoadingSpinner></LoadingSpinner>}
                  Zarejestruj
                </Button>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Registration;
