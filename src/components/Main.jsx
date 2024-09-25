import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "../style/Main.css";
import Category from "./Category";
import AddUrlModal from "./AddUrlModal";
import axios from "axios";
import PostCard from "./PostCard";
import LeftSidebar from "./LeftSidebar";

function Main({ setIsLoggedIn }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false); 
  const [isModalOpen, setModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [matchedUrls, setMatchedUrls] = useState([]);
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

  const handleSaveUrl = (urlData) => {
    console.log("URL 데이터 저장:", urlData);
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
        <PostCard urls={matchedUrls} /> 
      </div>

      {/* 고정된 Add URL 버튼 */}
      <button
        className="addUrl-floating-button"
        onClick={() => setModalOpen(true)}
      >
        <FontAwesomeIcon icon={faPlusCircle} size="2x" />
      </button>

      {/* 왼쪽 사이드바 컴포넌트 추가함 */}
      <LeftSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {isModalOpen && (
        <AddUrlModal
          onClose={() => setModalOpen(false)}
          onSave={handleSaveUrl}
          categories={categories}
        />
      )}
    </div>
  );
}

export default Main;
