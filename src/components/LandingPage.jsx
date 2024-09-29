import React, { useRef, useEffect } from 'react';
import '../style/Landing.css';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import BouncingBall from './BouncingBall';
import { RxDoubleArrowUp } from 'react-icons/rx';
import { useNavigate } from 'react-router-dom';
import payService from '../assets/images/payService.png';
import category from '../assets/images/category.png';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const LandingPage = () => {
  const number = useRef(null);
  const linkkleRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    gsap.from('#landing-h2', {
      scrollTrigger: {
        trigger: '#landing-h2',
        start: 'top bottom',
        end: 'top 400px',
        scrub: 1,
      },
      xPercent: -100,
      opacity: 0,
    });

    gsap.from('#landing-h3', {
      scrollTrigger: {
        trigger: '#landing-h3',
        start: 'top bottom+=100px',
        toggleActions: 'play complete none reset',
      },
      xPercent: 100,
      opacity: 0.5,
      duration: 1,
    });

    gsap.from('.landing-firstComment', {
      duration: 1.5,
      opacity: 0,
      scale: 0.8,
      ease: 'power3.out',
    });

    const linkkleText = new SplitType(linkkleRef.current, {
      types: 'chars',
      charClass: 'landing-rolling-linkkle-char',
    });

    gsap.fromTo(
      '.landing-rolling-linkkle-char',
      { y: -10 },
      {
        y: 50,
        duration: 1.5,
        stagger: 0.05,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      }
    );

    ScrollTrigger.create({
      trigger: '#landing-h3',
      start: 'top bottom+=-200px',
      endTrigger: '#landing-section2',
      end: 'bottom top',
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
    gsap.to(window, {
      scrollTo: { y: 0, autoKill: true },
      duration: 1, // 스크롤 속도 (1초 동안 부드럽게 이동)
      ease: 'power2.out', // 부드러운 가속 감속 효과
    });
  };

  const handleSignupClick = () => {
    setTimeout(() => {
      navigate('/login');
    }, 500);
  };

  const createParticles = (e) => {
    const particleCount = 40;
    const buttonRect = e.currentTarget.getBoundingClientRect();

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      document.body.appendChild(particle);

      // 파티클 위치 설정
      const x = Math.random() * buttonRect.width + buttonRect.left;
      const y = Math.random() * buttonRect.height + buttonRect.top;

      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;

      // 파티클 애니메이션
      gsap.to(particle, {
        duration: 1,
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
        opacity: 0,
        ease: 'power2.out',
        onComplete: () => {
          particle.remove();
        },
      });
    }
  };

  return (
    <>
      {/*첫번째 페이지*/}
      <div className="landingPage section">
        <div className="landing-firstComment">
          Welcome to
          <br />
          <BouncingBall />{' '}
          <span className="landing-rolling-linkkle" ref={linkkleRef}>
            LINKKLE !
          </span>
        </div>
        <button
          className="landing-start-btn"
          onMouseEnter={createParticles}
          onClick={handleSignupClick}
        >
          회원가입
        </button>
      </div>
      {/*두번째 페이지*/}
      <div className="landing-divider"></div>
      <div className="second-page section">
        <h1 className="landing-second-comment">WHAT IS LINKKLE ?</h1>
        <h3 className="landing-second-description">
          <p>
            링클은 방문한 웹사이트의 URL을 카테고리별로 쉽게 관리할 수 있는 웹
            서비스입니다.
          </p>
          <p
            className="landing-second-page-emphasize"
            style={{ fontSize: '50px' }}
          >
            한 번의 드래그로 URL을 쉽게 복사하세요!
          </p>
        </h3>
      </div>
      {/*세번째 페이지*/}
      <div className="landing-divider"></div>
      <section id="landing-section2" className="section">
        <h2 id="landing-h2">링클을 둘러보세요</h2>
      </section>

      {/*3-1카테고리 설명 부분*/}
      <div className="landing-divider"></div>
      <section id="landing-section2" className="section">
        <div className="LangingImg3-page">
          <p className="landingImg3-description">
            <span style={{ fontSize: '60px', fontWeight: 'bold' }}>
              URL 관리, 이제 더 쉽고 간편하게
            </span>{' '}
            <br />
            나만의 카테고리를 만들어 필요한 URL을 저장하고 관리하세요.<br></br>
            직접 만든 카테고리 안에서 원하는 링크를 손쉽게 찾으세요
          </p>
          <img
            src={category}
            alt="category"
            className="sort-category-description"
          />
        </div>
      </section>

      <div className="landing-divider"></div>
      <section id="landing-section2" className="section">
        <div className="LangingImg3-page">
          <p className="landingImg3-description">
            결제 프리미엄 서비스를 제공합니다<br></br>등급별로 제공되는 다양한
            기능을 통해 작업 효율을 극대화할 수 있습니다.{' '}
          </p>
          <img src={payService} alt="payService" className="payService" />
        </div>
      </section>

      {/*결제 서비스 설명 부분*/}
      <div className="landing-divider"></div>
      <section id="landing-section2" className="section">
        <div className="LangingImg3-page">
          <p className="landingImg3-description">
            결제 프리미엄 서비스를 제공합니다<br></br>등급별로 제공되는 다양한
            기능을 통해 작업 효율을 극대화할 수 있습니다.{' '}
          </p>
          <img src={payService} alt="payService" className="payService" />
        </div>
      </section>
      <div className="landing-divider"></div>
      <section className="section">
        <h2 id="landing-h3">
          빠르고 간편한 URL 관리 서비스
          <br />
          링클과 시작하세요 !
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
