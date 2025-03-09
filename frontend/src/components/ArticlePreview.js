// src/components/ArticlePreview.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ArticlePreview.css';

const ArticlePreview = ({ article }) => {
  console.log("Article data in preview:", article);
  
  // Check if article exists
  if (!article) {
    return <div className="article-preview article-preview-error">Article data missing</div>;
  }
  
  // Handle contributor data with safety checks
  let authorName = 'Sacred Spiral Studios';
  
  // Check if contributor exists
  if (article.contributor) {
    authorName = article.contributor.name || 'Sacred Spiral Studios';
  } else if (article.author) {
    // Fallback to author field if it exists
    authorName = article.author;
  }
  
  // Extract collection or genre info
  let categoryName = '';
  if (article.collection) {
    categoryName = article.collection.title || '';
  } else if (article.genre) {
    // Fallback to the old genre field
    categoryName = article.genre;
  }
  
  // Get the image URL
  let fullImageUrl = null;
  if (article.image && article.image.url) {
    fullImageUrl = `${process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337'}${article.image.url}`;
  }
  
  return (
    <div className="article-preview">
      <Link to={`/articles/${article.slug}`}>
        <div className="article-preview__content">
          <h3>{article.title}</h3>
          {categoryName && <span className="article-preview__genre">{categoryName}</span>}
          <p>by {authorName}</p>
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