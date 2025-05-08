import React from 'react';
import './Header.css';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFormVisibility } from '../models/blogForm';
import { RootState } from '../store';
import { navigate } from '../middleware/route';
import { appendManyBlogs } from '../models/blog';
import { logoutUser } from '../models/user';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state: RootState) => state.blog.blogs);
  const loading = useSelector((state: RootState) => state.blog.loading);
  const user = useSelector((state: RootState) => state.user.username);
  const currentRoute = useSelector((state: RootState) => state.route.currentRoute);

  const handleAddBlog = () => {
    dispatch(toggleFormVisibility());
  };

  const handleLogin = () => {
    dispatch(navigate('/login'));
  };

  const handleAppendManyBlogs = () => {
    dispatch(appendManyBlogs(100000));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleNavigateToGame = () => {
    dispatch(navigate('/game'));
  };

  const handleNavigateToRooms = () => {
    dispatch(navigate('/rooms'));
  };

  const handleNavigateToHome = () => {
    dispatch(navigate('/'));
  };

  return (
    <header className="header">
      <h1 onClick={handleNavigateToHome} style={{ cursor: 'pointer' }}>
        Hello Blog <span className="blog-list-len">({blogs.length})</span>
      </h1>
      <div>
        {user ? (
          <>
            <span className="username">{user}</span>
            <button className="logout-btn" onClick={handleLogout}>👋</button>
          </>
        ) : (
          <button className="login-btn" onClick={handleLogin}>🔑</button>
        )}
        <button 
          className="game-btn" 
          onClick={handleNavigateToGame}
          style={{ 
            backgroundColor: currentRoute === '/game' ? '#1d5ca8' : '#2d6fbc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 16px',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            marginRight: '10px'
          }}
        >
          🎮
        </button>
        <button 
          className="rooms-btn" 
          onClick={handleNavigateToRooms}
          style={{ 
            backgroundColor: currentRoute === '/rooms' ? '#1d5ca8' : '#2d6fbc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 16px',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            marginRight: '10px'
          }}
        >
          🚪
        </button>
        {currentRoute !== '/game' && currentRoute !== '/rooms' && (
          <>
            <button disabled={loading} className="add-btn" onClick={handleAddBlog}>Add Blog</button>
            <button disabled={loading} className="shuffle-btn" onClick={handleAppendManyBlogs}>🔀</button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;