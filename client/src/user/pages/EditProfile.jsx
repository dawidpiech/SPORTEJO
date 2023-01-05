import React, { useState, useEffect, useContext } from "react";

import Loader from "./../../shared/components/Loader/Loader";
import "./../../user/pages/EditProfile.scss";
import { Container, Row, Col, Form, Alert } from "react-bootstrap";
import ImageUpload from "./../../shared/components/FormElements/ImageUpload";
import { useForm } from "./../../shared/hooks/form-hook";
import Button from "./../../shared/components/FormElements/Button";
import Input from "./../../shared/components/FormElements/Input";
import { AuthContext } from "./../../shared/context/auth-context";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL,
  VALIDATOR_OLD_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_SAMEVALUE,
} from "./../../shared/util/validators";
import Axios from "axios";
import LoadingSpinner from "./../../shared/components/others/LoadingSpinner";
import { Redirect } from "react-router-dom";

const EditProfile = () => {
  const [isLoading, setLoading] = useState(true);
  const [isLoadingAvatar, setLoadingAvatar] = useState(false);
  const [isLoadingPassword, setLoadingPassword] = useState(false);
  const [isLoadingEmail, setLoadingEmail] = useState(false);
  const [changeAvatarState, setChangeAvatarState] = useState({
    status: "",
    message: "",
  });
  const [changePasswordState, setChangePasswordState] = useState({
    status: "",
    message: "",
  });
  const [changeEmailState, setChangeEmailState] = useState({
    status: "",
    message: "",
  });

  const auth = useContext(AuthContext);

  const [formEmail, inputHandlerEmail] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      newEmail: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const [formAvatar, inputHandlerAvatar] = useForm(
    {
      avatar: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const [formPassword, inputHandlerPassword] = useForm(
    {
      password: {
        value: "",
        isValid: false,
      },
      newPassword: {
        value: "",
        isValid: false,
      },
      repeatedPassword: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    setLoading(false);
  }, []);

  const changePassword = (e) => {
    e.preventDefault();

    Axios({
      method: "POST",
      data: {
        password: formPassword.inputs.password.value,
        newPassword: formPassword.inputs.newPassword.value,
        repeatedPassword: formPassword.inputs.repeatedPassword.value,
        userID: auth.userId,
      },
      withCredentials: true,
      url: "https://sportejo-production.up.railway.app/api/v1/users/changePassword",
    })
      .then((res) => {
        setChangePasswordState({
          status: true,
          message: res.data,
        });
        setLoadingPassword(false);
      })
      .catch((error) => {
        let message = error.response.data.slice(
          error.response.data.search("Error: ") + 6,
          error.response.data.search("<br>")
        );
        setLoadingPassword(false);

        setChangePasswordState({
          status: false,
          message: message,
        });
      });
  };

  const changeAvatar = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("avatar", formAvatar.inputs.avatar.value);
    formData.append("userID", auth.userId);

    Axios({
      method: "POST",
      data: formData,
      withCredentials: true,
      url: "https://sportejo-production.up.railway.app/api/v1/users/changeAvatar",
    })
      .then((res) => {
        setChangeAvatarState({
          status: true,
          message: res.data.comment,
        });
        setLoadingAvatar(false);
        const storedData = JSON.parse(localStorage.getItem("userData"));
        storedData.avatar = res.data.avatar;
        localStorage.setItem("userData", JSON.stringify(storedData));
        auth.login();
      })
      .catch((error) => {
        let message = error.response.data.slice(
          error.response.data.search("Error: ") + 6,
          error.response.data.search("<br>")
        );
        setLoadingAvatar(false);

        setChangeAvatarState({
          status: false,
          message: message,
        });
      });
  };

  const changeEmail = (e) => {
    e.preventDefault();

    Axios({
      method: "POST",
      data: {
        email: formEmail.inputs.email.value,
        newEmail: formEmail.inputs.newEmail.value,
        userID: auth.userId,
      },
      withCredentials: true,
      url: "https://sportejo-production.up.railway.app/api/v1/users/changeEmail",
    })
      .then((res) => {
        setChangeEmailState({
          status: true,
          message: res.data.comment,
        });
        setLoadingEmail(false);
        const storedData = JSON.parse(localStorage.getItem("userData"));
        storedData.email = res.data.email;
        localStorage.setItem("userData", JSON.stringify(storedData));
        auth.login();
      })
      .catch((error) => {
        let message = error.response.data.slice(
          error.response.data.search("Error: ") + 6,
          error.response.data.search("<br>")
        );
        setLoadingEmail(false);

        setChangeEmailState({
          status: false,
          message: message,
        });
      });
  };

  return auth.isLoggedIn ? (
    <div className="edit-profile-wrapper">
      {isLoading ? (
        <Loader active="loader--show"></Loader>
      ) : (
        <Loader active="loader--hide"></Loader>
      )}

      <Container>
        <Row className={"justify-content-md-center"}>
          <Col md="auto" className="form">
            <p className="title">EDYTUJ SWÓJ PROFIL</p>
            <hr></hr>
            <Form>
              {changeAvatarState.message !== "" ? (
                <Alert
                  variant={changeAvatarState.status ? "success" : "danger"}
                >
                  {changeAvatarState.message}
                </Alert>
              ) : (
                ""
              )}
              <ImageUpload
                center
                id="avatar"
                errorText="To zdjęcie jest zbyt duże"
                onInput={inputHandlerAvatar}
              />
              <Button
                className="button-primary--edit-profile"
                disabled={!formAvatar.isValid}
                onClick={changeAvatar}
              >
                {isLoadingAvatar && <LoadingSpinner></LoadingSpinner>}
                Zapisz nowe zdjęcie
              </Button>

              <p className="subtitle">ZMIEŃ SWÓJ E-MAIL</p>
              {changeEmailState.message !== "" ? (
                <Alert variant={changeEmailState.status ? "success" : "danger"}>
                  {changeEmailState.message}
                </Alert>
              ) : (
                ""
              )}
              <Input
                id="email"
                element="input"
                type="email"
                validators={[
                  VALIDATOR_REQUIRE(),
                  VALIDATOR_EMAIL(),
                  VALIDATOR_OLD_EMAIL(auth.email),
                ]}
                errorText="Ten email nie jest poprawny."
                onInput={inputHandlerEmail}
                placeholder="Wprowadź stary adres e-mail"
              ></Input>
              <Input
                id="newEmail"
                element="input"
                type="email"
                validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
                errorText="Proszę wprowadź prawidłowy adres e-mail."
                onInput={inputHandlerEmail}
                placeholder="Wprowadź nowy adres e-mail"
              ></Input>
              <Button
                className="button-primary--edit-profile"
                disabled={!formEmail.isValid}
                onClick={changeEmail}
              >
                {isLoadingEmail && <LoadingSpinner></LoadingSpinner>}
                Zapisz nowy adress e-mail
              </Button>

              <p className="subtitle">ZMIEŃ SWOJE HASŁO</p>
              {changePasswordState.message !== "" ? (
                <Alert
                  variant={changePasswordState.status ? "success" : "danger"}
                >
                  {changePasswordState.message}
                </Alert>
              ) : (
                ""
              )}
              <Input
                id="password"
                element="input"
                type="password"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Proszę wprowadź stare hasło."
                onInput={inputHandlerPassword}
                placeholder="Wprowadź stare hasło."
              ></Input>
              <Input
                id="newPassword"
                element="input"
                type="password"
                validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(8)]}
                errorText="Hasło musi mieć co najmniej 8 znaków."
                onInput={inputHandlerPassword}
                placeholder="Wprowadź nowe hasło."
              ></Input>
              <Input
                id="repeatedPassword"
                element="input"
                type="password"
                validators={[
                  VALIDATOR_REQUIRE(),
                  VALIDATOR_SAMEVALUE(formPassword.inputs.newPassword.value),
                ]}
                errorText="Hasła muszą być takie same."
                onInput={inputHandlerPassword}
                placeholder="Powtórz nowe hasło."
              ></Input>
              <Button
                className="button-primary--edit-profile"
                disabled={!formPassword.isValid}
                onClick={changePassword}
              >
                {isLoadingPassword && <LoadingSpinner></LoadingSpinner>}
                Zapisz nowe hasło
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  ) : (
    <Redirect to={{ pathname: "/login" }}></Redirect>
  );
};

export default EditProfile;
