import React, { useState, useEffect } from 'react';
import '../style/PostCard.css';
import Share from './Share';

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

function PostCard({ urls }) {
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
          <div key={index} className="post-card">
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
            <Share url={urlObject.url} />
          </div>
        ))
      ) : (
        <p>No URLs available</p>
      )}
    </div>
  );
}

export default PostCard;
