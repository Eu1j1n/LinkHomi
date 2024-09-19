import React from 'react';
import CategoryList from './CategoryList';

function CategoryBoard({ categoryList, selectedCategoryId, onCategoryClick }) {
  console.log('Category List:', categoryList); // 데이터 확인

  const validCategoryList = categoryList.filter(
    (item) => item && typeof item === 'object' && item.id
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
          />
        ))
      ) : (
        <p>No categories available</p>
      )}
    </div>
  );
}

export default CategoryBoard;
