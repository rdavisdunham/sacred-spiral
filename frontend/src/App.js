// frontend/src/App.js
import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Articles from './pages/Articles';
import Article from './pages/Article';
import Artists from './pages/Artists';
import Artist from './pages/Artist';
import About from './pages/About';
import IanWilliam from './pages/IanWilliam';
import Contributor from './pages/Contributor'; // Import the new Contributor component
import Contact from './pages/Contact';
import Archive from './pages/Archive';
import Submissions from './pages/Submissions';
import './styles/App.css';

const App = () => {
  const location = useLocation();
  const shouldDisplayHeader = () => {
    const display = location.pathname !== '/';
    console.log("Current Pathname:", location.pathname, "Display Header:", display);
    return display;
  };

  return (
    <div className="app">
      {shouldDisplayHeader() && <Header />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        
        {/* Article routes */}
        <Route path="/articles" element={<Articles />} />
        <Route path="/articles/genre/:genre" element={<Articles />} />
        <Route path="/articles/:slug" element={<Article />} />
        
        {/* Artist routes */}
        <Route path="/artists" element={<Artists />} />
        <Route path="/artists/:slug" element={<Artist />} />
        
        {/* About and Team routes */}
        <Route path="/about" element={<About />} />
        <Route path="/about/ian-william" element={<IanWilliam />} />
        <Route path="/about/team/:slug" element={<Contributor />} />
        
        {/* Other main pages */}
        <Route path="/submissions" element={<Submissions />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Archive routes */}
        <Route path="/archive" element={<Archive />} />
        <Route path="/archive/:month" element={<Archive />} />
      </Routes>
    </div>
  );
};

export default App;