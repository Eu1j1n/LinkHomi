import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CategoryBoard from './CategoryBoard';
import titleImage from '../assets/images/title.png';
import mainlogoImage from '../assets/images/mainlogo.png';
import CategoryModal from './CategoryModal';
import '../style/Category.css';
import { FcLike } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';

function Category({ setIsLoggedIn }) {
  const [categoryList, setCategoryList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const userId = localStorage.getItem('userId');
  const userProfileImage = localStorage.getItem('userProfile'); // 사용자 프로필 이미지 URL 가져오기
  const navigate = useNavigate();

  const modalOpen = () => setIsOpen(true);
  const modalClose = () => setIsOpen(false);

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:5001/api/get-categories/${userId}`)
        .then((response) => {
          console.log('DB에서 가져온 카테고리 목록:', response.data);
          setCategoryList(response.data.map((category) => category.name));
        })
        .catch((error) => {
          console.error('카테고리 조회 오류:', error);
        });
    }
  }, [userId]);

  const addCategory = (newCategory) => {
    const updatedCategoryList = [...categoryList, newCategory];
    setCategoryList(updatedCategoryList);
    localStorage.setItem(
      `categoryList_${userId}`,
      JSON.stringify(updatedCategoryList)
    );
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <div className="category-container">
      <div className="category-header">
        {/* <img src={mainlogoImage} alt="웹사이트 로고" className="website-logo" />
        <img src={titleImage} alt="웹사이트 타이틀" className="website-title" /> */}
        {/* img로고 우선 주석처리, 여기 localStorage에 저장된 이름 표시할 것임 */}
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
        <CategoryBoard categoryList={categoryList} />
      </div>
      <div className="category_favorite">
        <FcLike className="favorite-icon" />
        Favorite
      </div>
      <div className="category_footer">
        <img
          src={userProfileImage}
          alt="사용자 프로필"
          className="profile-picture"
        />
        <button onClick={handleLogout} className="logout-btn">
          로그아웃
        </button>
      </div>
    </div>
  );
}

export default Category;
