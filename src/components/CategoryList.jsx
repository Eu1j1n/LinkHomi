import React, { useState } from 'react';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai'; // 체크와 X 아이콘 import
import Swal from 'sweetalert2';
import { PiPencilDuotone } from 'react-icons/pi';
import { BiTrash } from 'react-icons/bi';
import axios from 'axios'; // axios import
import '../style/Category.css';

function CategoryList({
  item,
  isSelected,
  onClickItem,
  onEditCategory,
  onDeleteCategory,
  onMatchedUrls,
  editingCategoryId,
  setEditingCategoryId,
}) {
  const [newName, setNewName] = useState(item.name);

  const handleDrop = async (e) => {
    e.preventDefault();
    const urlString = e.dataTransfer.getData('text/plain');

    try {
      const data = JSON.parse(urlString);
      const title = data.title;
      const url = data.url;

      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found in local storage.');
      }

      const response = await axios.post(
        'http://localhost:5001/api/add-url',
        {
          categoryId: item.id,
          url: url,
          title: title,
        },
        {
          headers: { 'user-id': userId },
        }
      );

      const newUrl = {
        id: response.data.id,
        title,
        url,
        user_id: response.data.userId,
        created_at: response.data.created_at, // 서버에서 반환된 created_at 값 추가
      };

      onMatchedUrls((prevUrls) => [...prevUrls, newUrl]);

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
        text: error.message || 'URL 추가에 실패했습니다.',
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
    if (editingCategoryId === item.id) {
      setEditingCategoryId(null);
    } else {
      setEditingCategoryId(item.id);
      setNewName(item.name);
      onClickItem(item.id);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await onEditCategory(item.id, newName);
      setEditingCategoryId(null);
      Swal.fire('수정 완료!', '카테고리가 수정되었습니다.', 'success');
    } catch (error) {
      console.error('카테고리 수정 오류:', error);
      Swal.fire('오류!', '카테고리 수정에 실패했습니다.', 'error');
    }
  };

  return (
    <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
      <h1
        className="category-list"
        onClick={() => {
          // 수정 모드가 아닐 때만 카테고리 클릭 가능
          if (editingCategoryId === null) {
            onClickItem(item.id);
          }
        }}
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
        {editingCategoryId === item.id ? (
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
                background: 'transparent', // 배경색 투명
                border: 'none', // 테두리 제거
                cursor: 'pointer', // 커서 스타일
              }}
            >
              <AiOutlineCheck className="check-icon" />
            </button>
            <button
              type="button"
              onClick={handleEditToggle}
              className="button cancel-button"
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'transparent', // 배경색 투명
                border: 'none', // 테두리 제거
                cursor: 'pointer', // 커서 스타일
              }}
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
              {' '}
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
