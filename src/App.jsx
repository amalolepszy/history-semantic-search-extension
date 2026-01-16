/* global chrome */
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HistoryList from './components/HistoryList';
import ApiKeyInput from './components/ApiKeyInput';
import { cosineSimilarity } from './utils/cosine_similarity';
import { generateEmbedding } from './utils/generate_embedding';
import './App.css';

function App() {
  const [historyItems, setHistoryItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // 1. Fetch History & Trigger Embedding Generation
  const fetchHistory = (query = '') => {
    if (typeof chrome !== 'undefined' && chrome.history) {
      // startTime <- makes it so that entries older than 24hrs appear
      chrome.history.search({ text: query, maxResults: 50, startTime: 0 }, (results) => {
        setHistoryItems(results);
        generateEmbeddingsForBatch(results);
      });
    }
  };

  // 2. Process Batch Logic
  const generateEmbeddingsForBatch = async (items) => {
    if (!items || items.length === 0) {
      return;
    }

    try {
      // Get API Key
      const data = await chrome.storage.local.get("openai_key");
      const apiKey = data.openai_key;
      if (!apiKey) {
        return;
      }

      // Filter for missing items
      const keysToCheck = items.map(item => `vec_${item.id}`);
      const storageData = await chrome.storage.local.get(keysToCheck);
      const missingItems = items.filter(item => !storageData[`vec_${item.id}`]);

      if (missingItems.length === 0) {
        return;
      }

      console.log(`Generating embeddings for ${missingItems.length} items...`);

      // Loop through missing items
      for (const item of missingItems) {
        const textToEmbed = `${item.title || "Untitled"} - ${item.url}`;

        const embedding = await generateEmbedding(textToEmbed, apiKey);

        if (embedding) {
          await chrome.storage.local.set({ [`vec_${item.id}`]: embedding });
          console.log(`Saved embedding for: ${item.title}`);
        }
      }
    } catch (error) {
      console.error("Batch processing failed:", error);
    }
  };

  // 3. Semantic Search Logic
  const performSemanticSearch = async () => {
    if (!searchTerm) return;
    setIsSearching(true);

    try {
      const storage = await chrome.storage.local.get("openai_key");
      const apiKey = storage.openai_key;
      if (!apiKey) {
        alert("Please save your OpenAI API Key first.");
        setIsSearching(false);
        return;
      }

      const queryVector = await generateEmbedding(searchTerm, apiKey);

      if (!queryVector) {
        throw new Error("Failed to embed query");
      }

      // Fetch all vectors and rank
      const allStorage = await chrome.storage.local.get(null);

      const scoredItems = historyItems.map(item => {
        const itemVector = allStorage[`vec_${item.id}`];
        if (!itemVector) {
          return { ...item, score: 0 };
        }
        return { ...item, score: cosineSimilarity(queryVector, itemVector) };
      });

      // Sort by score
      const sortedItems = scoredItems.sort((a, b) => b.score - a.score);
      setHistoryItems(sortedItems);

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
  }, [searchTerm]);

  return (
    <div className="App">
      <ApiKeyInput />
      <Header
        searchTerm={searchTerm}
        onSearch={(text) => { setSearchTerm(text); fetchHistory(text); }}
        onSemanticSearch={performSemanticSearch}
        isSearching={isSearching}
      />
      <HistoryList items={historyItems} />
    </div>
  );
}

export default App;