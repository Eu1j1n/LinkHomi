// CategoryBoard.jsx
import React from "react";
import CategoryList from "./CategoryList";

function CategoryBoard({
  categoryList,
  selectedCategoryId,
  onCategoryClick,
  onDeleteCategory,
  onEditCategory,
  onMatchedUrls,
  editingCategoryId,
  setEditingCategoryId,
}) {
  const validCategoryList = categoryList.filter(
    (item) => item && typeof item === "object" && item.id
  );

  return (
    <div>
      {validCategoryList.length > 0 ? (
        validCategoryList.map((item) => (
          <CategoryList
            key={item.id}
            item={item}
            isSelected={item.id === selectedCategoryId}
            onClickItem={onCategoryClick}
            onDeleteCategory={onDeleteCategory}
            onEditCategory={onEditCategory}
            onMatchedUrls={onMatchedUrls} // 여기서 전달
            editingCategoryId={editingCategoryId} // 추가: 수정 중인 카테고리 ID 전달ryId}
            setEditingCategoryId={setEditingCategoryId}
          />
        ))
      ) : (
        <p></p>
      )}
    </div>
  );
}

export default CategoryBoard;
