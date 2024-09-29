import React, { useState, useEffect } from 'react';
import '../style/PostCard.css';
import Share from './Share';
import { BiTrash } from 'react-icons/bi';
import Swal from 'sweetalert2';
import axios from 'axios';
import LoadingScreen from './LoadingScreen'; // LoadingScreen 컴포넌트 import

const getOGImage = async (url) => {
  try {
    const response = await fetch(
      `http://localhost:5001/api/og-image?url=${encodeURIComponent(url)}`
    );
    const data = await response.json();
    return data.ogImage;
  } catch (error) {
    console.error('Error fetching OG image:', error);
    return null;
  }
};

// 날짜를 포맷팅하는 유틸리티 함수
const formatDate = (dateString) => {
  if (!dateString) {
    return '날짜 없음'; // 기본값 설정
  }

  // ISO 형식의 문자열을 Date 객체로 변환
  const date = new Date(dateString);
  if (isNaN(date)) {
    return '유효하지 않은 날짜'; // 유효하지 않은 날짜 처리
  }

  // 날짜 포맷 옵션 설정
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
};

function PostCard({ urls, setUrls, onMatchedUrls }) {
  const defaultImage = './src/assets/images/postLogo.png';
  const [ogImages, setOgImages] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOGImages = async () => {
      setIsLoading(true);
      const images = {};
      const promises = urls.map(async (urlObject) => {
        console.log('Created At:', urlObject.createdAt);
        const ogImage = await getOGImage(urlObject.url);
        images[urlObject.url] = ogImage || defaultImage;
      });
      await Promise.all(promises);
      setOgImages(images);
      setIsLoading(false);
      console.log(urls);
    };

    fetchOGImages();
  }, [urls]);

  const handleDeleteClick = async (index) => {
    const { id, user_id } = urls[index];
    const userId = localStorage.getItem('userId'); // 로컬 스토리지에서 userId 가져오기

    const result = await Swal.fire({
      title: '삭제 확인',
      text: '저장된 URL을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
    });

    if (result.isConfirmed) {
      if (userId === user_id) {
        try {
          await axios.delete(`http://localhost:5001/api/urls/${id}`);
          const updatedUrls = urls.filter((_, idx) => idx !== index);
          onMatchedUrls(updatedUrls);

          Swal.fire({
            icon: 'success',
            title: '삭제 완료',
            text: 'URL이 성공적으로 삭제되었습니다.',
          });
        } catch (error) {
          console.error('Error deleting URL:', error);
          Swal.fire({
            icon: 'error',
            title: '삭제 실패',
            text: 'URL 삭제 중 오류가 발생했습니다.',
          });
        }
      } else {
        Swal.fire({
          icon: 'warning',
          title: '권한 없음',
          text: '이 URL을 삭제할 수 있는 권한이 없습니다.',
        });
      }
    }
  };

  // 로딩 중일 때 LoadingScreen 컴포넌트를 반환
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div
      className="post-card-container"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => e.preventDefault()} // 상위 컴포넌트에서 처리하도록 함
    >
      {' '}
      {urls.length > 0 ? (
        urls.map((urlObject, index) => (
          <div key={urlObject.id || index} className="post-card">
            <a
              href={urlObject.url}
              target="_blank"
              rel="noopener noreferrer"
              className="post-card-link"
            >
              <img
                src={ogImages[urlObject.url]}
                alt="Website OG Image"
                className="post-card-image"
                onError={(e) => {
                  e.target.src = defaultImage;
                }}
              />
              <div className="post-card-content">
                <h2 className="post-card-title">
                  {urlObject.title || 'No Title'}
                </h2>
              </div>
            </a>
            <div className="icon-container">
              <Share url={urlObject.url} />
              <BiTrash
                className="delete-btn"
                onClick={() => handleDeleteClick(index)}
              />

              <p className="post-card-date">
                {formatDate(urlObject.created_at)}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p>No URLs available</p>
      )}
    </div>
  );
}

export default PostCard;
