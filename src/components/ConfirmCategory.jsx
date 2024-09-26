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
  onMatchedUrls, // 여기서 전달
}) {
  
  return (
    <div>
      <div className="category-favorite">
      <CategoryModal
          isOpen={isOpen}
          onClose={modalClose}
          userId={userId}
          addCategory={addCategory}
          grade={grade}
        />
        <FcLike className="favorite-icon" />
        Favorite
      </div>

      <div className="category">
        <PiListHeartBold className="list" /> Category List
        <CategoryBoard
          categoryList={categoryList}
          selectedCategoryId={selectedCategoryId}
          onCategoryClick={onCategoryClick}
          onEditCategory={onEditCategory}
          onDeleteCategory={onDeleteCategory}
          onMatchedUrls={onMatchedUrls} // 여기서 전달
        />
      </div>
    </div>
  );
}

export default ConfirmCategory;
