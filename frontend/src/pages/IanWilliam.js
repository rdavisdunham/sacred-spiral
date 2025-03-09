import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/TeamMember.css';

const IanWilliam = () => {
  return (
    <div className="team-member-page">
      <div className="container">
        <div className="back-link">
          <Link to="/about">&larr; Back to About</Link>
        </div>
        
        <div className="team-member-profile">
          <div className="team-member-header">
            <div className="team-member-image">
              <img src="/team/ian-william.jpg" alt="Ian William" />
            </div>
            
            <div className="team-member-info">
              <h1>Ian William</h1>
              <p className="team-member-role">Creative Director</p>
            </div>
          </div>
          
          <div className="team-member-bio">
            <h2>Biography</h2>
            <p>
              Ian William is a multidisciplinary artist and creative director who has been an integral part of Sacred Spiral Studios since its inception. With over 15 years of experience in the arts industry, Ian brings a unique perspective and innovative approach to all studio projects.
            </p>
            
            <p>
              After graduating from Rhode Island School of Design with a BFA in Photography, Ian spent several years working as a photojournalist before transitioning to creative direction. His work has been featured in numerous galleries across the United States and Europe, with his most recent exhibition "Spirals of Consciousness" receiving critical acclaim.
            </p>
            
            <p>
              As Creative Director at Sacred Spiral Studios, Ian oversees the artistic vision of the collective, working closely with contributing artists to develop cohesive and impactful visual narratives. He is particularly passionate about supporting emerging artists and creating platforms for underrepresented voices in the art world.
            </p>
            
            <h2>Selected Works</h2>
            <ul className="works-list">
              <li>
                <span className="work-year">2024</span> 
                <span className="work-title">"Spirals of Consciousness"</span> - Solo exhibition at The Contemporary Gallery
              </li>
              <li>
                <span className="work-year">2023</span> 
                <span className="work-title">"Urban Echoes"</span> - Photography series published in ArtForum
              </li>
              <li>
                <span className="work-year">2022</span> 
                <span className="work-title">"Liminal Spaces"</span> - Mixed media installation at MoMA PS1
              </li>
              <li>
                <span className="work-year">2020</span> 
                <span className="work-title">"Through the Lens"</span> - Photography book published by Aperture
              </li>
            </ul>
            
            <h2>Connect</h2>
            <div className="social-links">
              <a href="https://instagram.com/ianwilliam_art" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://ianwilliam.com" target="_blank" rel="noopener noreferrer">Personal Website</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IanWilliam;