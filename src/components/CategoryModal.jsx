import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import '../style/Category.css';

Modal.setAppElement('#root');

function CategoryModal({ isOpen, onClose, userId, addCategory }) {
  const [categoryName, setCategoryName] = useState('');

  const modalStyle = {
    content: {
      display: 'flex',
      justifyContent: 'space-between',
      backgroundColor: '#F4F4F4',
      color: 'black',
      borderRadius: '8px',
      maxWidth: '300px',
      maxHeight: '130px',
      margin: 'auto',
      fontSize: '18px',
      fontWeight: 'bold',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('카테고리 등록 :', { userId, categoryName });
    
    axios
      .post('http://localhost:5001/api/add-category', {
        userId,
        name: categoryName,
      })
      .then((response) => {
        console.log('카테고리 추가 성공:', response);
        addCategory(categoryName);
        setCategoryName(''); // 입력 필드 초기화
        onClose(); // 모달 닫기
      })
      .catch((error) => {
        console.error('카테고리 추가 실패:', error.response?.data || error.message);
      });
  };

  return (
    <>
      <Modal isOpen={isOpen} onRequestClose={onClose} style={modalStyle}>
        <form onSubmit={handleSubmit}>
          <div>
            <label>카테고리 생성</label>
            <input
              type="text"
              style={{
                marginTop: '20px',
                marginBottom: '10px',
                width: '280px',
                height: '20px',
                padding: '8px',
                fontSize: '11px',
                borderColor: '#D9D9D9',
              }}
              placeholder="카테고리명을 입력하세요.."
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>
          <div className="button-container">
            <button type="submit" className="add-category-button">
              추가
            </button>
            <button type="button" className="close-button" onClick={onClose}>
              닫기
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default CategoryModal;
