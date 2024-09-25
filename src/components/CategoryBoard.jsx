import React from "react";
import CategoryList from "./CategoryList";

function CategoryBoard({
  categoryList,
  selectedCategoryId,
  onCategoryClick,
  onDeleteCategory,
  onEditCategory,
}) {
  console.log("Category List:", categoryList);

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
          />
        ))
      ) : (
        <p>No categories available</p>
      )}
    </div>
  );
}

export default CategoryBoard;
