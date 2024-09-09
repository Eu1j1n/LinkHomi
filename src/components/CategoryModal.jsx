import React, { useState } from 'react';
import Modal from 'react-modal';
import '../style/Category.css';

Modal.setAppElement('#root'); // 이 줄을 추가하여 오류 해결

function CategoryModal({ isOpen, onClose }) {
  const [categoryName, setCategoryName] = useState('');

  const modalStyle = {
    content: {
      backgroundColor: '#059669',
      color: 'black',
      border: 'none',
      borderRadius: '8px',
      maxWidth: '300px',
      maxHeight: '200px',
      margin: 'auto',
      padding: '20px',
    },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        style={modalStyle} // 인라인 스타일 적용
      >
        <form onSubmit={handleSubmit}>
          <div>
            <label>카테고리명을 입력하세요</label>
            <input
              className='input-space'
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>
          <div>
            <button type="submit">추가</button>
            <button type="button" onClick={onClose}>닫기</button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default CategoryModal;
