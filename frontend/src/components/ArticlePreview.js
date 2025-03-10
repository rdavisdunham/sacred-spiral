// src/components/ArticlePreview.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ArticlePreview.css';

const ArticlePreview = ({ article, className = '' }) => {
  console.log("Article data in preview:", article);
  
  // Check if article exists
  if (!article) {
    return <div className="article-preview article-preview-error">Article data missing</div>;
  }
  
  // Support both Strapi v5 flat structure and legacy nested attributes structure
  // This ensures we handle both data formats
  const articleData = article.attributes ? article.attributes : article;
  
  // Make sure we have the required data
  if (!articleData || !articleData.title || !articleData.slug) {
    console.error("Invalid article data format:", articleData);
    return <div className="article-preview article-preview-error">Invalid article format</div>;
  }
  
  // Handle contributor data with safety checks
  let authorName = 'Sacred Spiral Studios';
  
  // Check if contributor exists
  if (articleData.contributor) {
    // Handle both flat and nested contributor data
    if (articleData.contributor.data) {
      // Nested (v4-style) structure
      const contributorAttrs = articleData.contributor.data.attributes;
      authorName = contributorAttrs?.name || 'Sacred Spiral Studios';
    } else {
      // Flat (v5-style) structure
      authorName = articleData.contributor.name || 'Sacred Spiral Studios';
    }
  } else if (articleData.author) {
    // Fallback to author field if it exists
    authorName = articleData.author;
  }
  
  // Extract collection or genre info
  let categoryName = '';
  if (articleData.collection) {
    // Handle both flat and nested collection data
    if (articleData.collection.data) {
      // Nested structure
      categoryName = articleData.collection.data.attributes?.title || '';
    } else {
      // Flat structure
      categoryName = articleData.collection.title || '';
    }
  } else if (articleData.genre) {
    // Fallback to the old genre field
    categoryName = articleData.genre;
  }
  
  // Get the image URL
  let fullImageUrl = null;
  if (articleData.image) {
    // Handle nested structure
    if (articleData.image.data) {
      const imageUrl = articleData.image.data.attributes?.url;
      if (imageUrl) {
        fullImageUrl = `${process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337'}${imageUrl}`;
      }
    } 
    // Handle flat structure
    else if (articleData.image.url) {
      fullImageUrl = `${process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337'}${articleData.image.url}`;
    }
  }
  
  return (
    <div className={`article-preview ${className}`}>
      <Link to={`/articles/${articleData.slug}`}>
        <div className="article-preview__content">
          <h3>{articleData.title}</h3>
          {categoryName && <span className="article-preview__genre">{categoryName}</span>}
          <p>by {authorName}</p>
        </div>
        {fullImageUrl && (
          <img 
            className="article-preview__image"
            src={fullImageUrl} 
            alt={articleData.title} 
          />
        )}
      </Link>
    </div>
  );
};

export default ArticlePreview;