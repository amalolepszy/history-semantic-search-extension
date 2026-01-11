/* global chrome */
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [historyItems, setHistoryItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Function to fetch history
  const fetchHistory = (query = '') => {
    // Check if chrome API is available (prevents crash in local browser testing)
    if (typeof chrome !== 'undefined' && chrome.history) {
      chrome.history.search({ text: query, maxResults: 20 }, (results) => {
        setHistoryItems(results);
      });
    } else {
      console.warn("Chrome History API not found. Are you running in the browser?");
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchHistory();

    // Listener for real-time updates from service-worker
    const handleMessage = (message) => {
      if (message.action === "history_updated") {
        fetchHistory(searchTerm);
      }
    };

    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.onMessage.addListener(handleMessage);
      // Cleanup
      return () => chrome.runtime.onMessage.removeListener(handleMessage);
    }
  }, [searchTerm]);

  const handleSearch = (e) => {
    const text = e.target.value;
    setSearchTerm(text);
    fetchHistory(text);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h3>History Explorer</h3>
        <input 
          type="text" 
          placeholder="Search history..." 
          value={searchTerm}
          onChange={handleSearch}
          className="search-box"
        />
      </header>
      <main className="history-list">
        {historyItems.length === 0 ? (
          <p className="no-data">No history found.</p>
        ) : (
          historyItems.map((item) => (
            <div key={item.id} className="history-card">
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="history-link">
                {item.title || "Untitled Page"}
              </a>
              <div className="history-meta">
                <span>{new Date(item.lastVisitTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                <span> • </span>
                <span className="domain">{new URL(item.url).hostname.replace('www.', '')}</span>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}

export default App;