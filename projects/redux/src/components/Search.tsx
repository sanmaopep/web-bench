import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Search.css';
import { searchBlogs } from '../models/search';
import { RootState } from '../store';

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const searching = useSelector((state: RootState) => state.search.loading);

  const debouncedSearch = useCallback(
    (value: string) => {
      if (value.trim()) {
        dispatch(searchBlogs(value));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      debouncedSearch(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, debouncedSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search Blogs"
        value={searchTerm}
        onChange={handleInputChange}
      />
      {searching && <div className="search-loading">Searching...</div>}
    </div>
  );
};

export default Search;