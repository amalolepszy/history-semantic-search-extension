import React from 'react';
import HistoryItem from './HistoryItem';
import './HistoryList.css';

const HistoryList = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <div className="no-data">
        <p>No history found.</p>
        <small>Try visiting some websites!</small>
      </div>
    );
  }

  return (
    <main className="history-list-container">
      {items.map((item) => (
        <HistoryItem key={item.id} item={item} />
      ))}
    </main>
  );
};

export default HistoryList;
