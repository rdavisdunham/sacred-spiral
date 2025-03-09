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
        
        // Get date from one month ago for filtering
        const today = new Date();
        const oneMonthAgo = new Date(today);
        oneMonthAgo.setMonth(today.getMonth() - 1);
        const oneMonthAgoISO = oneMonthAgo.toISOString();
        
        // Create the filters parameter for articles published in the last month
        const dateFilter = `filters[publishedAt][$gte]=${oneMonthAgoISO}`;
        
        // Build the complete URL with filtering, population, and sorting
        const apiUrl = `${strapiUrl}/api/articles?${dateFilter}&populate[0]=image&populate[1]=contributor&sort[0]=publishedAt:desc&pagination[limit]=3`;
        
        console.log("Fetching recent articles from:", apiUrl);
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonData = await response.json();
        console.log("Recent Articles API Response:", jsonData);
        
        // In Strapi v5, the data is directly available in jsonData.data
        setArticles(jsonData.data);
      } catch (error) {
        console.error("Error fetching recent articles:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return <div className="article-section loading">Loading recent articles...</div>;
  }

  if (error) {
    return <div className="article-section error">Error: {error.message}</div>;
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="article-section empty">
        <h2>Monthly Articles</h2>
        <p>No recent articles found. Check back soon for new content!</p>
        <div className="view-all-articles">
          <Link to="/articles">Browse All Articles</Link>
        </div>
      </div>
    );
  }

  return (
    <section className="article-section">
      <h2>Monthly Articles</h2>
      <p>Browse our most recent articles published in the past month. Keep up to date on current music happenings and get fresh perspectives on art and literature.</p>
      <div className="articles-container">
        {articles.map((article) => (
          <ArticlePreview key={article.id} article={article} />
        ))}
      </div>
      <div className="view-all-articles">
        <Link to="/articles">View All Articles</Link>
      </div>
    </section>
  );
};

export default ArticleSection;