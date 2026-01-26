
import React, { useState, useEffect, useRef } from 'react';
import HistoryUI from './HistoryUI';
import './ChatUI.css';
import { getFormattedUrl } from '../utils/format_url';

const ChatUI = ({ onClose }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);

  const handleSend = () => {
    if (!message.trim()) return;

    setChatHistory((prev) => [...prev, { type: 'user', text: message }]);
    setMessage('');

    // symulowana odpowiedź agenta
    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        { type: 'agent', text: `jakaśtam odp` },
      ]);
    }, 500);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  return (
    <div className="chat-ui-container">
      <div className="chat-header">
        <h4>AI Agent</h4>
        <button onClick={onClose}>X</button>
      </div>

      <div className="chat-history">
        <HistoryUI chatHistory={chatHistory} />
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <textarea
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatUI;
