// src/components/templates/Template1.js
import React from 'react';
import '../../styles/templates/Template1.css'
const Template1 = ({ article }) => {
  const imageUrl = article.image?.url; // Access directly, with optional chaining
  const fullImageUrl = imageUrl ? `${process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337'}${imageUrl}` : null; // Set to null if no URL
  return (
    <div className="template1">
      <h1>{article.title}</h1>
      <p>By {article.author}</p>
      {fullImageUrl && <img src={fullImageUrl} alt={article.title} />}
      <div dangerouslySetInnerHTML={{ __html: article.content }} />
    </div>
  );
};

export default Template1;