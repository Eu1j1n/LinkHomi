//카테고리 확인하기 누르면 나오는 컴포넌트
import React from 'react';
import { FcLike } from "react-icons/fc";
import { PiListHeartBold } from "react-icons/pi";
import CategoryBoard from "./CategoryBoard";
import CategoryModal from "./CategoryModal";

function ConfirmCategory({ categoryList, selectedCategoryId, onCategoryClick, addCategory, isOpen, modalClose, userId, grade }) {
  return (
    <div>
      <div className="category_favorite">
        <FcLike className="favorite-icon" />
        Favorite
      </div>

      <div className="category">
        <PiListHeartBold className="list"/> Category List
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
        />
      </div>
    </div>
  );
}

export default ConfirmCategory;
