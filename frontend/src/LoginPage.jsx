import React, { useState } from 'react';
import loginLogo from './assets/car-logo.png';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email validation regex
    const passwordRegex = /^[A-Za-z0-9!#$*-]+$/; // Password validation regex

    if (!emailRegex.test(email) || !passwordRegex.test(password) || password.length < 6) {
      return false; // Simplified error check
    }
    return true;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validateInputs()) {
      setError("Could not log in. Please check your email and password.");
      return; // Stop form submission if validation fails
    }

    fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password
      }),
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to log in'); // Handle non-2xx status codes
      }
    })
    .then(data => {
      console.log(data.message);
      navigate('/home'); // Navigate to dashboard upon successful login
    })
    .catch((error) => {
      console.error('Error:', error);
      setError("Could not log in. Please check your email and password."); // Generic error message for all errors
    });
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <img src={loginLogo} alt="Car Logo" className="car-logo"/>
        <h2>Login to Find Your Car</h2>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">Log In</button>
        {error && <p className="error-text">{error}</p>} {/* Generic error message displayed here */}
        <p className="register-link">
          Not registered yet? <Link to="/register">Register HERE!</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;