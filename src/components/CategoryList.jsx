import React from 'react';
import '../style/Category.css';

function CategoryList({ item }) {
  return (
    <div>
      <h1 className='category-list'>{item}</h1>
    </div>
  );
}

export default CategoryList;
