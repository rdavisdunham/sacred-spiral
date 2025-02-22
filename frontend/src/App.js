import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Articles from './pages/Articles';
import Submissions from './pages/Submissions';
import Contact from './pages/Contact';
import Article from './pages/Article'; // Individual article page
import './styles/App.css';

const App = () => {
  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
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