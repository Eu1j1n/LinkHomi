import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import '../style/LoginPage.css';
import logo from '../assets/images/LoginLogo.png';
import GoogleLoginBtn from './GoogleLoginBtn';
import { useNavigate } from 'react-router-dom';

function LoginPage({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const introCaptionRef = useRef(null);
  const logoContainerRef = useRef(null);
  const socialLoginRef = useRef(null);
  const featureCheckRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from(introCaptionRef.current, { y: -50, opacity: 0, duration: 1 })
      .from(
        logoContainerRef.current,
        { scale: 0.8, opacity: 0, duration: 1 },
        '-=0.5'
      )
      .from(socialLoginRef.current, { y: 50, opacity: 0, duration: 1 }, '-=0.5')
      .from(featureCheckRef.current, { opacity: 0, duration: 1 }, '-=0.5');

    // Hover animation for feature check
    gsap.to(featureCheckRef.current, {
      scale: 1.05,
      duration: 0.3,
      paused: true,
      ease: 'power1.inOut',
    });
  }, []);

  const handleFeatureCheckClick = () => {
    navigate('/');
  };

  const handleFeatureCheckHover = (event) => {
    gsap.to(event.currentTarget, {
      scale: 1.05,
      duration: 0.3,
      ease: 'power1.inOut',
    });
  };

  const handleFeatureCheckLeave = (event) => {
    gsap.to(event.currentTarget, {
      scale: 1,
      duration: 0.3,
      ease: 'power1.inOut',
    });
  };

  return (
    <div className="login-page">
      <h1 className="intro-caption" ref={introCaptionRef}>
        링클과 함께하세요
      </h1>

      <div className="logo-container" ref={logoContainerRef}>
        <img src={logo} alt="logo" className="logo" />
        <span className="brand-name">
          <span className="highlight">LIN</span>
          <span className="dark">KKLE</span>
        </span>
      </div>

      <div className="social-login" ref={socialLoginRef}>
        <GoogleLoginBtn setIsLoggedIn={setIsLoggedIn} />
      </div>

      <p
        className="feature-check"
        ref={featureCheckRef}
        onClick={handleFeatureCheckClick}
        onMouseEnter={handleFeatureCheckHover}
        onMouseLeave={handleFeatureCheckLeave}
      >
        링클의 기능을 다시 확인하고 싶으신가요?
      </p>
    </div>
  );
}

export default LoginPage;
