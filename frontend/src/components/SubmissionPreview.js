import React from 'react';
import '../styles/SubmissionPreview.css'

const SubmissionPreview = ({image, title, text}) => {
  return (
    <div className="submission-section">
        <img src={image} alt={title} />
        <h2>{title}</h2>
        <p>{text}</p>
    </div>
  );
};

export default SubmissionPreview;