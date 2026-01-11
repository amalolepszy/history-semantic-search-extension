/* global chrome */
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HistoryList from './components/HistoryList';
import ApiKeyInput from './components/ApiKeyInput';
import { cosineSimilarity } from './utils/cosine_similarity';
import './App.css';

function App() {
  const [historyItems, setHistoryItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

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
  
  // Search for most similar phrase based on the cosine distance of the embeddings.
  const performSemanticSearch = async () => {
    if (!searchTerm) return;
    setIsSearching(true);

    try {
      // 1. Get API Key
      const storage = await chrome.storage.local.get("openai_key");
      const apiKey = storage.openai_key;
      if (!apiKey) {
        alert("Please save your OpenAI API Key first.");
        setIsSearching(false);
        return;
      }

      // 2. Generate Embedding for the Search Term
      const response = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "text-embedding-3-small",
          input: searchTerm
        })
      });

      const data = await response.json();
      if (!data.data) throw new Error("Failed to generate embedding");
      const queryVector = data.data[0].embedding;

      // 3. Fetch ALL stored history vectors
      // Note: fetching null gets EVERYTHING. For production, organize data better.
      const allStorage = await chrome.storage.local.get(null);
      
      // 4. Calculate Scores
      const scoredItems = historyItems.map(item => {
        const itemVector = allStorage[`vec_${item.id}`];
        if (!itemVector) return { ...item, score: 0 }; // No vector yet
        
        const score = cosineSimilarity(queryVector, itemVector);
        return { ...item, score };
      });

      // 5. Sort by Score (Highest first)
      const sorted = scoredItems.sort((a, b) => b.score - a.score);
      
      // Filter out totally irrelevant results (optional threshold)
      setHistoryItems(sorted.filter(item => item.score > 0.25));

    } catch (err) {
      console.error(err);
      alert("Search failed. Check console.");
    } finally {
      setIsSearching(false);
    }
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
  }, []);

  // const handleSearch = (text) => {
  //   setSearchTerm(text);
  //   fetchHistory(text);
  // };

  return (
    <div className="App">
      <ApiKeyInput />
      <Header 
        searchTerm={searchTerm} 
        onSearch={setSearchTerm} 
        onSemanticSearch={performSemanticSearch}
        isSearching={isSearching}
      />
      <HistoryList items={historyItems} />
    </div>
  );
}

export default App;
