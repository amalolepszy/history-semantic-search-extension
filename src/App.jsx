/* global chrome */
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HistoryList from './components/HistoryList';
import ApiKeyInput from './components/ApiKeyInput';
import './App.css';

function App() {
  const [historyItems, setHistoryItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchHistory = (query = '') => {
    if (typeof chrome !== 'undefined' && chrome.history) {
      chrome.history.search({ text: query, maxResults: 50 }, (results) => {
        setHistoryItems(results);
        
        // After fetching history, check which ones are missing embeddings
        triggerMissingEmbeddings(results);
      });
    }
  };

  // Helper to find missing embeddings and notify Service Worker
  const triggerMissingEmbeddings = (items) => {
    if (!items || items.length === 0) return;

    // Create a list of keys to check: "vec_123", "vec_124", etc.
    const keysToCheck = items.map(item => `vec_${item.id}`);

    chrome.storage.local.get(keysToCheck, (storageData) => {
      const missingItems = [];

      items.forEach(item => {
        const key = `vec_${item.id}`;
        // If the key is undefined in storage, we need to generate it
        if (!storageData[key]) {
          missingItems.push(item);
        }
      });

      if (missingItems.length > 0) {
        console.log(`Requesting embeddings for ${missingItems.length} items...`);
        // Send the list to the Service Worker
        chrome.runtime.sendMessage({ 
          action: "generate_missing_embeddings", 
          items: missingItems 
        });
      }
    });
  };

  useEffect(() => {
    fetchHistory();
    
    const handleMessage = (message) => {
      if (message.action === "history_updated") {
        fetchHistory(searchTerm);
      }
    };

    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.onMessage.addListener(handleMessage);
      return () => chrome.runtime.onMessage.removeListener(handleMessage);
    }
  }, [searchTerm]);

  const handleSearch = (text) => {
    setSearchTerm(text);
    fetchHistory(text);
  };

  return (
    <div className="App">
      <ApiKeyInput />
      <Header searchTerm={searchTerm} onSearch={handleSearch} />
      <HistoryList items={historyItems} />
    </div>
  );
}

export default App;
