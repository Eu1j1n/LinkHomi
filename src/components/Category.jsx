import React, { useEffect, useState } from 'react';
import CategoryBoard from './CategoryBoard';
import { IoMdAdd } from 'react-icons/io'; // 여전히 IoMdAdd 사용
import '../style/Category.css';

function Category(props) {
  const [inputValue, setInputValue] = useState('');
  const [categoryList, setCategoryList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      setCategoryList(JSON.parse(storedCategories));
    }
  }, []);

  const addList = () => {
    if (inputValue.trim() === '') return;
    const updatedList = [...categoryList, inputValue];
    setCategoryList(updatedList);
    localStorage.setItem('categories', JSON.stringify(updatedList));
    setInputValue('');
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      addList();
    }
  };

  const handleClear = () => {
    localStorage.clear();
    alert('초기화 완료');
  };

  return (
    <>
      <div className="category-container">
        <h1 className="category-title">
          {isEditing ? (
            <input
              className={`input-text ${isEditing ? 'active' : ''}`}
              type="text"
              placeholder="카테고리명을 입력하세요"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onBlur={addList}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          ) : (
            <>FAVORITE</>
          )}
        </h1>
        <button onClick={handleClear}>clear</button>{' '}
        <CategoryBoard categoryList={categoryList} />
        <div className="add-button-container">
          <button className="add-button" onClick={handleEdit}>
            <span className="add-button__text">Add Item</span>
            <span className="add-button__icon">
              <IoMdAdd className="svg" />
            </span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Category;
