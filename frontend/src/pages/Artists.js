import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../styles/Artists.css';

const Artist = () => {
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { artistId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const strapiUrl = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';
        
        // Fetch the specific artist
        const response = await fetch(`${strapiUrl}/api/aotms/${artistId}?populate=*`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonData = await response.json();
        console.log("Artist data:", jsonData);
        
        if (!jsonData.data) {
          throw new Error('Artist not found');
        }
        
        setArtist(jsonData.data);
      } catch (error) {
        console.error("Error fetching artist:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (artistId) {
      fetchArtist();
    }
  }, [artistId]);

  if (loading) {
    return <div className="artist-loading">Loading artist information...</div>;
  }

  if (error) {
    return (
      <div className="artist-error">
        <h2>Error</h2>
        <p>{error.message}</p>
        <button onClick={() => navigate('/artists')}>Back to Artists</button>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="artist-not-found">
        <h2>Artist Not Found</h2>
        <p>The artist you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate('/artists')}>Back to Artists</button>
      </div>
    );
  }

  // Format publication date
  const publishDate = new Date(artist.attributes?.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });

  return (
    <div className="artist-page">
      <header className="artist-header">
        <h1>{artist.attributes?.title || 'Featured Artist'}</h1>
        <p className="artist-date">{publishDate}</p>
        
        <div className="artist-status">
          {artist.attributes?.state === 'Current' ? (
            <span className="current-badge">Current Artist of the Month</span>
          ) : (
            <span className="archive-badge">Archived</span>
          )}
        </div>
      </header>
      
      <div className="artist-gallery">
        {artist.attributes?.photos?.data && artist.attributes.photos.data.length > 0 ? (
          artist.attributes.photos.data.map((photo, index) => (
            <div key={index} className="gallery-item">
              <img 
                src={`${process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337'}${photo.attributes.url}`}
                alt={`Artist work ${index + 1}`}
                className="gallery-image"
              />
            </div>
          ))
        ) : (
          <div className="no-images">No artwork images available</div>
        )}
      </div>
      
      <div className="artist-content">
        {artist.attributes?.content ? (
          <div className="artist-description">
            {artist.attributes.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        ) : (
          <p className="no-content">No additional information available for this artist.</p>
        )}
      </div>
      
      <div className="artist-template-info">
        <p>
          Template: {artist.attributes?.template || 'Default'}
        </p>
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