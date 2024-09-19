import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CategoryBoard from './CategoryBoard';
import CategoryModal from './CategoryModal';
import '../style/Category.css';
import { FcLike } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import { TbLogout2 } from 'react-icons/tb';
import { FaCrown, FaRegStar } from 'react-icons/fa';

function Category({ setIsLoggedIn, onMatchedUrls }) {
  const [categoryList, setCategoryList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const userId = localStorage.getItem('userId');
  const userEmail = localStorage.getItem('userEmail');
  const userName = localStorage.getItem('userName');
  const userProfileImage = localStorage.getItem('userProfile');
  const navigate = useNavigate();

  const modalOpen = () => setIsOpen(true);
  const modalClose = () => setIsOpen(false);

  useEffect(() => {
    if (userId) {
      fetchCategories();
    }
  }, [userId]);

  const fetchCategories = () => {
    axios
      .get(`http://localhost:5001/api/get-categories/${userId}`)
      .then((response) => {
        setCategoryList(
          response.data.map((category) => ({
            id: category.id,
            name: category.name,
          }))
        );
      })
      .catch((error) => {
        console.error('카테고리 조회 오류:', error);
      });
  };

  const addCategory = (newCategory) => {
    fetchCategories(); // 새 카테고리를 추가한 후 카테고리 목록을 다시 가져옵니다.
  };

  const handleSubscribeClick = () => {
    navigate(`/subscribe?email=${encodeURIComponent(userEmail)}`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  const handleCategoryClick = async (id) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID가 localStorage에 저장되어 있지 않습니다.');
      }

      const response = await axios.post(
        'http://localhost:5001/api/check-url',
        { categoryId: id },
        { headers: { 'user-id': userId } }
      );

      if (response.data.match) {
        console.log('일치하는 URL이 있습니다!');
        console.log('일치하는 URL 목록:', response.data.urls);
        onMatchedUrls(response.data.urls); // URL 목록을 부모 컴포넌트로 전달
      } else {
        console.log('일치하는 URL이 없습니다.');
        onMatchedUrls([]); // URL 목록을 빈 배열로 설정
      }

      setSelectedCategoryId(id); // 클릭된 항목의 ID를 상태로 저장
    } catch (error) {
      console.error('서버 요청 오류:', error);
    }
  };

  return (
    <div className="category-container">
      <div className="category-header">
        <button onClick={modalOpen} className="add-button">
          Add Category +{' '}
        </button>
      </div>
      <div className="category">
        Category List
        <CategoryModal
          isOpen={isOpen}
          onClose={modalClose}
          userId={userId}
          addCategory={addCategory}
        />
        <CategoryBoard
          categoryList={categoryList}
          selectedCategoryId={selectedCategoryId}
          onCategoryClick={handleCategoryClick}
        />
      </div>
      <div className="category_favorite">
        <FcLike className="favorite-icon" />
        Favorite
      </div>
      <hr
        className="profile-divider"
        style={{ backgroundColor: '#c0c0c0', border: 'none', height: '1px' }}
      />
      <p className="profile-title">Profile</p>
      <button onClick={handleSubscribeClick} className="subscribe-btn">
        멤버십 구독
      </button>
      <div className="category_footer">
        <img
          src={userProfileImage}
          alt="사용자 프로필"
          className="profile-picture"
        />
        <div className="user-info">
          <p className="user-name">
            {userName}
            <FaCrown className="crown-icon" /> {}
            <FaRegStar className="basic-icon" /> {}
            <FaRegStar className="standard-icon" /> {}
          </p>
          <p className="user-email">{userEmail}</p>
        </div>
      </div>
      <button onClick={handleLogout} className="logout-btn">
        <TbLogout2 /> 로그아웃
      </button>
    </div>
  );
}

export default Category;
