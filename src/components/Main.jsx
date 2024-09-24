import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import '../style/Main.css';
import Category from './Category';
import AddUrlModal from './AddUrlModal';
import axios from 'axios';
import PostCard from './PostCard';
function Main({ setIsLoggedIn }) {
  const [browsingHistory, setBrowsingHistory] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isRotated, setRotated] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [matchedUrls, setMatchedUrls] = useState([]); // 추가된 상태
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCategories = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:5001/api/get-categories/${userId}`
          );
          setCategories(response.data);
        } catch (error) {
          console.error('카테고리 조회 오류:', error);
        }
      }
    };
    fetchCategories();
  }, []);
  const handleSubscribeClick = () => {
    navigate('/subscribe');
  };
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
    setRotated(!isRotated);
  };
  const handleContentClick = () => {
    if (isSidebarOpen) {
      setSidebarOpen(false);
      setRotated(false);
    }
  };
  const handleSaveUrl = (urlData) => {
    console.log('URL 데이터 저장:', urlData);
  };
  const handleCategoryChange = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };
  // Category 컴포넌트에서 URL 목록을 받아오는 콜백 함수
  const handleMatchedUrls = (urls) => {
    setMatchedUrls(urls);
  };
  return (
    <div className="container">
      <Category
        setIsLoggedIn={setIsLoggedIn}
        onMatchedUrls={handleMatchedUrls}
      />
      <div className="main-content" onClick={handleContentClick}>
        <h1>Main</h1>
        <p>이곳은 메인 콘텐츠 영역입니다.</p>
        <PostCard urls={matchedUrls} /> {/* PostCard에 URL 목록 전달 */}
      </div>
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button className="toggle-button" onClick={toggleSidebar}>
          <FontAwesomeIcon
            icon={faClockRotateLeft}
            className={`icon ${isRotated ? 'rotated' : ''}`}
          />
        </button>
        {isSidebarOpen && (
          <div className="sidebar-content">
            <button
              className="addUrl-button"
              onClick={() => setModalOpen(true)}
            >
              Add Url +
            </button>
          </div>
        )}
        {isModalOpen && (
          <AddUrlModal
            onClose={() => setModalOpen(false)}
            onSave={handleSaveUrl}
            categories={categories}
          />
        )}
      </div>
    </div>
  );
}
export default Main;
