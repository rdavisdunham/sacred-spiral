// src/components/templates/DefaultTemplate.js
import React from 'react'
import '../../styles/templates/DefaultTemplate.css'

const DefaultTemplate = ({article}) => {
    const imageUrl = article.image?.url;
    const fullImageUrl = imageUrl ? `${process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337'}${imageUrl}` : null;

  return (
    <div>
        <h1>{article.title}</h1>
        <h2>By {article.author}</h2>
        {fullImageUrl && <img src={fullImageUrl} alt={article.title} />}
        <div dangerouslySetInnerHTML={{__html: article.content}}></div>
    </div>
  )
}

export default DefaultTemplate