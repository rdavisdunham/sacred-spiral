// src/pages/Articles.js
import React, { useState, useEffect } from 'react';
import ArticlePreview from '../components/ArticlePreview'; // Reuse the preview

const Articles = () => {
    const [articles, setArticles] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchArticles = async () => {
        try {
          const strapiUrl = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';
          const response = await fetch(`${strapiUrl}/api/articles?populate=*`); // Fetch articles

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const jsonData = await response.json();
          setArticles(jsonData.data);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      };

      fetchArticles();
    }, []);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error.message}</div>;
    }

      if (!articles) {
      return <div>No Articles data found.</div>;
    }
  return (
    <div>
      <h1>All Articles</h1>
      <div className="articles-container">
        {articles.map((article) => (
          <ArticlePreview key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};

export default Articles;