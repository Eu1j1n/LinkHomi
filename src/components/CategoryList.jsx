import React from 'react';
import '../style/Category.css';

function CategoryList(props) {
  return (
    <div>
      <h1 className='category-list'>{props.item}</h1>
    </div>
  );
}

export default CategoryList;
