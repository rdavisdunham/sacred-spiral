// src/pages/Article.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Template1 from '../components/templates/Template1';
import Template2 from '../components/templates/Template2';
import DefaultTemplate from '../components/templates/DefaultTemplate';
import '../styles/Article.css'

const Article = () => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { slug } = useParams(); // Get the article slug from the URL

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const strapiUrl = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';
        const response = await fetch(`${strapiUrl}/api/articles?filters[slug][<span class="math-inline">eq\]\=</span>{slug}&populate=*`); // Fetch by slug

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonData = await response.json();
        if (jsonData.data.length === 0) {
          throw new Error('Article not found'); // Handle case where slug doesn't match
        }
        setArticle(jsonData.data[0]); // Get the first (and only) article
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]); // Dependency array: re-fetch when 'slug' changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!article) {
    return <div>Article not found.</div>;
  }

  const { attributes } = article;

  // Dynamically select the template component
    let TemplateComponent;
    switch (article.template) {
        case 'template1':
        TemplateComponent = Template1;
        break;
        case 'template2':
        TemplateComponent = Template2;
        break;
        // Add more cases as you create more templates
        default:
        TemplateComponent = DefaultTemplate;
    }

  return (
    <div className="article">
      <TemplateComponent article={article} />
    </div>
  );
};

export default Article;