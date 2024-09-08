import React, { useEffect, useState } from 'react'
import CategoryBoard from './CategoryBoard';
import { IoMdAdd } from "react-icons/io";
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
    if (inputValue.trim() === '') return; // 빈 입력값은 무시
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
  //localStorage 임시 초기화 버튼
  const handleClear = () => {
    localStorage.clear();
    alert('초기화 완료');
  };

  return (
    <div className='category-container'>
      <h1 className='category-title'>
        {isEditing ? (
          <input
            className={`input-text ${isEditing ? 'active' : ''}`}
            type='text'
            placeholder='카테고리명을 입력하세요'
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onBlur={addList}
            onKeyDown={handleKeyDown} // Enter 키로 등록
            autoFocus
          />
        ) : (
          <>
            FAVORITE
            <IoMdAdd onClick={handleEdit} className='add-button' />
          </>
        )}
      </h1>
      <button onClick={handleClear}>clear</button> {/*임시로 만든 초기화 버튼*/}
      <CategoryBoard categoryList={categoryList} />
    </div>
  );
}

export default Category;
