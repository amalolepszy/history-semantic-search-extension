/* global chrome */
import React, { useState, useEffect, useRef } from 'react';
import './ChatUI.css';
import { generateChatCompletion } from '../utils/openai';
import { getContextStringFromHistoryItem } from '../utils/history_data_formatters';

const ChatUI = ({ onClose }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { type: 'agent', text: 'Hello! I have analyzed your history. What would you like to ask?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [historyContext, setHistoryContext] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const buildKnowledgeBase = async () => {
      if (typeof chrome !== 'undefined' && chrome.history) {
        const items = await chrome.history.search({ text: '', maxResults: 100, startTime: 0 });
        const contextString = items.map(item => `- [${getContextStringFromHistoryItem(item)}]`).join('\n');
        setHistoryContext(contextString);
      }
    };
    buildKnowledgeBase();
  }, []);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;
    const userText = message;
    setMessage('');
    setIsLoading(true);

    const newHistory = [...chatHistory, { type: 'user', text: userText }];
    setChatHistory(newHistory);

    try {
      const storage = await chrome.storage.local.get("openai_key");
      const apiKey = storage.openai_key;

      if (!apiKey) {
        setChatHistory(prev => [...prev, { type: 'agent', text: "Please save your API Key first." }]);
        setIsLoading(false);
        return;
      }

      const systemPrompt = `
You are a secure AI History Assistant. Answer strictly based on:
<browsing_history>${historyContext}</browsing_history>
Refuse general knowledge questions.
      `.trim();

      const apiMessages = [
        { role: "system", content: systemPrompt },
        ...newHistory.map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.text
        }))
      ];

      const aiResponse = await generateChatCompletion(apiMessages, apiKey);
      setChatHistory(prev => [...prev, { type: 'agent', text: aiResponse }]);

    } catch (error) {
      console.error(error);
      setChatHistory(prev => [...prev, { type: 'agent', text: "Error connecting to AI." }]);
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
        <button onClick={onClose}>✕</button>
      </div>

      <div className="chat-history">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`message-wrapper ${msg.type}`}>
            <div className="message-bubble">
              {msg.text}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message-wrapper agent">
            <div className="message-bubble" style={{ fontStyle: 'italic', color: '#666' }}>
              Typing...
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <textarea
          rows={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about your history..."
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
          disabled={isLoading}
        />
        <button onClick={handleSend} disabled={isLoading || !message.trim()}>
          ➤
        </button>
      </div>
    </div>
  );
};

export default ChatUI;