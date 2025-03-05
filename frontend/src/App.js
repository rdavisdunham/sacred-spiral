import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Articles from './pages/Articles';
import Submissions from './pages/Submissions';
import Contact from './pages/Contact';
import Article from './pages/Article'; // Individual article page
import './styles/App.css';

const App = () => {
  const location = useLocation();
  const shouldDisplayHeader = () => {
    const display = location.pathname !== '/';
    console.log("Current Pathname:", location.pathname, "Display Header:", display); // ADD THIS LOG
    return display;
  };

  return (
    <div className="app">
      {shouldDisplayHeader() && <Header />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/submissions" element={<Submissions />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/articles/:slug" element={<Article />} /> {/* Dynamic route */}
        {/* Add other routes as needed */}
      </Routes>
    </div>
  );
};

export default App;