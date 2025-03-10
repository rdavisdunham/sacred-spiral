// src/pages/Contributor.js
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../styles/TeamMember.css'; // Reusing the TeamMember styles

const Contributor = () => {
  const [contributor, setContributor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { slug } = useParams(); // Get the contributor slug from URL
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContributor = async () => {
      try {
        const strapiUrl = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';
        
        // Fetch contributor by slug
        const response = await fetch(
          `${strapiUrl}/api/contributors?filters[slug][$eq]=${slug}&populate=*`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonData = await response.json();
        console.log("Contributor data:", jsonData);
        
        if (!jsonData.data || jsonData.data.length === 0) {
          throw new Error('Contributor not found');
        }
        
        // Get the first contributor matching this slug
        setContributor(jsonData.data[0]);
      } catch (error) {
        console.error("Error fetching contributor:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchContributor();
    } else {
      setError(new Error('No contributor slug provided'));
      setLoading(false);
    }
  }, [slug]);

  // Handle loading state
  if (loading) {
    return (
      <div className="team-member-page">
        <div className="container">
          <div className="back-link">
            <Link to="/about">&larr; Back to About</Link>
          </div>
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <h2>Loading contributor profile...</h2>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="team-member-page">
        <div className="container">
          <div className="back-link">
            <Link to="/about">&larr; Back to About</Link>
          </div>
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <h2>Error Loading Contributor</h2>
            <p>{error.message}</p>
            <button onClick={() => navigate('/about')}>
              Return to About Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle contributor not found
  if (!contributor) {
    return (
      <div className="team-member-page">
        <div className="container">
          <div className="back-link">
            <Link to="/about">&larr; Back to About</Link>
          </div>
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <h2>Contributor Not Found</h2>
            <p>Sorry, we couldn't find the contributor you're looking for.</p>
            <button onClick={() => navigate('/about')}>
              Return to About Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Format content blocks for bio
  const renderContent = (content) => {
    if (!content || !Array.isArray(content)) {
      return <p>No biography available.</p>;
    }

    return content.map((block, blockIndex) => {
      // Handle paragraph blocks
      if (block.type === 'paragraph') {
        return (
          <p key={blockIndex}>
            {block.children.map((child, childIndex) => {
              // Handle text with formatting
              if (child.type === 'text') {
                let textContent = child.text;
                
                // Apply text formatting
                if (child.bold) {
                  textContent = <strong key={childIndex}>{textContent}</strong>;
                }
                if (child.italic) {
                  textContent = <em key={childIndex}>{textContent}</em>;
                }
                if (child.underline) {
                  textContent = <u key={childIndex}>{textContent}</u>;
                }
                
                return textContent;
              }
              
              // Handle links
              if (child.type === 'link') {
                return (
                  <a 
                    key={childIndex} 
                    href={child.url}
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {child.children.map((linkChild, i) => linkChild.text)}
                  </a>
                );
              }
              
              return null;
            })}
          </p>
        );
      }
      
      // Handle other block types if needed
      return null;
    });
  };

  return (
    <div className="team-member-page">
      <div className="container">
        <div className="back-link">
          <Link to="/about">&larr; Back to About</Link>
        </div>
        
        <div className="team-member-profile">
          <div className="team-member-header">
            <div className="team-member-image">
              {contributor.avatar && contributor.avatar.url ? (
                <img 
                  src={`${process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337'}${contributor.avatar.url}`} 
                  alt={contributor.name} 
                />
              ) : (
                <div className="avatar-placeholder">{contributor.name.charAt(0)}</div>
              )}
            </div>
            
            <div className="team-member-info">
              <h1>{contributor.name}</h1>
              <p className="team-member-role">{contributor.role || 'Contributor'}</p>
            </div>
          </div>
          
          <div className="team-member-bio">
            <h2>Biography</h2>
            {contributor.bio ? (
              <div className="bio-content">
                {renderContent(contributor.bio)}
              </div>
            ) : (
              <p>No biography available for this contributor.</p>
            )}
            
            {/* Add additional sections if you have more contributor data to display */}
            
            {/* Social links if available */}
            {(contributor.website || contributor.twitter || contributor.instagram) && (
              <>
                <h2>Connect</h2>
                <div className="social-links">
                  {contributor.website && (
                    <a href={contributor.website} target="_blank" rel="noopener noreferrer">
                      Website
                    </a>
                  )}
                  {contributor.twitter && (
                    <a href={contributor.twitter} target="_blank" rel="noopener noreferrer">
                      Twitter
                    </a>
                  )}
                  {contributor.instagram && (
                    <a href={contributor.instagram} target="_blank" rel="noopener noreferrer">
                      Instagram
                    </a>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contributor;