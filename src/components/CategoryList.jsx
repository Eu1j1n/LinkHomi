import React from 'react';
import { PiPencilDuotone } from "react-icons/pi";
import { BiTrash } from "react-icons/bi";
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
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {item.name || 'No name'}
        <span style={{ 
            display: 'inline-flex', 
            gap: '8px'
          }}
        >
          <PiPencilDuotone className='edit'/>
          <BiTrash className='delete'/>
        </span>
      </h1>
    </div>
  );
}

export default CategoryList;