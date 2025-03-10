// frontend/src/pages/Artists.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Artists.css';

const Artists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'current', or 'archived'

  useEffect(() => {
    console.log("Artists index component mounting"); // Debug log
    
    const fetchAllArtists = async () => {
      try {
        const strapiUrl = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';
        
        // Fetch all Artists entries, sorted by publishedAt
        const response = await fetch(
          `${strapiUrl}/api/artists?populate=avatar&sort[0]=publishedAt:desc`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonData = await response.json();
        console.log("All artists data:", jsonData);
        
        if (!jsonData.data) {
          throw new Error('Failed to fetch artists');
        }
        
        setArtists(jsonData.data);
      } catch (error) {
        console.error("Error fetching all artists:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllArtists();
  }, []);

  // Filter the artists based on current filter state
  const filteredArtists = artists.filter(artist => {
    if (filter === 'all') return true;
    // Add custom filters based on your needs
    // For example, you might filter by genre or other criteria
    return true;
  });

  // Loading state
  if (loading) {
    return <div className="artists-loading">Loading featured artists...</div>;
  }

  // Error state
  if (error) {
    return (
      <div className="artists-error">
        <h2>Error</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="artists-page">
      <h1>Artists Index Page</h1>
      <p className="artists-intro">
        Explore our featured artists below.
      </p>

      <div className="artists-filter">
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All Artists
        </button>
        {/* Add custom filter buttons here if needed */}
      </div>

      {filteredArtists.length === 0 ? (
        <div className="no-artists">
          <p>No featured artists found. Check back soon for upcoming features!</p>
        </div>
      ) : (
        <div className="artists-grid">
          {filteredArtists.map(artist => {
            console.log("Rendering artist card:", artist.name, "slug:", artist.slug); // Debug log
            
            return (
              <div key={artist.id} className="artist-card">
                {/* Important: Make sure the Link is properly formatted */}
                <Link to={`/artists/${artist.slug}`} className="artist-link">
                  {artist.avatar ? (
                    <img 
                      src={`${process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337'}${artist.avatar.url}`} 
                      alt={artist.name || 'Artist'} 
                      className="artist-thumbnail"
                    />
                  ) : (
                    <div className="artist-thumbnail-placeholder">
                      <span>No Image</span>
                    </div>
                  )}
                  
                  <div className="artist-card-content">
                    <h2>{artist.name || 'Artist'}</h2>
                    <p className="artist-date">
                      {new Date(artist.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </p>
                    
                    <span className="view-details">View Details →</span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Artists;