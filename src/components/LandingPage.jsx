import React, { useRef, useEffect } from "react";
import "../style/Landing.css";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from "split-type";
import BouncingBall from "./BouncingBall";
import { FaQuestion } from "react-icons/fa6";
import CardComponent from "./CardComponent";
import { RxDoubleArrowUp } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const number = useRef(null);
  const linkkleRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    gsap.from("#landing-h2", {
      scrollTrigger: {
        trigger: "#landing-h2",
        start: "top bottom",
        end: "top 400px",
        scrub: 1,
      },
      xPercent: -100,
      opacity: 0,
    });

    gsap.from("#landing-h3", {
      scrollTrigger: {
        trigger: "#landing-h3",
        start: "top bottom+=100px",
        toggleActions: "play complete none reset",
      },
      xPercent: 100,
      opacity: 0.5,
      duration: 1,
    });

    gsap.from(".landing-firstComment", {
      duration: 1.5,
      opacity: 0,
      scale: 0.8,
      ease: "power3.out",
    });

    const linkkleText = new SplitType(linkkleRef.current, {
      types: "chars",
      charClass: "landing-rolling-linkkle-char",
    });

    gsap.fromTo(
      ".landing-rolling-linkkle-char",
      { y: -10 },
      {
        y: 50,
        duration: 1.5,
        stagger: 0.05,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      }
    );

    ScrollTrigger.create({
      trigger: "#landing-h3",
      start: "top bottom+=-200px",
      endTrigger: "#landing-section2",
      end: "bottom top",
      onUpdate: (self) => {
        const progress = Math.max(2, Math.ceil(self.progress * 100));
        if (number.current) {
          number.current.innerHTML = progress;
        }
      },
    });

    ScrollTrigger.refresh();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSignupClick = () => {
    navigate("/login");
  };

  return (
    <>
      <div className="landingPage">
        <div className="landing-firstComment">
          Welcome to
          <br />
          <BouncingBall />{" "}
          <span className="landing-rolling-linkkle" ref={linkkleRef}>
            LinkKle !
          </span>
        </div>
        <button className="landing-start-btn" onClick={handleSignupClick}>
          회원가입
        </button>
      </div>
      <div className="landing-divider"></div>
      <section id="landing-second_header">
        <h1 className="landing-second-comment">
          What is LinkKle <FaQuestion />
        </h1>
        <h3 className="landing-second-description">
          LinkKle은 방문한 웹사이트의 URL을 카테고리별로 정리하여 쉽게 관리할 수
          있는 웹 서비스입니다.
          <br /> 링크를 쉽게 저장하고, 원하는 카테고리로 분류하여 언제든지
          빠르게 찾아보세요.
        </h3>
      </section>
      <div className="landing-divider"></div>

      <section id="landing-section2">
        <h2 id="landing-h2">링클을 둘러보세요</h2>
      </section>
      <section>
        <CardComponent />
      </section>

      <div className="landing-divider"></div>
      <section>
        <h2 id="landing-h3">
          빠르고 간편한 URL 관리 서비스
          <br />
          지금 바로 시작하세요 !
        </h2>
        <button className="landing-upper-button" onClick={scrollToTop}>
          시작하기
        </button>
        <RxDoubleArrowUp className="landing-arrow" />
      </section>
    </>
  );
};

export default LandingPage;
