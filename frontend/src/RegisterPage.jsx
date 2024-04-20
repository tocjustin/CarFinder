import React, { useState } from 'react';
import loginLogo from './assets/car-logo.png'

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    console.log('Registering with:', firstName, lastName, email);
    // Add registration logic here
  };

  return (
    <div className="login-container"> {/* Reusing login-container class */}
      <form onSubmit={handleRegister} className="login-form"> {/* Reusing login-form class */}
        <img src={loginLogo} alt="Car Logo" className="car-logo"/>
        <h2>Register Now</h2>
        <div className="input-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            className="input" // Adjusted to use .input class for styling
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            className="input" // Adjusted to use .input class for styling
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">Register Now</button>
      </form>
    </div>
  );
};

export default RegisterPage;