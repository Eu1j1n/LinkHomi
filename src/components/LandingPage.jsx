import React, { useRef, useEffect } from 'react';
import '../style/Landing.css';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import BouncingBall from './BouncingBall';
import { RxDoubleArrowUp } from 'react-icons/rx';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

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
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleSignupClick = () => {
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };
  const createParticles = (e) => {
    const particleCount = 20; // 생성할 파티클 수
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
      <div className="landingPage section">
        <div className="landing-firstComment">
          Welcome to
          <br />
          <BouncingBall />{' '}
          <span className="landing-rolling-linkkle" ref={linkkleRef}>
            LINKKLE !
          </span>
        </div>
        <button className="landing-start-btn" onMouseEnter={createParticles} onClick={handleSignupClick}>
          회원가입
        </button>
      </div>

      <div className="landing-divider"></div>
      <div className='second-page section'>
        <h1 className="landing-second-comment">WHAT IS LINKKLE ?</h1>
        <h3 className="landing-second-description">
          <p>링클은 방문한 웹사이트의 URL을 카테고리별로 쉽게 관리할 수 있는 웹 서비스입니다.</p>
          <p className='landing-second-page-emphasize' style={{ fontSize: '50px' }}>
            한 번의 드래그로 URL을 쉽게 복사하세요!
          </p>
        </h3>
      </div>

      <div className="landing-divider"></div>

      <section id="landing-section2" className="section">
        <h2 id="landing-h2">링클을 둘러보세요</h2>
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
