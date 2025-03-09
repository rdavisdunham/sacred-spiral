import React, { useState } from 'react';
import '../styles/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const strapiUrl = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';
      
      const response = await fetch(`${strapiUrl}/api/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: formData }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Contact form submission successful:', data);
      
      setSubmitStatus({
        success: true,
        message: 'Thank you for your message! We will get back to you soon.'
      });
      
      // Clear the form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
    } catch (error) {
      console.error('Error submitting contact form:', error);
      
      setSubmitStatus({
        success: false,
        message: 'There was a problem submitting your message. Please try again later.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-info">
          <h1>Contact Us</h1>
          
          <p>
            Have a question, want to collaborate, or interested in submitting your work? 
            We'd love to hear from you!
          </p>
          
          <div className="contact-methods">
            <div className="contact-method">
              <h3>Email Us</h3>
              <p>
                <a href="mailto:info@sacredspiralstudios.com">info@sacredspiralstudios.com</a>
              </p>
            </div>
            
            <div className="contact-method">
              <h3>For Bookings</h3>
              <p>
                Sacred Spiral Studios now proudly serves as the Booking and Events Manager for Monkey Nest Coffee.
              </p>
              <p>
                <a href="mailto:booking@sacredspiralstudios.com">booking@sacredspiralstudios.com</a>
              </p>
            </div>
            
            <div className="contact-method">
              <h3>Follow Us</h3>
              <div className="social-links">
                <a href="https://instagram.com/sacredspiralstudios" target="_blank" rel="noopener noreferrer">Instagram</a>
                <a href="https://facebook.com/sacredspiralstudios" target="_blank" rel="noopener noreferrer">Facebook</a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="contact-form-wrapper">
          <h2>Send Us a Message</h2>
          
          {submitStatus && submitStatus.success ? (
            <div className="form-success">
              <p>{submitStatus.message}</p>
              <button 
                onClick={() => setSubmitStatus(null)} 
                className="send-another-btn"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
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
                <label htmlFor="email">Email</label>
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
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  required
                ></textarea>
              </div>
              
              {submitStatus && !submitStatus.success && (
                <div className="form-error">
                  <p>{submitStatus.message}</p>
                </div>
              )}
              
              <button 
                type="submit" 
                className="submit-btn" 
                disabled={submitting}
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;