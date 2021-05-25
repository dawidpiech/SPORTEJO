import React, { useState } from "react";
import "./Login.scss";
import Axios from "axios";

const Login = () => {
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [data, setData] = useState(null);

  const register = () => {
    Axios({
      method: "POST",
      data: {
        email: "email@dsa.pl",
        username: "dawid",
        avatar: "ścieżka",
        password: "haslo1234568",
      },
      withCredentials: true,
      url: "http://localhost:8000/api/v1/users/register",
    }).then((res) => console.log(res));
  };

  const login = () => {
    Axios({
      method: "POST",
      data: {
        username: loginUsername,
        password: loginPassword,
      },
      withCredentials: true,
      url: "http://localhost:8000/api/v1/users/login",
    }).then((res) => console.log(res));
  };

  const getUser = () => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:8000/api/v1/users/getUser",
    }).then((res) => {
      setData(res.data);
      console.log(res.data);
    });
  };

  const logout = () => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:8000/api/v1/users/logout",
    }).then((res) => {
      console.log(res.data);
      setData("Wylogowany");
    });
  };

  return (
    <div>
      <input
        placeholder="username"
        onChange={(e) => setLoginUsername(e.target.value)}
      />
      <input
        placeholder="password"
        onChange={(e) => setLoginPassword(e.target.value)}
      />
      <button onClick={login}>Submit</button>
    </div>
  );
};

export default Login;
