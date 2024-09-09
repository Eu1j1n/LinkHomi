import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import GoogleLoginBtn from './components/GoogleLoginBtn';
import Main from './components/Main';
import 'normalize.css';
import './style/Main.css';

function App() {
  // 페이지가 로드될 때 localStorage에서 로그인 상태를 확인
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedLoginStatus = localStorage.getItem('isLoggedIn');
    return storedLoginStatus === 'true'; // 문자열로 저장되므로 'true'와 비교
  });

  // 로그인 상태가 바뀔 때 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/main" />
            ) : (
              <GoogleLoginBtn setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />
        <Route
          path="/main"
          element={
            isLoggedIn ? (
              <Main setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/"
          element={<Navigate to={isLoggedIn ? '/main' : '/login'} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
