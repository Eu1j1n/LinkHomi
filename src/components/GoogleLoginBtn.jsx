import { GoogleLogin } from "@react-oauth/google";
import React, { useEffect, useRef } from "react";
import axios from "axios";
import "../style/Login.css";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { Helmet } from "react-helmet";

gsap.registerPlugin(TextPlugin);

const GoogleLoginBtn = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const h1Ref = useRef(null);
  const h2Ref = useRef(null);
  const loginBtnRef = useRef(null);
  const bubblesRef = useRef(null);

  const handleSuccess = (response) => {
    console.log("로그인 성공", response);
    console.log("OAuth Token:", response.credential);

    axios
      .post("http://localhost:5001/api/google-login", {
        token: response.credential,
      })
      .then((res) => {
        console.log("유저 데이터", res.data);
        setIsLoggedIn(true);

        localStorage.setItem("userId", res.data.userId);
        localStorage.setItem("userProfile", res.data.payload.picture);
        localStorage.setItem("userEmail", res.data.payload.email);
        localStorage.setItem("userName", res.data.payload.name);

        localStorage.setItem("userGrade", res.data.grade || "NORMAL");

        navigate("/main"); // 페이지 이동
      })
      .catch((error) => {
        console.error("에러:", error);
      });
  };

  const handleError = (error) => {
    console.error("로그인 실패:", error);
  };

  return (
    <>
      <Helmet>
        <meta
          http-equiv="Content-Security-Policy"
          content="frame-ancestors 'self' https://accounts.google.com"
        />
      </Helmet>
      <div className="login-container">
        <div className="content">
          <div className="login-btn" ref={loginBtnRef}>
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              width={"500px"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default GoogleLoginBtn;
