// src/components/ArticlePreview.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ArticlePreview.css';

const ArticlePreview = ({ article }) => {
  console.log("Article data in preview:", article);
  
  // Handle contributor data - in Strapi v5, the structure will depend on your content type setup
  let authorName = 'Sacred Spiral Studios';
  
  // Check if contributor exists and how it's structured
  if (article.contributor) {
    // Direct reference (not using .data in Strapi v5)
    authorName = article.contributor.name || 'Sacred Spiral Studios';
  } else if (article.author) {
    // Fallback to author field if it exists
    authorName = article.author;
  }
  
  // Extract genre if available
  const genre = article.genre || '';
  
  // Get the image URL directly from article.image
  const imageUrl = article.image?.url;
  const fullImageUrl = imageUrl
    ? `${process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337'}${imageUrl}`
    : null;
    
  return (
    <div className="article-preview">
      <Link to={`/articles/${article.slug}`}>
        <div className="article-preview__content">
          <h3>{article.title}</h3>
          {genre && <span className="article-preview__genre">{genre}</span>}
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