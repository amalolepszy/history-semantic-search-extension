import React from 'react';
import './Header.css';

const Header = ({ searchTerm, onSearch }) => {
  return (
    <header className="header-container">
      <h3 className="header-title">History Explorer</h3>
      <input
        type="text"
        placeholder="Search history..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="search-box"
      />
    </header>
  );
};

export default Header;
