import React from 'react';
import Hero from '../components/Hero';
import ArticleSection from '../components/ArticleSection';
import SubmissionSection from '../components/SubmissionSection';

const Home = () => {
  return (
    <div>
      <Hero />
      <ArticleSection />
      <SubmissionSection/>
    </div>
  );
};

export default Home;