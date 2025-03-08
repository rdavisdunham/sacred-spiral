// src/pages/Article.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Template1 from '../components/templates/Template1';
import Template2 from '../components/templates/Template2';
import DefaultTemplate from '../components/templates/DefaultTemplate';
import '../styles/Article.css'

const Article = () => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { slug } = useParams(); // Get the article slug from the URL
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Article.js useEffect triggered, slug:", slug);
    const fetchArticle = async () => {
      try {
        const strapiUrl = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';
        
        // Use Strapi v5 filter syntax and populate image and contributor
        const apiUrl = `${strapiUrl}/api/articles?filters[slug][$eq]=${slug}&populate[0]=image&populate[1]=contributor`;
        
        console.log("Fetching Article from URL:", apiUrl);
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonData = await response.json();
        console.log("Article data:", jsonData);
        
        if (!jsonData.data || jsonData.data.length === 0) {
          throw new Error('Article not found');
        }
        
        // Get the first article (should be the only one matching this slug)
        setArticle(jsonData.data[0]);
      } catch (error) {
        console.error("Error fetching article:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  // Handle loading state
  if (loading) {
    return (
      <div className="article-loading">
        <div className="spinner"></div>
        <p>Loading article...</p>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="article-error">
        <h2>Error Loading Article</h2>
        <p>{error.message}</p>
        <button onClick={() => navigate('/articles')}>
          Return to Articles
        </button>
      </div>
    );
  }

  // Handle article not found
  if (!article) {
    return (
      <div className="article-not-found">
        <h2>Article Not Found</h2>
        <p>Sorry, we couldn't find the article you're looking for.</p>
        <button onClick={() => navigate('/articles')}>
          Browse All Articles
        </button>
      </div>
    );
  }

  // Prepare author information from contributor relation
  let authorName = 'Sacred Spiral Studios';
  
  if (article.contributor) {
    // Direct contributor reference in Strapi v5
    authorName = article.contributor.name || 'Sacred Spiral Studios';
  } else if (article.author) {
    // Fallback to author field if it exists
    authorName = article.author;
  }

  // Prepare formatted article data for the template
  const formattedArticle = {
    ...article,
    author: authorName
  };

  // Dynamically select the template component
  let TemplateComponent;
  // If template is undefined, null, empty string, or not a recognized value, use DefaultTemplate
  if (!article.template) {
    TemplateComponent = DefaultTemplate;
  } else {
    switch (article.template) {
      case 'template1':
        TemplateComponent = Template1;
        break;
      case 'template2':
        TemplateComponent = Template2;
        break;
      default:
        console.log(`Template "${article.template}" not found, using DefaultTemplate`);
        TemplateComponent = DefaultTemplate;
    }
  }

  return (
    <div className="article">
      <TemplateComponent article={formattedArticle} />
    </div>
  );
};

export default Article;