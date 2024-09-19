import React from 'react';
import '../style/Category.css';

function CategoryList({ item, isSelected, onClickItem }) {
  return (
    <div>
      <h1
        className="category-list"
        onClick={() => onClickItem(item.id)}
        style={{
          background: isSelected
            ? 'linear-gradient(135deg, #06a375, #047857, #035c49)'
            : 'none',
          fontWeight: isSelected ? 'bold' : 'normal',
          color: isSelected ? 'white' : 'black',
        }}
      >
        {item.name || 'No name'}
      </h1>
    </div>
  );
}

export default CategoryList;
