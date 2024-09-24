import React from "react";
import "../style/LoginPage.css";
import logo from "../assets/images/LoginLogo.png";
import GoogleLoginBtn from "./GoogleLoginBtn";
import { useNavigate } from "react-router-dom";

function LoginPage({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleFeatureCheckClick = () => {
    navigate("/");
  };
  return (
    <div className="login-page">
      <h1 className="intro-caption">링클과 함께하세요</h1>

      <div className="logo-container">
        <img src={logo} alt="logo" className="logo" />
        <span className="brand-name">
          <span className="highlight">LIN</span>
          <span className="dark">KKLE</span>
        </span>
      </div>
      <div className="social-login">
        <GoogleLoginBtn setIsLoggedIn={setIsLoggedIn} />
      </div>

      <p className="feature-check" onClick={handleFeatureCheckClick}>
        {" "}
        링클의 기능을 다시 확인하고 싶으신가요?
      </p>
    </div>
  );
}

export default LoginPage;
