// HistoryUI.jsx
import React from 'react';

const HistoryUI = ({ chatHistory }) => {
  if (!chatHistory.length) return <p>No conversations yet.</p>;

  return (
    <div className="history-ui">
      <h3>Conversation History</h3>
      <ul>
        {chatHistory.map((msg, idx) => (
          <li key={idx}>
            <strong>{msg.type === 'user' ? 'You' : 'Agent'}:</strong> {msg.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryUI;