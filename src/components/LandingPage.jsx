import React, { useRef, useEffect } from 'react';
import '../style/Landing.css';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import BouncingBall from './BouncingBall';
import { FaQuestion } from "react-icons/fa6";
import CardComponent from './CardComponent';
import { RxDoubleArrowUp } from "react-icons/rx";

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const number = useRef(null);
  const linkkleRef = useRef(null);

  useEffect(() => {
    gsap.from("#h2", {
      scrollTrigger: {
        trigger: "#h2",
        start: "top bottom",
        end: "top 400px",
        scrub: 1,
      },
      xPercent: -100,
      opacity: 0,
    });

    gsap.from("#h3", {
      scrollTrigger: {
        trigger: "#h3",
        start: "top bottom+=100px",
        toggleActions: "play complete none reset",
      },
      xPercent: 100,
      opacity: 0.5,
      duration: 1,
    });

    // 'Welcome'의 전체 애니메이션
    gsap.from('.firstComment', { 
      duration: 1.5, 
      opacity: 0, 
      scale: 0.8, 
      ease: 'power3.out' 
    });

    // 'LinkKle' 물결 애니메이션
    const linkkleText = new SplitType(linkkleRef.current, {
      types: 'chars',
      charClass: 'rolling-linkkle-char'
    });

    gsap.fromTo(
      '.rolling-linkkle-char', 
      { y: -10 }, 
      { 
        y: 50, 
        duration: 1.5, 
        stagger: 0.05, 
        repeat: -1, 
        yoyo: true, 
        ease: 'sine.inOut' 
      }
    );

    // ScrollTrigger 설정
    ScrollTrigger.create({
      trigger: "#h3",
      start: "top bottom+=-200px",
      endTrigger: '#section2',
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
      behavior: 'smooth' // 부드러운 스크롤을 위해 'smooth'를 사용합니다
    });
  };

  return (
    <>
    <div className='landingPage'>
      <div className="firstComment">
        Welcome to<br />
        <BouncingBall /> <span className="rolling-linkkle" ref={linkkleRef}>LinkKle !</span>
      </div>
      <button 
        className='start-btn'
        onClick={scrollToTop} // 버튼 클릭 시 scrollToTop 함수 호출
        >회원가입</button>
    </div>
    <div className="divider"></div>
    <section id='second_header'>
      <h1 className='second-comment'>What is LinkKle<FaQuestion /></h1>
      <h3 className='second-description'>LinkKle은 방문한 웹사이트의 URL을 카테고리별로 정리하여 쉽게 관리할 수 있는 웹 서비스입니다.<br></br> 링크를 쉽게 저장하고, 원하는 카테고리로 분류하여 언제든지 빠르게 찾아보세요.</h3>
    </section>
    <div className="divider"></div>

    <section id="section2">
      <h2 id="h2">
      링클을 둘러보세요 
      </h2>
    </section>
    <section>
      <CardComponent /> {/*예시 이미지 삽입한거임*/}
    </section>
  
    <div className="divider"></div>
    <section>
      <h2 id="h3">
      빠르고 간편한 URL 관리 서비스<br></br>지금 바로 시작하세요 !
      </h2>
      <button className="upper-button" onClick={scrollToTop}>시작하기</button>
      <RxDoubleArrowUp className='arrow' />
    </section>
    </>
  );
};

export default LandingPage;
