import { GoogleLogin } from '@react-oauth/google';
import React, { useCallback } from 'react';
import axios from 'axios';
import '../style/Login.css';
import { useNavigate } from 'react-router-dom';

export const GoogleLoginBtn = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleSuccess = (response) => {
    console.log('로그인 성공', response);

    axios
      .post('http://localhost:5001/api/google-login', {
        token: response.credential,
      })
      .then((res) => {
        console.log('유저 데이터', res.data);
        setIsLoggedIn(true);
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
    <div>
      <h2>
        지금 가입하고, 링크 호미와 함께
        <br /> 나만의 URL 보관함을 만들어보세요!
      </h2>
      <div className="login-btn">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          width={'500px'}
        />
      </div>
    </div>
  );
};

export default GoogleLoginBtn;
