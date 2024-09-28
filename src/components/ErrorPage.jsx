import React, { useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import { gsap } from "gsap";
import "../style/ErrorPage.css";

function ErrorPage(props) {
  useEffect(() => {
    const balls = document.querySelectorAll(".bounce-ball");
    balls.forEach((ball, index) => {
      gsap.to(ball, {
        y: -30,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        delay: index * 0.2,
        ease: "bounce.out",
      });
    });
  }, []);

  return (
    <div className="error-container">
      <h1 className="error-heading">
        Page not found<span className="error-dot">.</span>
      </h1>
      <div className="error-message">
        <div className="error-description">
          존재하지 않는 주소를 입력하셨거나,
        </div>
        <div className="error-description">
          요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다.
        </div>
      </div>
      <div className="error-link-container">
        <a href="/main" className="error-link">
          메인으로 가기 <FaArrowRight className="error-icon" />
        </a>
      </div>
      <div className="bounce-container">
        <div className="bounce-ball"></div>
        <div className="bounce-ball white-ball"></div>{" "}
        <div className="bounce-ball"></div>
      </div>
      <div className="ground"></div>
    </div>
  );
}

export default ErrorPage;
