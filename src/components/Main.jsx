import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClockRotateLeft,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "../style/Main.css";
import Category from "./Category";
import AddUrlModal from "./AddUrlModal";
import axios from "axios";
import PostCard from "./PostCard";

function Main({ setIsLoggedIn }) {
  const [browsingHistory, setBrowsingHistory] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isRotated, setRotated] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [matchedUrls, setMatchedUrls] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:5001/api/get-categories/${userId}`
          );
          setCategories(response.data);
        } catch (error) {
          console.error("카테고리 조회 오류:", error);
        }
      }
    };
    fetchCategories();
  }, []);

  const handleSubscribeClick = () => {
    navigate("/subscribe");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
    setRotated(!isRotated);
  };

  const handleContentClick = () => {
    if (isSidebarOpen) {
      setSidebarOpen(false);
      setRotated(false);
    }
  };

  const handleSaveUrl = (urlData) => {
    console.log("URL 데이터 저장:", urlData);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  const handleMatchedUrls = (urls) => {
    setMatchedUrls(urls);
  };

  return (
    <div className="container">
      <Category
        setIsLoggedIn={setIsLoggedIn}
        onMatchedUrls={handleMatchedUrls}
      />

      <div className="main-content" onClick={handleContentClick}>
        <h1>Main</h1>
        <p>이곳은 메인 콘텐츠 영역입니다.</p>
        <PostCard urls={matchedUrls} />
      </div>

      {/* 고정된 Add URL 버튼 (사이드바 왼쪽) */}
      <button
        className="addUrl-floating-button"
        onClick={() => setModalOpen(true)}
      >
        <FontAwesomeIcon icon={faPlusCircle} size="2x" />
      </button>

      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <button className="toggle-button" onClick={toggleSidebar}>
          <FontAwesomeIcon
            icon={faClockRotateLeft}
            className={`icon ${isRotated ? "rotated" : ""}`}
          />
        </button>
        {isSidebarOpen && (
          <div className="sidebar-content">
            <p>여기에 사이드바 내용이 들어갑니다.</p>
          </div>
        )}
        {isModalOpen && (
          <AddUrlModal
            onClose={() => setModalOpen(false)}
            onSave={handleSaveUrl}
            categories={categories}
          />
        )}
      </div>
    </div>
  );
}

export default Main;
