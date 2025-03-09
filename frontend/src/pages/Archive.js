import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ArticlePreview from '../components/ArticlePreview';
import '../styles/Archive.css';

const Archive = () => {
  const [archives, setArchives] = useState({});
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { month } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArchives = async () => {
      try {
        setLoading(true);
        const strapiUrl = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';
        
        // Fetch all articles sorted by publishedAt
        const articlesResponse = await fetch(
          `${strapiUrl}/api/articles?populate[0]=image&populate[1]=contributor&populate[2]=collection&sort[0]=publishedAt:desc`
        );

        if (!articlesResponse.ok) {
          throw new Error(`HTTP error! status: ${articlesResponse.status}`);
        }

        const articlesData = await articlesResponse.json();
        const articles = articlesData.data || [];
        
        // Fetch all AotM entries
        const aotmResponse = await fetch(
          `${strapiUrl}/api/aotms?populate=*&sort[0]=publishedAt:desc`
        );

        if (!aotmResponse.ok) {
          throw new Error(`HTTP error! status: ${aotmResponse.status}`);
        }

        const aotmData = await aotmResponse.json();
        const aotmEntries = aotmData.data || [];
        
        // Group by month
        const archivesByMonth = {};
        const monthSet = new Set();
        
        // Process articles
        articles.forEach(article => {
          if (!article.attributes?.publishedAt) return;
          
          const date = new Date(article.attributes.publishedAt);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          const monthLabel = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
          
          if (!archivesByMonth[monthKey]) {
            archivesByMonth[monthKey] = {
              label: monthLabel,
              articles: [],
              aotm: null
            };
            monthSet.add(monthKey);
          }
          
          archivesByMonth[monthKey].articles.push(article);
        });
        
        // Process AotM entries
        aotmEntries.forEach(aotm => {
          if (!aotm.attributes?.publishedAt) return;
          
          const date = new Date(aotm.attributes.publishedAt);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          const monthLabel = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
          
          if (archivesByMonth[monthKey]) {
            archivesByMonth[monthKey].aotm = aotm;
          } else {
            archivesByMonth[monthKey] = {
              label: monthLabel,
              articles: [],
              aotm: aotm
            };
            monthSet.add(monthKey);
          }
        });
        
        // Convert to array and sort by date (newest first)
        const sortedMonths = Array.from(monthSet).sort().reverse();
        
        setArchives(archivesByMonth);
        setMonths(sortedMonths);
        
        // If a month is specified in the URL, use that, otherwise use the most recent
        if (month && archivesByMonth[month]) {
          setSelectedMonth(month);
        } else if (sortedMonths.length > 0) {
          setSelectedMonth(sortedMonths[0]);
          // Update URL to match selected month
          navigate(`/archive/${sortedMonths[0]}`, { replace: true });
        }
        
      } catch (error) {
        console.error('Error fetching archives:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchArchives();
  }, [month, navigate]);

  const handleMonthSelect = (monthKey) => {
    setSelectedMonth(monthKey);
    navigate(`/archive/${monthKey}`);
  };

  if (loading) {
    return <div className="archive-loading">Loading archives...</div>;
  }

  if (error) {
    return <div className="archive-error">Error loading archives: {error.message}</div>;
  }

  if (months.length === 0) {
    return <div className="archive-empty">No archives found.</div>;
  }

  return (
    <div className="archive-page">
      <h1>Archive</h1>
      
      <div className="archive-container">
        <aside className="month-sidebar">
          <h2>Browse by Month</h2>
          <ul className="month-list">
            {months.map(monthKey => (
              <li 
                key={monthKey}
                className={monthKey === selectedMonth ? 'active' : ''}
                onClick={() => handleMonthSelect(monthKey)}
              >
                {archives[monthKey].label}
              </li>
            ))}
          </ul>
        </aside>
        
        <div className="archive-content">
          {selectedMonth && (
            <>
              <h2 className="month-heading">{archives[selectedMonth].label}</h2>
              
              {archives[selectedMonth].articles.length > 0 ? (
                <section className="month-articles">
                  <h3>Articles</h3>
                  <div className="archive-articles-grid">
                    {archives[selectedMonth].articles.map(article => (
                      <ArticlePreview 
                        key={article.id} 
                        article={article.attributes}
                      />
                    ))}
                  </div>
                </section>
              ) : (
                <p className="no-articles">No articles published this month.</p>
              )}
              
              {archives[selectedMonth].aotm && (
                <section className="month-aotm">
                  <h3>Artist of the Month</h3>
                  <div className="aotm-preview">
                    {archives[selectedMonth].aotm.attributes?.photos?.data && 
                     archives[selectedMonth].aotm.attributes.photos.data.length > 0 && (
                      <img 
                        src={`${process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337'}${archives[selectedMonth].aotm.attributes.photos.data[0].attributes.url}`}
                        alt={archives[selectedMonth].aotm.attributes.title || "Artist of the Month"}
                        className="aotm-thumbnail"
                      />
                    )}
                    <div className="aotm-info">
                      <h4>{archives[selectedMonth].aotm.attributes?.title || "Featured Artist"}</h4>
                      <Link 
                        to={`/artists/${archives[selectedMonth].aotm.id}`} 
                        className="view-aotm-button"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Archive;