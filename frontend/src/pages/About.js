import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/About.css';

const About = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const strapiUrl = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';
        
        // Fetch team members (contributors)
        const response = await fetch(`${strapiUrl}/api/contributors?populate=*`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonData = await response.json();
        console.log("Contributors data:", jsonData);
        
        setTeam(jsonData.data || []);
      } catch (error) {
        console.error("Error fetching team members:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  return (
    <div className="about-page">
      <section className="about-studio">
        <h1>The Studio</h1>
        
        <div className="studio-content">
          <p>Welcome to Sacred Spiral Studios. Here we support up and coming artists in getting their feet in doors and their art in front of an audience.</p>
          
          <p>2025 is shaping up to be a big year for us. Currently in the works is a brand new platform for artists and venues to connect. We're calling it <strong>The Connection</strong>, the goal being to provide a more streamlined and accessible way for artists to find gigs and bookers to review content. Artists may create profiles that showcase their work and bookers can create profiles that help promote their venue and reach a broader range of artists. <strong>The Connection</strong> will not be limited to musical acts and venues. We will offer a platform for all types of artists and all types of venues. Stay tuned.</p>
          
          <p>We are also making our way out into the real world in the form of vender fairs and more in-person events. Sacred Spiral Studios now proudly serves as the Booking and Events Manager for <a href="https://www.monkeynestcoffee.com/" target="_blank" rel="noopener noreferrer">Monkey Nest Coffee</a>. For all booking inquiries, please head to our <Link to="/contact">contact page</Link>.</p>
        </div>
        
        <div className="studio-quote">
          <blockquote>
            <p>For many artists it can be hard managing self promotion on top of their daily lives. This new world of social media promotion has created such a large pool of creative talent it can be almost impossible to stay afloat, much less get noticed. However, one tried and true method of self promotion remains intact. The old school "social networking" habit of people coming together around creative ideas and activities is still one of the most effective ways to promote yourself as an artist, new and old. At Sacred Spiral Studios, we are aiming to promote, host, and partake in the physical/tangible world of artists and creatives. Our plan to expand into more "live" settings is motivated by our love for word-of-mouth promotion. This collective started in that exact way, and we believe your next project can too.</p>
            <cite>— Ian William</cite>
          </blockquote>
        </div>
        
        <div className="studio-update">
          <h3>UPDATE: SACRED SPIRAL STUDIOS IS CURRENTLY OPEN FOR ART SUBMISSIONS TO OUR NEW PUBLICATION.</h3>
          <p>WE'RE LOOKING FOR PHOTOGRAPHY, VISUAL ART, POETRY, AND SHORT STORIES. HEAD TO OUR <Link to="/submissions">SUBMISSIONS PAGE</Link> TO SEND US YOUR ART.</p>
        </div>
      </section>
      
      <section className="about-team">
        <h2>Our Team</h2>
        
        {loading ? (
          <div className="team-loading">Loading team members...</div>
        ) : error ? (
          <div className="team-error">Error loading team information: {error.message}</div>
        ) : (
          <div className="team-grid">
            {/* Featured team member - Ian William */}
            <div className="team-member featured">
              <img 
                src="/team/ian-william.jpg" 
                alt="Ian William" 
                className="team-photo"
              />
              <div className="team-info">
                <h3>Ian William</h3>
                <p className="team-role">Founder, Sacred Spiral Studios</p>
                <p className="team-bio-excerpt">
                  Ian William is the founder of Sacred Spiral Studios, a multidisciplinary artist with a passion for building creative communities and fostering connections between artists of all backgrounds.
                </p>
                <Link to="/about/ian-william" className="view-profile-link">
                  View Complete Profile
                </Link>
              </div>
            </div>
            
            {/* Other team members */}
            {team.length > 0 ? team.map(member => {
              console.log("Rendering team member:", member);
              
              // Only render if we have required data and a slug
              if (!member || !member.name || !member.slug) {
                return null;
              }
              
              return (
                <div key={member.id} className="team-member">
                  {member.avatar && member.avatar.url ? (
                    <img 
                      src={`${process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337'}${member.avatar.url}`} 
                      alt={member.name} 
                      className="team-photo"
                    />
                  ) : (
                    <div className="team-photo-placeholder"></div>
                  )}
                  
                  <div className="team-info">
                    <h3>{member.name}</h3>
                    <p className="team-role">{member.role || 'Team Member'}</p>
                    <p className="team-bio-excerpt">
                      {member.bio ? (
                        typeof member.bio === 'string' 
                          ? member.bio.substring(0, 120) + '...'
                          : 'Team member at Sacred Spiral Studios'
                      ) : 'Team member at Sacred Spiral Studios'}
                    </p>
                    {/* Updated: Use slug instead of ID */}
                    <Link to={`/about/team/${member.slug}`} className="view-profile-link">
                      View Profile
                    </Link>
                  </div>
                </div>
              );
            }) : (
              <p className="no-team-members">No additional team members found.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default About;