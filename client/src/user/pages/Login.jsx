import React, { useState, useEffect, useContext } from "react";
import "./Login.scss";
import Axios from "axios";
import Loader from "../../shared/components/Loader/Loader";
import { NavLink, Redirect } from "react-router-dom";
import { Container, Row, Col, Form, Alert } from "react-bootstrap";
import Button from "../../shared/components/FormElements/Button";
import { AuthContext } from "./../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/others/LoadingSpinner";

import { useForm } from "./../../shared/hooks/form-hook";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
} from "./../../shared/util/validators";
import Input from "./../../shared/components/FormElements/Input";

const Login = () => {
  const authContext = useContext(AuthContext);
  const [isLoadingSpinner, setLoadingSpinner] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [loginStatus, setLoginStatus] = useState({
    status: "",
    message: "",
  });

  const [formState, inputHandler] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const login = (e) => {
    e.preventDefault();
    setLoadingSpinner(true);
    Axios({
      method: "POST",
      data: {
        username: formState.inputs.email.value,
        password: formState.inputs.password.value,
      },
      withCredentials: true,
      url: "http://localhost:8000/api/v1/users/login",
    })
      .then((res) => {
        setLoginStatus({
          status: res.data.status,
          message: res.data.comment,
        });

        if ((res.data.status = true)) {
          localStorage.setItem("userData", JSON.stringify(res.data.user));
        }
      })
      .then(() => {
        authContext.login();
        setLoadingSpinner(false);
      });
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  if (authContext.isLoggedIn) {
    return <Redirect to="/dashboard" />;
  } else {
    return (
      <div className="login_wrapper">
        {isLoading ? (
          <Loader active="loader--show"></Loader>
        ) : (
          <Loader active="loader--hide"></Loader>
        )}
        <Container>
          <Row className="justify-content-md-center pb-5">
            <Col xl={5} className="login_form">
              <p className="login_form_register_link">
                Nie masz jeszcze konta?
                <NavLink to="/register">Zarejestruj się!</NavLink>
              </p>
              {loginStatus.message !== "" ? (
                <Alert variant={loginStatus.status ? "success" : "danger"}>
                  {loginStatus.message}
                </Alert>
              ) : (
                ""
              )}
              <Form className="authorization__form" onSubmit={login}>
                <Form.Group>
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
                    id="password"
                    element="input"
                    type="password"
                    validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(8)]}
                    errorText="Hasło musi zawierać przynajmniej 8 znaków."
                    onInput={inputHandler}
                    placeholder="Wprowadź hasło"
                  />
                  <Button
                    className={"button__primary--login"}
                    disabled={!formState.isValid}
                  >
                    {isLoadingSpinner && <LoadingSpinner></LoadingSpinner>}
                    Zaloguj
                  </Button>
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
};

export default Login;
