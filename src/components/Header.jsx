import React from 'react';
import './Header.css';

const Header = ({ searchTerm, onSearch, onSemanticSearch, isSearching }) => {
  return (
    <header className="header-container">
      <h3 className="header-title">History Explorer</h3>
      <div className="search-group">
        <input 
          type="text" 
          placeholder="Search..." 
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="search-box"
          onKeyDown={(e) => e.key === 'Enter' && onSemanticSearch()}
        />
        <button 
          onClick={onSemanticSearch} 
          className="btn-semantic" 
          disabled={isSearching}
          title="AI Semantic Search"
        >
          {isSearching ? '...' : '🤖'}
        </button>
      </div>
    </header>
  );
};

export default Header;