import React, { useState } from "react";
import { PiPencilDuotone } from "react-icons/pi";
import { BiTrash } from "react-icons/bi";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai"; // 체크와 X 아이콘 import
import axios from "axios";
import Swal from "sweetalert2";
import "../style/Category.css";

function CategoryList({
  item,
  isSelected,
  onClickItem,
  onEditCategory,
  onDeleteCategory,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(item.name);

  const handleDelete = () => {
    Swal.fire({
      title: `${item.name} 카테고리를 삭제하시겠습니까?`,
      text: "이 작업은 되돌릴 수 없습니다!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        onDeleteCategory(item.id);
        Swal.fire("삭제 완료!", "카테고리가 삭제되었습니다.", "success");
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
      Swal.fire("수정 완료!", "카테고리가 수정되었습니다.", "success");
    } catch (error) {
      console.error("카테고리 수정 오류:", error);
      Swal.fire("오류!", "카테고리 수정에 실패했습니다.", "error");
    }
  };

  return (
    <div>
      <h1
        className="category-list"
        onClick={() => onClickItem(item.id)}
        style={{
          background: isSelected
            ? "linear-gradient(135deg, #06a375, #047857, #035c49)"
            : "none",
          fontWeight: isSelected ? "bold" : "normal",
          color: isSelected ? "white" : "black",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {isEditing ? (
          <form
            onSubmit={handleEditSubmit}
            style={{ display: "flex", alignItems: "center" }}
          >
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={{
                marginRight: "8px",
                padding: "4px",
                fontSize: "14px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
              required
            />
            <button
              type="submit"
              className="button"
              style={{
                marginRight: "5px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <AiOutlineCheck className="check-icon" /> {/* 체크 아이콘 */}
            </button>
            <button
              type="button"
              onClick={handleEditToggle}
              className="button cancel-button"
              style={{ display: "flex", alignItems: "center" }}
            >
              <AiOutlineClose className="close-icon" /> {/* X 아이콘 */}
            </button>
          </form>
        ) : (
          <>
            {item.name || "No name"}
            <span
              style={{
                display: "inline-flex",
                gap: "8px",
              }}
            >
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
