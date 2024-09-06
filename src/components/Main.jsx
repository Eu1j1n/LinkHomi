import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import '../style/Main.css';

// 임시 데이터
const browsingHistory = [
  {
    url: 'https://example.com',
    title: 'Example',
    icon: 'https://www.example.com/favicon.ico',
  },
  {
    url: 'https://google.com',
    title: 'Google',
    icon: 'https://www.google.com/favicon.ico',
  },
  // 추가적인 항목들을 여기에 추가
];

function Main() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="container">
      {/* 메인 콘텐츠 */}
      <div className="content">
        <h1>Main</h1>
        <p>이곳은 메인 콘텐츠 영역입니다.</p>
      </div>

      {/* 사이드바 */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button className="toggle-button" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faClockRotateLeft} className="icon" />
        </button>
        {isSidebarOpen && (
          <div className="sidebar-content">
            {browsingHistory.map((item, index) => (
              <div key={index} className="list-item">
                <img
                  src={item.icon}
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
