import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faArrowUp, faSearch } from "@fortawesome/free-solid-svg-icons";
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
  const [sortOrder, setSortOrder] = useState('oldest'); 
  const navigate = useNavigate();
  const searchRef = useRef(null);

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
      const response = await axios.post(
        "http://localhost:5001/api/save-url",
        urlData
      );
      if (response.data) {
        const newUrl = { ...response.data, created_at: new Date() };
        setMatchedUrls((prev) => [newUrl, ...prev]); 
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

  const sortedUrls = [...filteredUrls].sort((a, b) => {
    return sortOrder === 'latest'
      ? new Date(b.created_at) - new Date(a.created_at)
      : new Date(a.created_at) - new Date(b.created_at);
  });

  const scrollToTop = () => {
    if (searchRef.current) {
      searchRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

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
        <div className="main-search-bar" ref={searchRef}>
          {/* ref를 검색 바에 추가 */}
          <div className="main-input-container">
            <input
              type="text"
              placeholder="찾고 싶은 url 제목을 입력하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="main-search-input"
            />
            <button className='main-search-icon-box'>
              <FontAwesomeIcon icon={faSearch} className="main-search-icon" />
            </button>
            <button
              className={`main-sort-order sort-oldest ${sortOrder === 'oldest' ? 'active' : ''}`}
              onClick={() => setSortOrder('oldest')}
            >
              오래된 순
            </button>
            <span className="sort-divider">|</span>
            <button
              className={`main-sort-order sort-latest ${sortOrder === 'latest' ? 'active' : ''}`}
              onClick={() => setSortOrder('latest')}
            >
              최신순
            </button>
          </div>
        </div>
        <PostCard
          urls={sortedUrls}
          setUrls={setUrls}
          onMatchedUrls={handleMatchedUrls}
        />
      </div>

      <div className="floating-buttons">
        <button
          className="addUrl-floating-button"
          onClick={() => setModalOpen(true)}
        >
          <FontAwesomeIcon icon={faPlus} size="2x" />
        </button>

        <button className="scrollUp-floating-button" onClick={scrollToTop}>
          <FontAwesomeIcon icon={faArrowUp} size="2x" />
        </button>
      </div>

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
