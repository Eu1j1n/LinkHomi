import React from 'react';
import "../style/LoginPage.css";
import logo from "../assets/images/logo.png";

function LoginPage(props) {
  return (
    <div className="login-page">
      <h3 className='intro-caption'>
        링클과 함께하세요
      </h3>
      <div className='sub'>
        <img src={logo} alt="logo" className="logo" />
        L<span className='ink'>INK</span><span className='k'>K</span><span className='LE'>LE</span>
      </div>
      <h2 className='login-description'>소셜 계정으로 간편하게 가입하세요! </h2>
      <button>btn</button>
    </div>
  );
}

export default LoginPage;
