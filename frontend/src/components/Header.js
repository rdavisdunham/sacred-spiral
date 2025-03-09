import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  const [navigation, setNavigation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchNavigation = async () => {
      try {
        const strapiUrl = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';
        // Fetch main navigation
        const response = await fetch(`${strapiUrl}/api/navigation?populate[NavItem][populate]=*`);
        
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

    const fetchCollections = async () => {
      try {
        const strapiUrl = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';
        const response = await fetch(`${strapiUrl}/api/collections`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonData = await response.json();
        console.log("Collections data:", jsonData);
        
        if (jsonData.data) {
          setCollections(jsonData.data);
        } else {
          console.log("No collections data found");
        }
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };

    fetchNavigation();
    fetchCollections();
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

  return (
    <header className="header">
      <nav>
        <ul className="nav-menu">
          <li>
            <Link to="/home">
              <img
                src="/spiral.png"
                alt="Sacred Spiral"
                className="navbar-logo"
              />
            </Link>
          </li>
          
          {/* Articles Dropdown - Show on hover */}
          <li className="dropdown">
            <Link to="/articles">ARTICLES</Link>
            <div className="dropdown-content">
              <Link to="/articles">ALL ARTICLES</Link>
              {collections && collections.length > 0 && collections.map((collection) => (
                <Link 
                  key={collection.id} 
                  to={`/articles/genre/${collection.slug}`}
                >
                  {collection.title.toUpperCase()}
                </Link>
              ))}
            </div>
          </li>
          
          <li><Link to="/artists">ARTISTS</Link></li>
          <li><Link to="/about">ABOUT</Link></li>
          <li><Link to="/contact">CONTACT</Link></li>
          <li><Link to="/archive">ARCHIVE</Link></li>
          
          {/* Dynamic Nav Items from Strapi */}
          {navigation.NavItem && Array.isArray(navigation.NavItem) && navigation.NavItem.map((item) => (
            <li key={item.id}>
              <Link to={item.type === 'article' && item.article ? `/articles/${item.article.slug}` : item.url || '#'}>
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