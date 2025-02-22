import React from 'react';
import SubmissionPreview from './SubmissionPreview';
import '../styles/SubmissionSection.css'

const SubmissionSection = () => {
  return (
    <section className='submission-section'>
    <SubmissionPreview
    image="/path/to/storm-image.jpg"
    title="OPEN CALL FOR ART SUBMISSIONS"
    text="We are currently accepting art submissions for our publication launching in 2025. Photography, poetry, short stories, and any other kind of art you make, we want to see it!
    HEAD TO OUR SUBMISSIONS PAGE TO SHARE YOUR WORK."
    />
    </section>
  );
};

export default SubmissionSection;