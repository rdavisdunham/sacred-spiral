import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Submissions.css';

const Submissions = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    artType: '',
    description: '',
    website: '',
    socialMedia: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [fileSelected, setFileSelected] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFileSelected(e.target.files.length > 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const strapiUrl = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';
      
      // Get files from input
      const fileInput = document.getElementById('art-files');
      const files = fileInput.files;
      
      // Create a FormData object to handle file uploads
      const formDataWithFiles = new FormData();
      
      // First, upload the files to Strapi's upload API
      if (files.length > 0) {
        // Add each file to formData
        for (let i = 0; i < files.length; i++) {
          formDataWithFiles.append('files', files[i]);
        }
        
        // Submit the files first to get their IDs
        const uploadResponse = await fetch(`${strapiUrl}/api/upload`, {
          method: 'POST',
          body: formDataWithFiles,
        });
        
        if (!uploadResponse.ok) {
          throw new Error(`Upload failed with status: ${uploadResponse.status}`);
        }
        
        // Get the uploaded file IDs
        const uploadedFiles = await uploadResponse.json();
        console.log('Files uploaded successfully:', uploadedFiles);
        
        // Now create the submission with references to the uploaded files
        const submissionData = {
          data: {
            ...formData,
            artFiles: uploadedFiles.map(file => file.id),
            status: 'pending'
          }
        };
        
        // Submit the submission data to Strapi
        const submissionResponse = await fetch(`${strapiUrl}/api/submissions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData),
        });
        
        if (!submissionResponse.ok) {
          throw new Error(`Submission failed with status: ${submissionResponse.status}`);
        }
        
        const result = await submissionResponse.json();
        console.log('Submission created successfully:', result);
        
        setSubmitStatus({
          success: true,
          message: 'Thank you for your submission! We will review your work and get back to you soon.'
        });
      } else {
        throw new Error('Please select at least one file to upload');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        success: false,
        message: `There was a problem with your submission: ${error.message}`
      });
    } finally {
      setSubmitting(false);
      
      if (submitStatus?.success) {
        // Reset form on success
        setFormData({
          name: '',
          email: '',
          artType: '',
          description: '',
          website: '',
          socialMedia: ''
        });
        setFileSelected(false);
        
        // Reset file input
        document.getElementById('art-files').value = '';
      }
    }
  };

  return (
    <div className="submissions-page">
      <div className="submissions-header">
        <h1>Art Submissions</h1>
        <img src="/spiral.png" alt="Sacred Spiral Studios logo" className="submissions-logo" />
      </div>
      
      <div className="submissions-info">
        <h2>OPEN CALL FOR ART SUBMISSIONS</h2>
        <p>
          We are currently accepting art submissions for our publication launching in 2025. 
          Photography, poetry, short stories, and any other kind of art you make, we want to see it!
        </p>
        
        <div className="submission-details">
          <h3>Submission Guidelines</h3>
          <ul>
            <li>All work must be original and created by you</li>
            <li>We accept various art forms including visual art, photography, poetry, short stories, music, etc.</li>
            <li>Visual art should be submitted in high-resolution JPG, PNG, or PDF format</li>
            <li>Written work should be submitted as PDF, DOC, or DOCX files</li>
            <li>Audio submissions should be in MP3 format</li>
            <li>Please include a brief description of your work</li>
          </ul>
          
          <h3>Selection Process</h3>
          <p>
            All submissions will be reviewed by our editorial team. Selected works will be featured 
            in our upcoming publication, on our website, and potentially in future exhibitions. 
            Artists will be credited for their work and retain ownership rights.
          </p>
          
          <h3>Submission Deadline</h3>
          <p>We are accepting submissions on a rolling basis until further notice.</p>
        </div>
      </div>
      
      <div className="submissions-form-container">
        <h2>Submit Your Work</h2>
        
        {submitStatus && submitStatus.success ? (
          <div className="submission-success">
            <p>{submitStatus.message}</p>
            <button 
              onClick={() => setSubmitStatus(null)} 
              className="new-submission-btn"
            >
              Submit Another Work
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="submissions-form">
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="artType">Type of Art *</label>
              <select
                id="artType"
                name="artType"
                value={formData.artType}
                onChange={handleChange}
                required
              >
                <option value="">Select type</option>
                <option value="photography">Photography</option>
                <option value="visualart">Visual Art</option>
                <option value="poetry">Poetry</option>
                <option value="shortstory">Short Story</option>
                <option value="music">Music</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description of Your Work *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                required
              ></textarea>
            </div>
            
            <div className="form-group">
              <label htmlFor="art-files">Upload Your Work *</label>
              <input
                type="file"
                id="art-files"
                name="files"
                multiple
                onChange={handleFileChange}
                required
              />
              <p className="file-help">You can select multiple files. Max size: 20MB per file.</p>
            </div>
            
            <div className="form-group">
              <label htmlFor="website">Website (Optional)</label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="socialMedia">Social Media Links (Optional)</label>
              <input
                type="text"
                id="socialMedia"
                name="socialMedia"
                value={formData.socialMedia}
                onChange={handleChange}
                placeholder="Instagram, Twitter, Facebook, etc."
              />
            </div>
            
            <button 
              type="submit" 
              className="submit-btn" 
              disabled={!fileSelected || submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Your Work'}
            </button>
          </form>
        )}
      </div>
      
      <div className="submissions-contact">
        <p>
          Have questions about submissions? Contact us at{' '}
          <a href="mailto:submissions@sacredspiralstudios.com">submissions@sacredspiralstudios.com</a>
        </p>
      </div>
    </div>
  );
};

export default Submissions;