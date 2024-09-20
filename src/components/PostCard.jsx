import React from 'react';
import '../style/PostCard.css'; 
import Share from './Share';

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
            {/*공유 버튼 부분*/}
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
