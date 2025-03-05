import '../styles/Landing.css'; // Import CSS file for animation
import React from 'react';
import { Link } from 'react-router-dom';

const ClickableImageLandingPage = ({ imageUrl, linkUrl }) => {
  return (
    <div style={{ // Main container to center content
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh', // Make it full viewport height
      margin: 0,     // Remove default body margins
    }}>
      <Link to={linkUrl} style={{ display: 'block' }}> {/* Use Link instead of <a> */}
        <img
          src={imageUrl}
          alt="Clickable Image"
          className="spinning-image" //Apply CSS class for animation
          style={{ 
            maxWidth: '100%',
            height: 'auto',
            display: 'block',
            border: 'none' 
          }}
        />
      </Link>
    </div>
  );
};

const Landing = () => {
  // Replace these with your actual image URL and link URL
  const myImageURL = "/spiral.png";
  const myLinkURL = "/home";

  return (
    <div className="landing-page-container">
      <ClickableImageLandingPage imageUrl={myImageURL} linkUrl={myLinkURL} />
      {/* You can add other components or content here if needed for your App */}
    </div>
  );
};

export default Landing;