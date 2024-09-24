import { GoogleLogin } from '@react-oauth/google';
import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import '../style/Login.css';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { Helmet } from 'react-helmet';

gsap.registerPlugin(TextPlugin);

const GoogleLoginBtn = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const h1Ref = useRef(null);
  const h2Ref = useRef(null);
  const loginBtnRef = useRef(null);
  const bubblesRef = useRef(null);

  useEffect(() => {
    const timeline = gsap.timeline();

    // h1과 h2 텍스트를 동시에 작게 나타나게 하기
    timeline.fromTo(
      [h1Ref.current, h2Ref.current],
      { opacity: 0, y: -50, scale: 0.5 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: 'power2.out',
        delay: 0.5,
      }
    );

    // h2 텍스트 애니메이션
    timeline.fromTo(
      h2Ref.current,
      { opacity: 0, text: '' },
      {
        opacity: 1,
        text: '나만의 URL 보관함을 만들어보세요!',
        duration: 2,
        ease: 'power2.out',
        delay: 0.5,
      }
    );

    // 텍스트 다나오고 나서
    timeline.to([h1Ref.current, h2Ref.current], {
      scale: 2.0,
      duration: 1,
      ease: 'power2.out',
      delay: 0.3,
      onComplete: () => {
        gsap.to(h2Ref.current, {
          marginTop: '40px',
          duration: 0.5,
        });
        // 풍선들이 나타나게 설정
        gsap.to(bubblesRef.current.children, {
          opacity: 1,
          duration: 2,
          stagger: 0.1,
        });
      },
    });

    timeline.fromTo(
      loginBtnRef.current,
      { opacity: 0, scale: 0.8, marginTop: '20px' },
      {
        opacity: 1,
        scale: 1,
        marginTop: '40px',
        duration: 1,
        ease: 'power2.out',
        delay: 1,
      }
    );
  }, []);

  const handleSuccess = (response) => {
    console.log('로그인 성공', response);
    console.log('OAuth Token:', response.credential); // 토큰 출력

    axios
      .post('http://localhost:5001/api/google-login', {
        token: response.credential,
      })
      .then((res) => {
        console.log('유저 데이터', res.data);
        setIsLoggedIn(true);
        // userId를 로컬스토리지에 저장
        localStorage.setItem('userId', res.data.userId); // UUID로 변경된 userId
        localStorage.setItem('userProfile', res.data.payload.picture);
        localStorage.setItem('userEmail', res.data.payload.email);
        localStorage.setItem('userName', res.data.payload.name);
        // 사용자 등급도 저장 (예: "basic" 또는 "premium")
        localStorage.setItem('userGrade', res.data.grade || 'NOMAL');

        navigate('/main');
      })
      .catch((error) => {
        console.error('에러:', error);
      });
  };

  const handleError = (error) => {
    console.error('로그인 실패:', error);
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
          <h1 ref={h1Ref}> 지금 가입하고, 링크 호미와 함께</h1>
          <h2 ref={h2Ref}>나만의 URL 보관함을 만들어보세요!</h2>
          <div className="login-btn" ref={loginBtnRef}>
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              width={'500px'}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default GoogleLoginBtn;
