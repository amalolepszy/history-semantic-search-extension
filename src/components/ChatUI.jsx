/* global chrome */
import React, { useState, useEffect, useRef } from 'react';
import HistoryUI from './HistoryUI';
import './ChatUI.css';
import { generateChatCompletion } from '../utils/openai';

const ChatUI = ({ onClose }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { type: 'agent', text: 'Hello! I am ready to chat.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const userText = message;
    setMessage('');
    setIsLoading(true);

    // 1. Add User Message to UI
    const newHistory = [...chatHistory, { type: 'user', text: userText }];
    setChatHistory(newHistory);

    try {
      // 2. Get API Key
      const storage = await chrome.storage.local.get("openai_key");
      const apiKey = storage.openai_key;

      if (!apiKey) {
        setChatHistory(prev => [...prev, { type: 'agent', text: "Error: API Key missing." }]);
        setIsLoading(false);
        return;
      }

      // 3. Format messages for the OpenAI SDK
      const apiMessages = [
        { role: "system", content: "You are a helpful assistant." },
        ...newHistory.map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.text
        }))
      ];

      // 4. Call the SDK wrapper
      const aiResponse = await generateChatCompletion(apiMessages, apiKey);

      setChatHistory(prev => [...prev, { type: 'agent', text: aiResponse }]);

    } catch (error) {
      console.error(error);
      setChatHistory(prev => [...prev, { type: 'agent', text: "Sorry, something went wrong with the AI connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  return (
    <div className="chat-ui-container">
      <div className="chat-header">
        <h4>AI Agent</h4>
        <button onClick={onClose}>X</button>
      </div>

      <div className="chat-history">
        <HistoryUI chatHistory={chatHistory} />
        {isLoading && <div style={{ padding: '10px', color: '#666', fontStyle: 'italic' }}>Thinking...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <textarea
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          disabled={isLoading}
        />
        <button onClick={handleSend} disabled={isLoading}>Send</button>
      </div>
    </div>
  );
};

export default ChatUI;