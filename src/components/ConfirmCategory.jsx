import React, { useState } from "react";
import CategoryBoard from "./CategoryBoard";
import CategoryModal from "./CategoryModal";
import { FcAddDatabase } from "react-icons/fc";

function ConfirmCategory({
  categoryList,
  selectedCategoryId,
  onCategoryClick,
  addCategory,
  isOpen,
  modalClose,
  userId,
  grade,
  onEditCategory,
  onDeleteCategory,
  onMatchedUrls,
}) {
  const [sortOrder, setSortOrder] = useState("latest");
  const [editingCategoryId, setEditingCategoryId] = useState(null); // 수정 중인 카테고리 ID

  const getSortedCategories = () => {
    const sortedCategories = [...categoryList];
    return sortedCategories.sort((a, b) => {
      if (sortOrder === "latest") {
        return b.id - a.id;
      } else {
        return a.id - b.id;
      }
    });
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  return (
    <div className="confirm-category-container">
      <div className="category-gap" />
      <div className="category-title">
        <FcAddDatabase className="list-icon" /> Category List
        <button
          className="sort-earliest"
          onClick={() => handleSortChange("oldest")}
        >
          오래된 순
        </button>
        <button
          className="sort-latest"
          onClick={() => handleSortChange("latest")}
        >
          최신순
        </button>
      </div>
      <div className="scrollable-category-list">
        <CategoryModal
          isOpen={isOpen}
          onClose={modalClose}
          userId={userId}
          addCategory={addCategory}
          grade={grade}
        />
        <CategoryBoard
          categoryList={getSortedCategories()} // 디폴트는 최신순으로 줌
          selectedCategoryId={selectedCategoryId}
          onCategoryClick={onCategoryClick}
          onEditCategory={onEditCategory}
          onDeleteCategory={onDeleteCategory}
          onMatchedUrls={onMatchedUrls}
          editingCategoryId={editingCategoryId} // 수정 중인 카테고리 ID 전달
          setEditingCategoryId={setEditingCategoryId} // 수정 중인 카테고리 ID 상태 업데이트 함수 전달
        />
      </div>
    </div>
  );
}

export default ConfirmCategory;
