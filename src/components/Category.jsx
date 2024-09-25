import React, { useState, useEffect } from "react";
import axios from "axios";
import ConfirmCategory from "../components/ConfirmCategory"; 
import "../style/Category.css";
import { useNavigate } from "react-router-dom";
import { TbLogout2 } from "react-icons/tb";
import { CiSearch } from "react-icons/ci";
import { FaCrown, FaRegStar } from "react-icons/fa";
import websiteLogo from "../assets/images/websiteLogo.png";

function Category({ setIsLoggedIn, onMatchedUrls }) {
  const [categoryList, setCategoryList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [grade, setGrade] = useState("");
  const userId = localStorage.getItem("userId");
  const userEmail = localStorage.getItem("userEmail");
  const userName = localStorage.getItem("userName");
  const userProfileImage = localStorage.getItem("userProfile");
  const navigate = useNavigate();

  const modalOpen = () => setIsOpen(true);
  const modalClose = () => setIsOpen(false);

  useEffect(() => {
    if (userId) {
      fetchCategories();
    }
  }, [userId]);

  useEffect(() => {
    if (userEmail) {
      axios
        .get(`http://localhost:5001/api/get-user-grade/${userEmail}`)
        .then((response) => {
          setGrade(response.data.grade);
        })
        .catch((error) => {
          console.error("사용자 등급 조회 오류:", error);
        });
    }
  }, [userEmail]);

  const fetchCategories = () => {
    axios
      .get(`http://localhost:5001/api/get-categories/${userId}`)
      .then((response) => {
        setCategoryList(
          response.data.map((category) => ({
            id: category.id,
            name: category.name,
          }))
        );
      })
      .catch((error) => {
        console.error("카테고리 조회 오류:", error);
      });
  };

  const handleSubscribeClick = () => {
    navigate(`/subscribe?email=${encodeURIComponent(userEmail)}`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("userId"); 
    navigate("/login");
  };

  const editCategory = (categoryId, newName) => {
    axios
      .put(`http://localhost:5001/api/update-category/${categoryId}`, {
        name: newName,
      })
      .then(() => {
        setCategoryList((prevList) =>
          prevList.map((category) =>
            category.id === categoryId
              ? { ...category, name: newName }
              : category
          )
        );
        setIsOpen(false);
      })
      .catch((error) => {
        console.error("카테고리 수정 오류:", error);
      });
  };

  const handleCategoryClick = async (id) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("User ID가 localStorage에 저장되어 있지 않습니다.");

      const response = await axios.post(
        "http://localhost:5001/api/check-url",
        { categoryId: id },
        { headers: { "user-id": userId } }
      );

      if (response.data.match) {
        onMatchedUrls(response.data.urls);
      } else {
        onMatchedUrls([]);
      }
      setSelectedCategoryId(id);
    } catch (error) {
      console.error("서버 요청 오류:", error);
    }
  };

  const deleteCategory = (categoryId) => {
    axios
      .delete(`http://localhost:5001/api/delete-category/${categoryId}`)
      .then(() => {
        setCategoryList((prevList) =>
          prevList.filter((category) => category.id !== categoryId)
        );
      })
      .catch((error) => {
        console.error("카테고리 삭제 오류:", error);
      });
  };

  return (
    <div className="category-container">
      <img src={websiteLogo} alt="웹사이트 로고" className="webSite-logo" />
      <hr className="divider" /> 
      
      <div className="input-container">
        <CiSearch className="search-icon" />
        <input type="text" placeholder="카테고리를 입력하세요" />
      </div>
      
      <div className="button-container">
        <button className="add-button" onClick={modalOpen}>+ 추가하기</button>
      </div>
      
      <ConfirmCategory 
        categoryList={categoryList}
        selectedCategoryId={selectedCategoryId}
        onCategoryClick={handleCategoryClick}
        onDeleteCategory={deleteCategory}
        onEditCategory={editCategory}
        isOpen={isOpen}
        modalClose={modalClose}
        userId={userId}
        grade={grade}
      />

      <hr className="profile-divider" />
      <div className="footer-header">
        <p className="profile-title">Profile</p>
        <button 
          onClick={handleSubscribeClick} 
          className="subscribe-btn">멤버십 구독</button>
      </div>
      <div className="category_footer">
        <img src={userProfileImage} alt="사용자 프로필" className="profile-picture" />
        <div className="user-info">
          <p className="user-name">
            {userName}
            {grade === "PRO" && <FaCrown className="crown-icon" />}
            {grade === "STANDARD" && <FaRegStar className="standard-icon" />}
            {grade === "BASIC" && <FaRegStar className="basic-icon" />}
          </p>
          <p className="user-email">{userEmail}</p>
        </div>
      </div>
      
      <button onClick={handleLogout} className="logout-btn">
        <TbLogout2 /> 로그아웃
      </button>
    </div>
  );
}

export default Category;
