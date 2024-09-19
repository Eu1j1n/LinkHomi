import React from 'react';
import '../style/PostCard.css'; // 스타일 시트 임포트

function PostCard({ urls }) {
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
                src={urlObject.image || './src/assets/images/velog.png'}
                alt="Default Image"
                className="post-card-image"
              />
              <div className="post-card-content">
                <h2 className="post-card-title">
                  {urlObject.title || 'No Title'}
                </h2>
              </div>
            </a>
          </div>
        ))
      ) : (
        <p>No URLs available</p>
      )}
    </div>
  );
}

export default PostCard;
