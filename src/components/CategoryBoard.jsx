import React from 'react';
import CategoryList from './CategoryList';

function CategoryBoard(props) {
  console.log("categoryList", props.categoryList)
  return (
    <div>
      {props.categoryList.map((item, index)=>
        <CategoryList key={index} item={item}/>)}
    </div>
  );
}

export default CategoryBoard;