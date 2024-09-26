// Main.jsx
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "../style/Main.css";
import Category from "./Category";
import AddUrlModal from "./AddUrlModal";
import axios from "axios";
import PostCard from "./PostCard";

function Main({ setIsLoggedIn }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [matchedUrls, setMatchedUrls] = useState([]);
  const [urls, setUrls] = useState([]); // URLs 상태 정의
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

  const handleSaveUrl = async (urlData) => {
    console.log("URL 데이터 저장:", urlData);
    // URL 저장 후 카테고리를 다시 가져옵니다.
    await fetchCategories();
  };

  const handleMatchedUrls = (urls) => {
    setMatchedUrls(urls);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen); // 사이드바 열림/닫힘 토글
  };

  return (
    <div className="container">
      <Category
        setIsLoggedIn={setIsLoggedIn}
        onMatchedUrls={handleMatchedUrls}
      />
      <div className="main-content">
        <PostCard
          urls={matchedUrls}
          setUrls={setUrls}
          onMatchedUrls={handleMatchedUrls}
        />{" "}
        {/* setUrls를 전달 */}
      </div>

      {/* 고정된 Add URL 버튼 */}
      <button
        className="addUrl-floating-button"
        onClick={() => setModalOpen(true)}
      >
        <FontAwesomeIcon icon={faPlusCircle} size="2x" />
      </button>

      {isModalOpen && (
        <AddUrlModal
          onClose={() => setModalOpen(false)}
          onSave={handleSaveUrl} // URL 저장 후 카테고리 업데이트
          categories={categories}
        />
      )}

      {/* 고정된 Add URL 버튼 */}
      <button
        className="addUrl-floating-button"
        onClick={() => setModalOpen(true)} // 모달 열기
      >
        <FontAwesomeIcon icon={faPlusCircle} size="2x" />
      </button>
    </div>
  );
}

export default Main;
