import React, { useState } from 'react';
import loginLogo from './assets/car-logo.png'
import { Link, useNavigate  } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async(e) => {
    e.preventDefault();
    console.log('Registering with:', firstName, lastName, email);
    try 
    {
      const response = await axios.post('http://localhost:5000/register', {
        firstName,
        lastName,
        email,
        password
      });
      if(response.status == 201)
      {
        console.log(response.data.message);
        navigate('/home')
      }
      else
      {
        alert(response.data.message)
      }
    } 
    catch (error) {
      console.error("Registration error", error.response || error);
      // Handle error, e.g., showing error message
    }
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