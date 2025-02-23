import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  const [navigation, setNavigation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNavigation = async () => {
      try {
        const strapiUrl = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';
        // Correct and comprehensive population:
        const response = await fetch(`${strapiUrl}/api/navigation?populate[NavItem][populate]=*`);
        // const response = await fetch(`${strapiUrl}/api/navigation?populate[NavItem][populate][0]=article&populate[NavItem][populate][1]=url&populate[NavItem][populate][2]=title&populate[NavItem][populate][3]=NavItem.article.slug`); //Supposed to be explicit population command; No Work
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonData = await response.json();

        // Check for data and handle potential errors
        if (jsonData.data) {
          setNavigation(jsonData.data);
        } else {
          console.error("Navigation data is missing:", jsonData);
          setError(new Error("Navigation data is missing."));
        }
      } catch (error) {
        console.error("Error fetching navigation:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNavigation();
  }, []);

  if (loading) {
    return <div className="header">Loading navigation...</div>;
  }

  if (error) {
    return <div className="header">Error: {error.message}</div>;
  }

  if (!navigation) {
    return <div className="header">No navigation data found.</div>;
  }
  // No need to check for .attributes here

  return (
    <header className="header">
      <nav>
        <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/articles">All Articles</a></li>
        {navigation.NavItem && Array.isArray(navigation.NavItem) && navigation.NavItem.map((item) => (
            <li key={item.id}>
                {/* Use the related article's slug for the URL */}
                <Link to={item.type === 'article' && item.article ? `/articles/${item.article.slug}` : item.url || '#'}>
                {/* <Link to="/articles/test-static-slug"> */}
                    {item.title}
                </Link>
            </li>
        ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;