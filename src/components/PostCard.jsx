import React, { useState, useEffect } from 'react';
import '../style/PostCard.css';
import Share from './Share';
import { BiTrash } from 'react-icons/bi';
import Swal from 'sweetalert2';
import axios from 'axios';

// OG 이미지 URL을 가져오는 함수
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

function PostCard({ urls, setUrls, onMatchedUrls }) {
  const defaultImage = './src/assets/images/postLogo.png';
  const [ogImages, setOgImages] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOGImages = async () => {
      setIsLoading(true);
      const images = {};
      const promises = urls.map(async (urlObject) => {
        const ogImage = await getOGImage(urlObject.url);
        images[urlObject.url] = ogImage || defaultImage;
      });
      await Promise.all(promises);
      setOgImages(images);
      setIsLoading(false);
    };

    fetchOGImages();
  }, [urls]);

  // URL 삭제 처리
  const handleDeleteClick = async (index) => {
    const { id, user_id } = urls[index];
    const userId = localStorage.getItem('userId'); // 로컬 스토리지에서 userId 가져오기

    // 삭제 확인 알림
    const result = await Swal.fire({
      title: '삭제 확인',
      text: '저장된 URL을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
    });

    // 사용자가 삭제를 확인한 경우
    if (result.isConfirmed) {
      if (userId === user_id) {
        try {
          // DELETE 요청 보내기
          await axios.delete(`http://localhost:5001/api/urls/${id}`);

          // 성공적으로 삭제되면 matchedUrls 업데이트
          const updatedUrls = urls.filter((_, idx) => idx !== index);
          onMatchedUrls(updatedUrls); // 상태 업데이트로 리렌더링 유도

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

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading cards...</p>
      </div>
    );
  }

  return (
    <div className="post-card-container">
      {urls.length > 0 ? (
        urls.map((urlObject, index) => (
          <div key={urlObject.id} className="post-card">
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
                onClick={() => handleDeleteClick(index)} // Index를 전달
              />
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
