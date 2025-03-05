// src/components/ArticlePreview.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ArticlePreview.css';

const ArticlePreview = ({ article }) => {
  // Get the image URL directly from article.attributes.image
  const imageUrl = article.image?.url;  // Access .url DIRECTLY
  const fullImageUrl = imageUrl
    ? `${process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337'}${imageUrl}`
    : null;

  return (
    <div className="article-preview">
      <Link to={`/articles/${article.slug}`}>
      <div className="article-preview__content">
        <h3>{article.title}</h3>
        <p>by {article.author}</p>
      </div>
      {fullImageUrl && (
        <img 
          className="article-preview__image"
          src={fullImageUrl} 
          alt={article.title} />
        )}
        
      </Link>
    </div>
  );
};

export default ArticlePreview;