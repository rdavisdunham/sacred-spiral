import React, { useState, useEffect } from 'react';
import ArticlePreview from './ArticlePreview';
import '../styles/ArticleSection.css';
import { Link } from 'react-router-dom';

const ArticleSection = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const strapiUrl = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';
        const response = await fetch(`${strapiUrl}/api/articles?populate=*`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonData = await response.json();
          console.log("Raw API Response (Articles):", jsonData)
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
    <section className="article-section">
      <h2>Monthly Articles</h2>
      <p>Keep up to date on current music happenings in Atticus Deeny's 'Music Op' and get a fresh perspective on a world of literature in Nic Miller's 'Literature Review'.</p>
      <div className="articles-container">
        {articles.map((article) => ( //Iterate through the array
          <ArticlePreview key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
};

export default ArticleSection;