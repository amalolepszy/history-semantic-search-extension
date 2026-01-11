import React from 'react';
import './HistoryItem.css';

const HistoryItem = ({ item }) => {
  // Format Date: "Jan 11, 2026, 3:30 PM"
  const formattedDate = new Date(item.lastVisitTime).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Helper to strip "www." and get hostname
  const getDomain = (url) => {
    try {
      const hostname = new URL(url).hostname;
      return hostname.startsWith('www.') ? hostname.slice(4) : hostname;
    } catch (e) {
      return 'unknown';
    }
  };

  // Calculate percentage match
  const matchScore = item.score ? Math.round(item.score * 100) : null;

  return (
    <div className="history-card" style={{ borderColor: matchScore > 80 ? '#673ab7' : '#e0e0e0' }}>
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="history-link">
        {item.title || "Untitled Page"}
      </a>

      <div className="history-meta">
        <span className="date-text">{formattedDate}</span>

        <div style={{ display: 'flex', gap: '5px' }}>
          {matchScore && (
            <span className="domain-pill" style={{ backgroundColor: '#ede7f6', color: '#673ab7' }}>
              {matchScore}% Match
            </span>
          )}
          <span className="domain-pill">{getDomain(item.url)}</span>
        </div>
      </div>
    </div>
  );
};

export default HistoryItem;
