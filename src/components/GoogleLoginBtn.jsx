import { GoogleLogin } from '@react-oauth/google';
import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import '../style/Login.css';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';

gsap.registerPlugin(TextPlugin);

const StyledGoogleLoginButton = styled(GoogleLogin)`
  width: 400px;
  padding: 15px;
  background-color: #4285f4; /* Google 파란색 */
  color: white; /* 글자 색상 */
  font-size: 16px; /* 글자 크기 */
  border: none; /* 테두리 없애기 */
  border-radius: 5px; /* 모서리 둥글게 */
  cursor: pointer; /* 마우스 커서 변경 */
  display: flex; /* 플렉스 박스 */
  align-items: center; /* 수직 중앙 정렬 */
  justify-content: center; /* 수평 중앙 정렬 */
  transition: background-color 0.3s; /* 배경색 전환 효과 */

  &:hover {
    background-color: #357ae8; /* 호버 시 색상 */
  }

  &:focus {
    outline: none; /* 포커스 아웃라인 제거 */
  }

  img {
    margin-right: 10px; /* 이미지와 텍스트 간격 */
  }
`;

const GoogleLoginBtn = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const loginBtnRef = useRef(null);

  const handleSuccess = (response) => {
    console.log('로그인 성공', response);
    console.log('OAuth Token:', response.credential);

    axios
      .post('http://localhost:5001/api/google-login', {
        token: response.credential,
      })
      .then((res) => {
        console.log('유저 데이터', res.data);
        setIsLoggedIn(true);

        localStorage.setItem('userId', res.data.userId);
        localStorage.setItem('userProfile', res.data.payload.picture);
        localStorage.setItem('userEmail', res.data.payload.email);
        localStorage.setItem('userName', res.data.payload.name);
        localStorage.setItem('userGrade', res.data.grade || 'NORMAL');

        navigate('/main'); // 페이지 이동
      })
      .catch((error) => {
        console.error('에러:', error);
      });
  };

  const handleError = (error) => {
    console.error('로그인 실패:', error);
  };

  useEffect(() => {
    // 애니메이션 설정
    gsap.from(loginBtnRef.current, {
      opacity: 0,
      y: -50,
      duration: 1,
      ease: 'power2.out',
    });
  }, []);

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
            <StyledGoogleLoginButton
              onSuccess={handleSuccess}
              onError={handleError}
            >
              <img
                src="/path/to/google-logo.png"
                alt="Google Logo"
                width="20"
                height="20"
              />
              로그인
            </StyledGoogleLoginButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default GoogleLoginBtn;
