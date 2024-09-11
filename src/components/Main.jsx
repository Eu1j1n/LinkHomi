import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import '../style/Main.css';
import Category from './Category';

function Main({ setIsLoggedIn }) {
  const [browsingHistory, setBrowsingHistory] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <div className="container">
      <Category />
      <div className="content">
        <h1>Main</h1>
        <p>이곳은 메인 콘텐츠 영역입니다.</p>
        <button onClick={handleLogout} className="logout-button">
          로그아웃
        </button>
      </div>
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button className="toggle-button" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faClockRotateLeft} className="icon" />
        </button>
        {isSidebarOpen && (
          <div className="sidebar-content">
            {browsingHistory.map((item, index) => (
              <div key={index} className="list-item">
                <img
                  src={`chrome://favicon/size/32x32/${item.url}`}
                  alt={`${item.title} icon`}
                  className="list-icon"
                />
                <div className="list-title">{item.title}</div>
                <a
                  href={item.url}
                  className="list-url"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.url}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Main;
