/* global chrome */
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HistoryList from './components/HistoryList';
import './App.css';

function App() {
  const [historyItems, setHistoryItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch history from Chrome API
  const fetchHistory = (query = '') => {
    // Safety check for browser environment
    if (typeof chrome !== 'undefined' && chrome.history) {
      chrome.history.search({ text: query, maxResults: 40 }, (results) => {
        setHistoryItems(results);
      });
    } else {
      console.warn("Chrome API not found. Running in demo mode?");
    }
  };

  useEffect(() => {
    // 1. Load initial history
    fetchHistory();

    // 2. Set up real-time listener
    const handleMessage = (message) => {
      if (message.action === "history_updated") {
        fetchHistory(searchTerm); // Refresh using current search term
      }
    };

    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.onMessage.addListener(handleMessage);
      return () => chrome.runtime.onMessage.removeListener(handleMessage);
    }
  }, [searchTerm]); // Re-bind listener if searchTerm changes

  const handleSearch = (text) => {
    setSearchTerm(text);
    fetchHistory(text);
  };

  return (
    <div className="App">
      <Header searchTerm={searchTerm} onSearch={handleSearch} />
      <HistoryList items={historyItems} />
    </div>
  );
}

export default App;
