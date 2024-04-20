import React, { useState } from 'react';
import loginLogo from './assets/car-logo.png'
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Logging in with:', email, password);
    // You might want to add validation or API calls here
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
        <p className="register-link">
          Not registered yet? <Link to="/register">Register HERE!</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;