import React, { useState, useEffect } from 'react';
import { Form, Button, InputGroup, Dropdown } from 'react-bootstrap';

/**
 * Search Bar Component
 * Allows users to search products by keyword with search history
 */
function SearchBar({ onSearch }) {
  const [keyword, setKeyword] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);

  // Load search history from localStorage on mount
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearchHistory(history);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      onSearch(keyword);
      addToHistory(keyword);
    }
  };

  const handleClear = () => {
    setKeyword('');
    onSearch('');
  };

  const addToHistory = (searchTerm) => {
    const updatedHistory = [searchTerm, ...searchHistory.filter(item => item !== searchTerm)].slice(0, 5);
    setSearchHistory(updatedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
  };

  const handleHistorySelect = (historyItem) => {
    setKeyword(historyItem);
    onSearch(historyItem);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  return (
    <Form onSubmit={handleSearch}>
      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Search products by name..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Button variant="primary" type="submit">
          🔍 Search
        </Button>
        {keyword && (
          <Button variant="secondary" onClick={handleClear}>
            Clear
          </Button>
        )}
        {searchHistory.length > 0 && (
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" id="search-history-dropdown">
              📚 History
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {searchHistory.map((item, index) => (
                <Dropdown.Item
                  key={index}
                  onClick={() => handleHistorySelect(item)}
                >
                  {item}
                </Dropdown.Item>
              ))}
              <Dropdown.Divider />
              <Dropdown.Item onClick={clearHistory} className="text-danger">
                Clear History
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </InputGroup>
    </Form>
  );
}

export default SearchBar;