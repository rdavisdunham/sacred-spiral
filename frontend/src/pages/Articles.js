// src/pages/Articles.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ArticlePreview from '../components/ArticlePreview';
import '../styles/Articles.css';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { genre } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const strapiUrl = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';
        
        // Prepare filter for specific genre if provided
        let filterParam = '';
        if (genre) {
          filterParam = `&filters[collection][slug][$eq]=${genre}`;
        }
        
        // Fetch articles with populated relationships
        const response = await fetch(
          `${strapiUrl}/api/articles?populate=*&sort[0]=publishedAt:desc${filterParam}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonData = await response.json();
        console.log("Articles data:", jsonData);
        
        // Store the articles data
        setArticles(jsonData.data || []);
        
        // Fetch all collections
        const collectionsResponse = await fetch(`${strapiUrl}/api/collections`);
        
        if (!collectionsResponse.ok) {
          throw new Error(`HTTP error! status: ${collectionsResponse.status}`);
        }
        
        const collectionsData = await collectionsResponse.json();
        setCollections(collectionsData.data || []);
        
      } catch (error) {
        console.error("Error fetching articles:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [genre]);

  const handleCollectionChange = (e) => {
    const selectedGenre = e.target.value;
    if (selectedGenre === 'all') {
      navigate('/articles');
    } else {
      navigate(`/articles/genre/${selectedGenre}`);
    }
  };

  // Find current collection name if genre is selected
  const getCurrentCollectionName = () => {
    if (!genre) return 'All Articles';
    
    const currentCollection = collections.find(
      c => c.slug === genre
    );
    
    return currentCollection ? currentCollection.title : 'Articles';
  };

  if (loading) {
    return <div className="articles-loading">Loading articles...</div>;
  }

  if (error) {
    return <div className="articles-error">Error: {error.message}</div>;
  }

  return (
    <div className="articles-page">
      <h1>{getCurrentCollectionName()}</h1>
      
      <div className="articles-filter">
        <label htmlFor="collection-filter">Filter by Collection:</label>
        <select 
          id="collection-filter" 
          value={genre || 'all'}
          onChange={handleCollectionChange}
        >
          <option value="all">All Articles</option>
          {collections.map(collection => (
            <option 
              key={collection.id} 
              value={collection.slug}
            >
              {collection.title}
            </option>
          ))}
        </select>
      </div>
      
      {articles.length > 0 ? (
        <div className="articles-grid">
          {articles.map(article => (
            <ArticlePreview 
              key={article.id} 
              article={article} 
            />
          ))}
        </div>
      ) : (
        <div className="no-articles">
          <p>No articles found in this collection. Check back later or view another collection.</p>
        </div>
      )}
    </div>
  );
};

export default Articles;