import React from 'react';
import { useNavigate } from 'react-router';
import './not-found.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <h1>Oops! Looks like you have wandered off the beaten path.</h1>
      <button 
        className="not-found-go-to-home" 
        onClick={() => navigate('/')}
      >
        Return to Home
      </button>
    </div>
  );
};

export default NotFound;