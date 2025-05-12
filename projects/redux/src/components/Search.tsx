// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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