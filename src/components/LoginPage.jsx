import React, { useEffect, useRef } from "react";
import "../style/LoginPage.css";
import GoogleLoginBtn from "./GoogleLoginBtn";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import SplitType from "split-type";

function LoginPage({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const linkkleRef = useRef(null);
  const joinUsRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      ".logo",
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 1.5, ease: "power3.out" }
    );

    const combinedText = new SplitType(
      [joinUsRef.current, linkkleRef.current],
      {
        types: "chars",
        charClass: "combined-char",
      }
    );

    gsap.fromTo(
      ".combined-char",
      { y: 50, opacity: 0, rotation: 180, scale: 0.5 },
      {
        y: 0,
        opacity: 1,
        rotation: 0,
        scale: 1,
        duration: 1,
        stagger: 0.1,
        ease: "elastic.out(1, 0.5)",
        onComplete: () => {
          gsap.to(".combined-char", {
            color: "#FEFCE1",
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        },
      }
    );

    gsap.fromTo(
      ".feature-check",
      { opacity: 0 },
      { opacity: 1, duration: 1.5, ease: "power3.out", delay: 1 }
    );
  }, []);

  const handleFeatureCheckClick = () => {
    navigate("/");
  };

  return (
    <div className="login-page">
      <h1 className="intro-caption" ref={joinUsRef}>
        Join us with
      </h1>
      <h1 className="intro-caption highlight" ref={linkkleRef}>
        LINKKLE !
      </h1>
      <div className="social-login">
        <GoogleLoginBtn setIsLoggedIn={setIsLoggedIn} />
      </div>
      <p className="feature-check" onClick={handleFeatureCheckClick}>
        링클의 기능을 다시 확인하고 싶으신가요?
      </p>

      <p className="extension-link">
        <a
          href="https://chromewebstore.google.com/category/extensions?hl=ko&utm_source=ext_sidebar"
          target="_blank"
          rel="noopener noreferrer"
        >
          링클의 확장 프로그램 설치하기
        </a>
      </p>
    </div>
  );
}

export default LoginPage;
