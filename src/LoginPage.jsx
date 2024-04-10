import React, { useState } from 'react';
import loginLogo from './assets/car-logo.png';
import { Link, useNavigate  } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      if (response.status === 200) {
        console.log(response.data.message);
        navigate('/home');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Login error", error.response || error);
      alert('Login failed. Please try again.');
    }
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