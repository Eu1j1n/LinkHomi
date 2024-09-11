import React, { useState } from 'react';
import CategoryBoard from './CategoryBoard';
import titleImage from '../assets/images/title.png';
import mainlogoImage from '../assets/images/mainlogo.png';
import CategoryModal from './CategoryModal';
import '../style/Category.css';

function Category(props) {
  const [inputValue, setInputValue] = useState('');
  const [categoryList, setCategoryList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const modalOpen = () => setIsOpen(true);
  const modalClose = () => setIsOpen(false);

  // localStorage에서 userId를 가져옵니다.
  const userId = localStorage.getItem('userId');
  console.log('User ID:', userId); // userId 확인

  return (
    <div className="category-container">
      <div className="category-header">
        <img src={mainlogoImage} alt="웹사이트 로고" className="website-logo" />
        <img src={titleImage} alt="웹사이트 타이틀" className="website-title" />
      </div>
      <button onClick={modalOpen} className="add-button">
        Add Category +{' '}
      </button>
      <CategoryModal isOpen={isOpen} onClose={modalClose} userId={userId} />
      <CategoryBoard categoryList={categoryList} />
    </div>
  );
}

export default Category;
