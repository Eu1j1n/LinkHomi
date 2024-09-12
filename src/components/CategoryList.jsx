import React from 'react';
import '../style/Category.css';

function CategoryList({ item }) {
  // 객체의 속성에 접근해서 렌더링하기
  return (
    <div>
      {/* item이 객체인 경우, 객체의 속성값을 출력하도록 수정 */}
      <h1 className='category-list'>{item.name}</h1> {/* item.name은 객체의 특정 속성 */}
    </div>
  );
}

export default CategoryList;
