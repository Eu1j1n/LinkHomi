import React, { useState } from 'react';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai'; // 체크와 X 아이콘 import
import Swal from 'sweetalert2';
import { PiPencilDuotone } from 'react-icons/pi';
import { BiTrash } from 'react-icons/bi';
import { GoHeartFill } from 'react-icons/go';
import axios from 'axios'; // axios import
import '../style/Category.css';

function CategoryList({
  item,
  isSelected,
  onClickItem,
  onEditCategory,
  onDeleteCategory,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(item.name);

  // 드롭된 URL을 처리하는 핸들러
  // 드롭된 URL을 처리하는 핸들러
  const handleDrop = async (e) => {
    e.preventDefault();

    // 드래그한 데이터에서 URL과 타이틀 가져오기
    const urlString = e.dataTransfer.getData('text/plain');

    try {
      // JSON.parse를 사용하여 파싱 (타이틀과 URL이 배열로 포함되어 있다고 가정)
      const data = JSON.parse(urlString);
      const title = data.title; // 타이틀 가져오기
      const url = data.url; // URL 가져오기

      // 로컬 스토리지에서 사용자 ID 가져오기
      const userId = localStorage.getItem('userId');
      console.log(userId);

      // API 호출
      await axios.post(
        'http://localhost:5001/api/add-url',
        {
          categoryId: item.id, // 카테고리 ID
          url: url,
          title: title, // 타이틀 추가
        },
        {
          headers: { 'user-id': userId }, // 사용자 ID 추가
        }
      );

      Swal.fire({
        title: '성공!',
        text: 'URL이 카테고리에 추가되었습니다.',
        icon: 'success',
        confirmButtonText: '확인',
      });
    } catch (error) {
      console.error('Error adding URL:', error);
      Swal.fire({
        title: '오류!',
        text: 'URL 추가에 실패했습니다.',
        icon: 'error',
        confirmButtonText: '확인',
      });
    }
  };

  const handleDelete = () => {
    Swal.fire({
      title: `${item.name} 카테고리를 삭제하시겠습니까?`,
      text: '이 작업은 되돌릴 수 없습니다!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
    }).then((result) => {
      if (result.isConfirmed) {
        onDeleteCategory(item.id);
        Swal.fire('삭제 완료!', '카테고리가 삭제되었습니다.', 'success');
      }
    });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await onEditCategory(item.id, newName);
      setIsEditing(false);
      Swal.fire('수정 완료!', '카테고리가 수정되었습니다.', 'success');
    } catch (error) {
      console.error('카테고리 수정 오류:', error);
      Swal.fire('오류!', '카테고리 수정에 실패했습니다.', 'error');
    }
  };

  return (
    <div
      onDrop={handleDrop} // 드롭 핸들러 추가
      onDragOver={(e) => e.preventDefault()} // 드래그 오버 시 기본 동작 방지
    >
      <h1
        className="category-list"
        onClick={() => onClickItem(item.id)}
        style={{
          boxShadow: isSelected
            ? '0 0 0 1px #557AFF'
            : '0 0 0 1px rgba(0, 0, 0, 0.1)',
          background: isSelected ? '#BFCBF8' : 'transparent',
          fontWeight: isSelected ? 'bold' : 'normal',
          color: isSelected ? 'black' : 'inherit',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: '4px',
          transition: 'background 0.3s, box-shadow 0.3s',
        }}
      >
        {isEditing ? (
          <form
            onSubmit={handleEditSubmit}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={{
                marginRight: '8px',
                padding: '4px',
                fontSize: '14px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
              required
            />
            <button
              type="submit"
              className="button"
              style={{
                marginRight: '5px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <AiOutlineCheck className="check-icon" />
            </button>
            <button
              type="button"
              onClick={handleEditToggle}
              className="button cancel-button"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <AiOutlineClose className="close-icon" />
            </button>
          </form>
        ) : (
          <>
            {item.name || 'No name'}
            <span
              style={{
                display: 'inline-flex',
                gap: '8px',
              }}
            >
              <GoHeartFill className="favorite-icon" />
              <PiPencilDuotone className="edit" onClick={handleEditToggle} />
              <BiTrash className="delete" onClick={handleDelete} />
            </span>
          </>
        )}
      </h1>
    </div>
  );
}

export default CategoryList;
