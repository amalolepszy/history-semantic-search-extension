import React from 'react';
import './HistoryItem.css';
import { formatDate } from '../utils/history_data_formatters';

const HistoryItem = ({ item }) => {
  const formattedDate = formatDate(item.lastVisitTime);

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
  const isHighMatch = matchScore && matchScore > 80;

  return (
    <div className={`history-card ${isHighMatch ? 'high-match' : ''}`}>
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="history-link">
        {item.title || "Untitled Page"}
      </a>
      
      <div className="history-meta">
        <span className="date-text">{formattedDate}</span>

        <div className="meta-tags">
          {matchScore && (
            <span className="domain-pill match-pill">
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
