import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CategoryBoard from './CategoryBoard';
import titleImage from '../assets/images/title.png';
import mainlogoImage from '../assets/images/mainlogo.png';
import CategoryModal from './CategoryModal';
import '../style/Category.css';

function Category() {
  const [categoryList, setCategoryList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const userId = localStorage.getItem('userId');

  const modalOpen = () => setIsOpen(true);
  const modalClose = () => setIsOpen(false);

  // 서버에서 카테고리 목록 불러오기
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
    localStorage.setItem(`categoryList_${userId}`, JSON.stringify(updatedCategoryList)); // localStorage에 저장
  };

  return (
    <div className="category-container">
      <div className="category-header">
        <img src={mainlogoImage} alt="웹사이트 로고" className="website-logo" />
        <img src={titleImage} alt="웹사이트 타이틀" className="website-title" />
      </div>
      <button onClick={modalOpen} className="add-button">
        Add Category +{' '}
      </button>
      <CategoryModal isOpen={isOpen} onClose={modalClose} userId={userId} addCategory={addCategory} />
      <CategoryBoard categoryList={categoryList} />
    </div>
  );
}

export default Category;
