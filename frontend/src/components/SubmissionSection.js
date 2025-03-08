import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/SubmissionSection.css'; 

const SubmissionSection = () => {
  return (
    <section className='submission-section'>
      <img 
        src="/spiral.png" 
        alt="Sacred Spiral Studios Logo" 
        className="submission-image"
      />
      <h2>OPEN CALL FOR ART SUBMISSIONS</h2>
      <p>
        We are currently accepting art submissions for our publication launching in 2025. 
        Photography, poetry, short stories, and any other kind of art you make, we want to see it!
      </p>
      <Link to="/submissions" className="submission-cta">
        HEAD TO OUR SUBMISSIONS PAGE
      </Link>
    </section>
  );
};

export default SubmissionSection;