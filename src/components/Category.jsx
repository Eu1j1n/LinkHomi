import React, { useEffect, useState } from 'react';
import CategoryBoard from './CategoryBoard';
import titleImage from '../assets/images/title.png'; 
import mainlogoImage from '../assets/images/mainlogo.png';
import CategoryModal from './CategoryModal';
import '../style/Category.css';

function Category(props) {
  const [inputValue, setInputValue] = useState('');
  const [categoryList, setCategoryList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      setCategoryList(JSON.parse(storedCategories));
    }
  }, []);

  const addList = () => {
    if (inputValue.trim() === '') return;
    const updatedList = [...categoryList, inputValue];
    setCategoryList(updatedList);
    localStorage.setItem('categories', JSON.stringify(updatedList));
    setInputValue('');
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      addList();
    }
  };

  // Modal 구현
  const [isOpen, setIsOpen] = useState(false);
  const modalOpen=() => {
    setIsOpen(true);
  }
  const modalClose=()=>{
    setIsOpen(false);
  }
  // const[isLogin, setIsLogin] = useState(false);
  // const[userInfo, setUserInfo] = useState({});
  
  // const handleClear = () => {
  //   localStorage.clear();
  //   alert('초기화 완료');
  // };

  return (
//     <>
//       <div className="category-container">
//         <h1 className="category-title">
//           {isEditing ? (
//             <input
//               className={`input-text ${isEditing ? 'active' : ''}`}
//               type="text"
//               placeholder="카테고리명을 입력하세요"
//               value={inputValue}
//               onChange={(event) => setInputValue(event.target.value)}
//               onBlur={addList}
//               onKeyDown={handleKeyDown}
//               autoFocus
//             />
//           ) : (
//             <>FAVORITE</>
//           )}
//         </h1>
//         <button onClick={handleClear}>clear</button>{' '}
//         <CategoryBoard categoryList={categoryList} />
//         <div className="add-button-container">
//           <button className="add-button" onClick={handleEdit}>
//             <span className="add-button__text">Add Item</span>
//             <span className="add-button__icon">
//               <IoMdAdd className="svg" />
//             </span>
//           </button>
//         </div>
//       </div>
//     </>
//   );
// }
    <div className='category-container'>
          <div className='category-header'>
            <img src={mainlogoImage} alt='웹사이트 로고' className='website-logo' />
            <img src={titleImage} alt='웹사이트 타이틀' className='website-title' />
          </div>
          <button onClick={modalOpen} className='add-button'>Add Category + </button> 
          <CategoryModal isOpen={isOpen} onClose={modalClose} />
          {/*<h1 className='category-title' />*/}
          <CategoryBoard categoryList={categoryList} />
          {/* {!isLogin
            ? <GoogleLoginBtn setUserInfo={setUserInfo} setIsLoggedIn={setIsLogin} />
            : <Profile userInfo={userInfo} />
          } */}
          </div>
      );
    }

export default Category;
