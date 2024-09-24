import React from 'react';
import { PiPencilDuotone } from "react-icons/pi";
import { BiTrash } from "react-icons/bi";
import { GoHeartFill } from "react-icons/go";
import '../style/Category.css';

function CategoryList({ item, isSelected, onClickItem }) {
  return (
    <div>
      <h1
    className="category-list"
    onClick={() => onClickItem(item.id)}
    style={{
      background: isSelected ? '#BFCBF8' : 'transparent', 
      fontWeight: isSelected ? 'bold' : 'normal',
      color: isSelected ? 'black' : 'inherit',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      border: isSelected ? `2px solid #557AFF` : 'none', 
      borderRadius: '4px', 
      transition: 'background 0.3s, border 0.3s', 
  }}
>
        {item.name || 'No name'}
        <span style={{ 
            display: 'inline-flex', 
            gap: '8px'
          }}
        >
          <GoHeartFill className='favorites'/>
          <PiPencilDuotone className='edit'/>
          <BiTrash className='delete'/>
        </span>
      </h1>
    </div>
  );
}

export default CategoryList;