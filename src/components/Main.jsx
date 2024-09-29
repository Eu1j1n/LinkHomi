import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faArrowUp, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import '../style/Main.css';
import Category from './Category';
import AddUrlModal from './AddUrlModal';
import axios from 'axios';
import PostCard from './PostCard';
import Swal from 'sweetalert2';

function Main({ setIsLoggedIn }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [matchedUrls, setMatchedUrls] = useState([]);
  const [urls, setUrls] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortOrder, setSortOrder] = useState('oldest');
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    console.log('선택된 카테고리 ID:', selectedCategoryId);
    // 여기에서 URL 추가와 관련된 로직을 추가할 수 있습니다.
    // 예를 들어, selectedCategoryId가 null이 아닐 때만 특정 작업 수행
    if (selectedCategoryId) {
      // URL을 추가하는 로직을 여기에 작성
    }
  }, [selectedCategoryId]); // selectedCategoryId가 변경될 때마다 실행

  //드래그
  const handleDrop = async (e) => {
    e.preventDefault();
    const urlString = e.dataTransfer.getData('text/plain');

    try {
      const data = JSON.parse(urlString);
      const title = data.title;
      const url = data.url;

      console.log(selectedCategoryId); // 새로운 state 사용

      if (!selectedCategoryId) {
        Swal.fire({
          title: '오류!',
          text: 'URL을 추가할 카테고리를 선택해주세요.',
          icon: 'error',
          confirmButtonText: '확인',
        });
        return;
      }

      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found in local storage.');
      }

      const response = await axios.post(
        'http://localhost:5001/api/add-url',
        {
          categoryId: selectedCategoryId, // 새로운 state 사용
          url: url,
          title: title,
        },
        {
          headers: { 'user-id': userId },
        }
      );

      const newUrl = {
        id: response.data.id,
        title,
        url,
        user_id: response.data.userId,
        created_at: response.data.created_at,
        category: selectedCategoryId, // 새로운 state 사용
      };

      setMatchedUrls((prevUrls) => [newUrl, ...prevUrls]);

      Swal.fire({
        title: '성공!',
        text: 'URL이 카테고리에 추가되었습니다.',
        icon: 'success',
        confirmButtonText: '확인',
      });
    } catch (error) {
      console.error('Error adding URL:', error);
      Swal.fire({
        title: '오류!',
        text: error.message || 'URL 추가에 실패했습니다.',
        icon: 'error',
        confirmButtonText: '확인',
      });
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:5001/api/get-categories/${userId}`
          );
          setCategories(response.data);
        } catch (error) {
          console.error('카테고리 조회 오류:', error);
        }
      }
    };
    fetchCategories();
  }, []);

  const handleSaveUrl = async (urlData) => {
    // console.log('URL 데이터 저장:', urlData);
    // try {
    //   const response = await axios.post(
    //     'http://localhost:5001/api/save-url',
    //     urlData
    //   );
    //   if (response.data) {
    //     const newUrl = { ...response.data, created_at: new Date() };
    //     setMatchedUrls((prev) => [newUrl, ...prev]);
    //   }
    // } catch (error) {
    //   console.error('URL 저장 오류:', error);
    // }
    //AddUrlModal 에서 처리하기 때문에 에러 생겨서 주석 처리해놓음
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
      searchRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="container">
      <div>
        <Category
          setIsLoggedIn={setIsLoggedIn}
          onMatchedUrls={handleMatchedUrls}
          onSelectCategory={setSelectedCategoryId} // 새로운 state로 전달
        />
      </div>
      <div
        className="main-content"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
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
            <button className="main-search-icon-box">
              <FontAwesomeIcon icon={faSearch} className="main-search-icon" />
            </button>
            <button
              className={`main-sort-order sort-oldest ${
                sortOrder === 'oldest' ? 'active' : ''
              }`}
              onClick={() => setSortOrder('oldest')}
            >
              오래된 순
            </button>
            <span className="sort-divider">|</span>
            <button
              className={`main-sort-order sort-latest ${
                sortOrder === 'latest' ? 'active' : ''
              }`}
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
