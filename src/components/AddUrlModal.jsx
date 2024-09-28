import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/AddUrlModal.css';
import logo from '../assets/images/modal.png';
import Swal from 'sweetalert2';

const AddUrlModal = ({ onClose, onSave, onMatchedUrls }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchCategories = async () => {
      if (!userId) {
        console.error('User ID not found');
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5001/api/get-categories/${userId}`
        );
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [userId]);

  const handleSave = async () => {
    if (!selectedCategory) {
      Swal.fire({
        icon: 'warning',
        title: '저장 실패!',
        text: '카테고리를 선택해주세요!',
        confirmButtonText: '확인',
      });
      return; // 폴더 선택이 없으면 함수 종료
    }

    try {
      const response = await axios.post(
        'http://localhost:5001/api/add-url',
        { title, url, categoryId: selectedCategory },
        { headers: { 'user-id': userId } }
      );

      // 성공 메시지 표시
      Swal.fire({
        icon: 'success',
        title: '성공!',
        text: 'URL이 추가되었습니다!',
        confirmButtonText: '확인',
      });

      onSave({ title, url, categoryId: selectedCategory });
      const { id, created_at } = response.data;

      onMatchedUrls((prevUrls) => [
        ...prevUrls,
        {
          id,
          user_id: userId,
          title,
          url,
          category_id: selectedCategory,
          created_at,
        },
      ]);

      onClose();
    } catch (error) {
      console.error('URL 저장 오류:', error);
      // 실패 메시지 표시
      Swal.fire({
        icon: 'error',
        title: '실패!',
        text: 'URL 저장에 실패하였습니다.',
        confirmButtonText: '확인',
      });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <img src={logo} alt="Modal Logo" className="modal-logo" />
        <h3 className="add-modal-h3">URL 추가</h3>
        <div className="modal-field">
          <label>제목:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="modal-field">
          <label>URL:</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div className="modal-field">
          <label>폴더:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">저장 할 폴더 선택</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="modal-buttons">
          <button className="modal-save" onClick={handleSave}>
            저장
          </button>
          <button className="modal-close" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUrlModal;
