/* global chrome */
import React, { useState, useEffect } from 'react';
import './ApiKeyInput.css';

const ApiKeyInput = () => {
  const [key, setKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Check if key is already saved
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['openai_key'], (result) => {
        if (result.openai_key) {
          setKey(result.openai_key); // Pre-fill (masked in UI ideally)
          setSaved(true);
        }
      });
    }
  }, []);

  const handleSave = () => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ openai_key: key }, () => {
        setSaved(true);
        alert("API Key saved! Future visits will be embedded.");
      });
    }
  };

  const handleClear = () => {
    chrome.storage.local.remove('openai_key', () => {
      setKey('');
      setSaved(false);
    });
  };

  return (
    <div className="api-key-container">
      {saved ? (
        <div className="key-status success">
          <span>✅ OpenAI Key Active</span>
          <button onClick={handleClear} className="btn-text">Change</button>
        </div>
      ) : (
        <div className="key-input-group">
          <input
            type="password"
            placeholder="Paste your key here..."
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="input-key"
          />
          <button onClick={handleSave} className="btn-save">Save Key</button>
        </div>
      )}
    </div>
  );
};

export default ApiKeyInput;