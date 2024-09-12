import React, { useState, useEffect } from 'react';
import CategoryBoard from './CategoryBoard';
import titleImage from '../assets/images/title.png';
import mainlogoImage from '../assets/images/mainlogo.png';
import CategoryModal from './CategoryModal';
import '../style/Category.css';

function Category() {
  // 컴포넌트가 처음 로드될 때 localStorage에서 카테고리 목록을 불러옵니다.
  const [categoryList, setCategoryList] = useState(() => {
    const savedCategories = localStorage.getItem('categoryList');
    return savedCategories ? JSON.parse(savedCategories) : [];
  });

  const [isOpen, setIsOpen] = useState(false);

  const modalOpen = () => setIsOpen(true);
  const modalClose = () => setIsOpen(false);

  // localStorage에서 userId를 가져옴
  const userId = localStorage.getItem('userId');

  // 카테고리 추가 함수 (localStorage에 저장도 포함)
  const addCategory = (newCategory) => {
    const updatedCategoryList = [...categoryList, newCategory];
    setCategoryList(updatedCategoryList);
    localStorage.setItem('categoryList', JSON.stringify(updatedCategoryList)); // localStorage에 저장
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
