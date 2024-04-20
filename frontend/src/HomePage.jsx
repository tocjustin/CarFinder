import backgroundImage from './assets/cars.jpg'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import './HomePage.css'; // Assuming you will create a separate CSS file for styling

const HomePage = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [formData, setFormData] = useState({
    priceRange: '',
    zipcode: '',
    milesRange: '',
    make: '',
    model: '',
    year: '',
    mileage: ''
  });

  const navigate = useNavigate();

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Search Data:', formData);
    // Here you would typically send the data to your backend or a search API

    navigate("/results")
  };
  
  return (
    <div className="home-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <button className="search-button" onClick={toggleDropdown}>Start Searching For Your Car!</button>
      {showDropdown && (
        <div className="dropdown-menu">
          <input type="text" name="priceRange" placeholder="Price Range (Max willing to spend)" onChange={handleChange} required />
          <input type="text" name="zipcode" placeholder="Zip Code" onChange={handleChange} />
          <input type="text" name="milesRange" placeholder="Location Range (miles)" onChange={handleChange} />
          <input type="text" name="make" placeholder="Car Make" onChange={handleChange} required />
          <input type="text" name="model" placeholder="Car Model" onChange={handleChange} required />
          <input type="text" name="year" placeholder="Car Year" onChange={handleChange} required />
          <input type="text" name="mileage" placeholder="Car Mileage (Maximum you're ok with)" onChange={handleChange} required />
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={() => setShowDropdown(false)} style={{ marginLeft: '10px' }}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
