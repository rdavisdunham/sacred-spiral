import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ArticleSection from '../components/ArticleSection';
import SubmissionSection from '../components/SubmissionSection';
import '../styles/Home.css'; // Import our new CSS file

const Home = () => {
  return (
    <div className="home-container">
      <Hero />
      
      <div className="section-divider"></div>
      
      <ArticleSection />
      
      <div className="section-divider"></div>
      
      <SubmissionSection />
    </div>
  );
};

export default Home;