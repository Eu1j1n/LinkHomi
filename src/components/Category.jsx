import React, { useState, useEffect } from "react";
import axios from "axios";
import ConfirmCategory from "../components/ConfirmCategory";
import "../style/Category.css";
import { useNavigate } from "react-router-dom";
import { TbLogout2 } from "react-icons/tb";
import { FaCrown, FaRegStar } from "react-icons/fa";
import websiteLogo from "../assets/images/websiteLogo.png";

function Category({ setIsLoggedIn, onMatchedUrls }) {
  const [categoryList, setCategoryList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [grade, setGrade] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
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
        const categories = response.data.map((category) => ({
          id: category.id,
          name: category.name,
        }));
        setCategoryList(categories);
        setFilteredCategories(categories); // 기본적으로 모든 카테고리를 표시
      })
      .catch((error) => {
        console.error("카테고리 조회 오류:", error);
      });
  };

  // 검색어 입력에 따라 필터링된 카테고리 리스트 업데이트
  useEffect(() => {
    const filtered = categoryList.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categoryList]);

  const handleSubscribeClick = () => {
    navigate(`/subscribe?email=${encodeURIComponent(userEmail)}`);
  };

  const addCategory = (newCategory) => {
    fetchCategories();
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
      if (!userId)
        throw new Error("User ID가 localStorage에 저장되어 있지 않습니다.");

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
      <img
        src={websiteLogo}
        alt="웹사이트 로고"
        className="webSite-logo"
        onClick={() => window.location.reload()}
      />
      <hr className="divider" />
      <div className="input-container">
      <input
        type="text"
        className="category-input"
        placeholder="카테고리를 입력하세요"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      </div>
      <div className="button-container">
        <button className="add-button" onClick={modalOpen}>
          + 카테고리 추가
        </button>
      </div>
      <div className="confirm-category-container">
      <ConfirmCategory
        onMatchedUrls={onMatchedUrls}
        categoryList={filteredCategories}
        selectedCategoryId={selectedCategoryId}
        onCategoryClick={handleCategoryClick}
        onDeleteCategory={deleteCategory}
        onEditCategory={editCategory}
        isOpen={isOpen}
        addCategory={addCategory}
        modalClose={modalClose}
        userId={userId}
        grade={grade}
      />
      </div>
      <hr className="divider" />
      <div className="footer-header">
        <p className="profile-title">Profile</p>
        <button onClick={handleSubscribeClick} className="subscribe-btn">
          멤버십 구독
        </button>
      </div>
      <div className="category-footer">
        <img
          src={userProfileImage}
          alt="사용자 프로필"
          className="profile-picture"
        />
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
