import { GoogleLogin } from "@react-oauth/google";
import React from "react";
import axios from "axios";

export const GoogleLoginBtn = () => {
  const handleSuccess = (response) => {
    console.log("로그인성공", response);

    axios
      .post("http://localhost:5001/api/google-login", {
        token: response.credential,
      })
      .then((res) => {
        console.log("유저데이터", res.data);
      })
      .catch((error) => {
        console.error("에러:", error);
      });
  };

  const handleError = (error) => {
    console.error("로그인 실팽:", error);
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
      width={"500px"}
    />
  );
};

export default GoogleLoginBtn;
