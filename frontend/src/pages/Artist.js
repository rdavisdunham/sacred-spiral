// frontend/src/pages/Artist.js
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../styles/Artist.css';

const Artist = () => {
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { slug } = useParams(); // Get slug parameter from URL
  const navigate = useNavigate();

  console.log("Artist component rendering with slug:", slug); // Debug log

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        console.log("Fetching artist with slug:", slug); // Debug log
        const strapiUrl = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';
        
        // Fetch artist by slug
        const response = await fetch(`${strapiUrl}/api/artists?filters[slug][$eq]=${slug}&populate=*`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonData = await response.json();
        console.log("Artist data received:", jsonData); // Debug log
        
        if (!jsonData.data || jsonData.data.length === 0) {
          throw new Error('Artist not found');
        }
        
        setArtist(jsonData.data[0]);
      } catch (error) {
        console.error("Error fetching artist:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArtist();
    } else {
      setError(new Error('No artist slug provided'));
      setLoading(false);
    }
  }, [slug]);

  // Loading state
  if (loading) {
    return (
      <div className="artist-loading">
        <h2>Loading artist information...</h2>
        <p>Looking up: {slug}</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="artist-error">
        <h2>Error</h2>
        <p>{error.message}</p>
        <button onClick={() => navigate('/artists')}>Back to Artists</button>
      </div>
    );
  }

  // If artist not found
  if (!artist) {
    return (
      <div className="artist-not-found">
        <h2>Artist Not Found</h2>
        <p>The artist "{slug}" doesn't exist or has been removed.</p>
        <button onClick={() => navigate('/artists')}>Back to Artists</button>
      </div>
    );
  }

  // Format publication date
  const publishDate = new Date(artist.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });

  return (
    <div className="artist-page">
      <h1 className="test-heading">Artist Detail Page</h1>
      
      <header className="artist-header">
        <h1>{artist.name || 'Artist'}</h1>
        <p className="artist-date">{publishDate}</p>
      </header>
      
      <div className="artist-profile">
        {artist.avatar && (
          <div className="artist-avatar">
            <img 
              src={`${process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337'}${artist.avatar.url}`}
              alt={artist.name || 'Artist'} 
            />
          </div>
        )}
        
        <div className="artist-gallery">
          {artist.images && artist.images.length > 0 ? (
            artist.images.map((image, index) => {
              // Get URL from the correct location based on data structure
              const imageUrl = image.url || (image.attributes?.url);
              
              if (!imageUrl) {
                console.error("Missing image URL in data:", image);
                return null;
              }
              
              return (
                <div key={index} className="gallery-item">
                  <img 
                    src={`${process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337'}${imageUrl}`}
                    alt={`${artist.name}'s work ${index + 1}`}
                    className="gallery-image"
                  />
                </div>
              );
            })
          ) : (
            <div className="no-images">No artwork images available</div>
          )}
        </div>
      </div>
      
      <div className="artist-content">
        {artist.content ? (
          <div className="artist-description">
            {/* Rich text content (blocks) handling */}
            {Array.isArray(artist.content) ? (
              <div>
                {artist.content.map((block, blockIndex) => {
                  // Render different block types (paragraphs, headers, etc.)
                  switch (block.type) {
                    case 'paragraph':
                      return (
                        <p key={blockIndex}>
                          {block.children.map((child, childIndex) => {
                            // Handle different text styling
                            if (child.type === 'text') {
                              let textContent = child.text;
                              
                              // Apply text styling
                              if (child.bold) {
                                textContent = <strong key={`text-${childIndex}`}>{textContent}</strong>;
                              }
                              if (child.italic) {
                                textContent = <em key={`text-${childIndex}`}>{textContent}</em>;
                              }
                              if (child.underline) {
                                textContent = <u key={`text-${childIndex}`}>{textContent}</u>;
                              }
                              if (child.strikethrough) {
                                textContent = <del key={`text-${childIndex}`}>{textContent}</del>;
                              }
                              if (child.code) {
                                textContent = <code key={`text-${childIndex}`}>{textContent}</code>;
                              }
                              
                              return textContent;
                            }
                            
                            // Handle links
                            if (child.type === 'link') {
                              return (
                                <a 
                                  key={`link-${childIndex}`}
                                  href={child.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {child.children.map((linkChild, linkChildIndex) => (
                                    <span key={`link-text-${linkChildIndex}`}>{linkChild.text}</span>
                                  ))}
                                </a>
                              );
                            }
                            
                            return null;
                          })}
                        </p>
                      );
                    // Add more cases for other block types as needed
                    default:
                      return null;
                  }
                })}
              </div>
            ) : (
              // Handle regular text content
              <div>
                {artist.content.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="no-content">No additional information available for this artist.</p>
        )}
      </div>
      
      <div className="artist-navigation">
        <Link to="/artists" className="back-link">
          ← Back to All Artists
        </Link>
      </div>
    </div>
  );
};

export default Artist;