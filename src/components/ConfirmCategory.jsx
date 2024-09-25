import React from 'react';
import { FcLike } from 'react-icons/fc';
import { PiListHeartBold } from 'react-icons/pi';
import CategoryBoard from './CategoryBoard';
import CategoryModal from './CategoryModal';

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
}) {
  return (
    <div>
      <div className="category-favorite">
        <FcLike className="favorite-icon" />
        Favorite
      </div>

      <div className="category">
        <PiListHeartBold className="list" /> Category List
        <CategoryModal
          isOpen={isOpen}
          onClose={modalClose}
          userId={userId}
          addCategory={addCategory}
          grade={grade}
        />
        <CategoryBoard
          categoryList={categoryList}
          selectedCategoryId={selectedCategoryId}
          onCategoryClick={onCategoryClick}
          onEditCategory={onEditCategory}
          onDeleteCategory={onDeleteCategory}
        />
      </div>
    </div>
  );
}

export default ConfirmCategory;
