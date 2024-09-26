import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import Main from './components/Main';
import Subscribe from './components/Subscribe';
import SuccessPage from './components/SuccessPage';
import FailPage from './components/FailPage';
import CancelPage from './components/CancelPage';

import 'normalize.css';
import './style/Main.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedLoginStatus = localStorage.getItem('isLoggedIn');
    return storedLoginStatus === 'true';
  });

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/main" />
            ) : (
              <LoginPage setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />

        <Route
          path="/subscribe"
          element={isLoggedIn ? <Subscribe /> : <Navigate to="/login" />}
        />

        <Route
          path="/success"
          element={isLoggedIn ? <SuccessPage /> : <Navigate to="/login" />}
        />

        <Route
          path="/fail"
          element={isLoggedIn ? <FailPage /> : <Navigate to="/login" />}
        />

        <Route path="/cancel" element={<CancelPage />} />

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
      </Routes>
    </Router>
  );
}

export default App;
