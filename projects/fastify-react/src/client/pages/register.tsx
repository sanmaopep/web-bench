import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/auth';
import './register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords must match');
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username, 
          password,
          referralCode: referralCode.trim() || undefined
        }),
      });

      const data = await response.json();

      if (data.success) {
        await login();
        navigate('/');
      } else {
        setError(data.message || 'Username already exists');
      }
    } catch (err) {
      setError('Registration failed');
      console.error(err);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="register-title">Register for Shopping Mart</h2>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            className="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            className="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group referral-code-group">
          <label htmlFor="referral-code" className="referral-code-label">
            <span>Referral Code</span>
            <span className="referral-label-optional">(optional)</span>
          </label>
          <input
            type="text"
            id="referral-code"
            className="referral-code-input"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
          />
          <div className="referral-info">
            Enter a referral code if you were invited by an existing user.
          </div>
        </div>
        
        <button type="submit" className="register-button">
          Register
        </button>
        {error && <div className="error-message">{error}</div>}
        <div>
          Already have an account? <a href="/login" className="login-link">Login</a>
        </div>
      </form>
    </div>
  );
};

export default Register;