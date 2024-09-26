import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "../style/Main.css";
import Category from "./Category";
import AddUrlModal from "./AddUrlModal";
import axios from "axios";
import PostCard from "./PostCard";

function Main({ setIsLoggedIn }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [matchedUrls, setMatchedUrls] = useState([]);
  const [urls, setUrls] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
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
    try {
      // URL 저장 요청
      const response = await axios.post(
        "http://localhost:5001/api/save-url",
        urlData
      );
      if (response.data) {
        // URL 저장 후 카테고리 재조회
        await fetchCategories(); // 새로 고침
        // 저장된 URL도 matchedUrls에 추가
        setMatchedUrls((prev) => [...prev, response.data]);
      }
    } catch (error) {
      console.error("URL 저장 오류:", error);
    }
  };

  const handleMatchedUrls = (urls) => {
    setMatchedUrls(urls);
  };

  const filteredUrls = matchedUrls.filter((urlObject) => {
    const matchesCategory = selectedCategory
      ? urlObject.category === selectedCategory
      : true;
    const matchesTitle = urlObject.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesTitle;
  });

  return (
    <div className="container">
      <div>
      <Category
        setIsLoggedIn={setIsLoggedIn}
        onMatchedUrls={handleMatchedUrls}
        onSelectCategory={setSelectedCategory}
      />
      </div>
      <div className="main-content">
      <div className="search-bar">
  <div className="input-container">
    <FontAwesomeIcon icon={faSearch} className="search-icon" />
    <input
      type="text"
      placeholder="찾고 싶은 url 제목을 입력하세요"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="search-input"
    />
  </div>
</div>

        <PostCard
          urls={filteredUrls}
          setUrls={setUrls}
          onMatchedUrls={handleMatchedUrls}
        />
      </div>

      <button
        className="addUrl-floating-button"
        onClick={() => setModalOpen(true)}
      >
        <FontAwesomeIcon icon={faPlusCircle} size="2x" />
      </button>

      {isModalOpen && (
        <AddUrlModal
          onClose={() => setModalOpen(false)}
          onSave={handleSaveUrl}
          categories={categories}
          onMatchedUrls={handleMatchedUrls}
        />
      )}
    </div>
  );
}

export default Main;
