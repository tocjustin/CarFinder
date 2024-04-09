import React from 'react';
import backgroundImage from './assets/cars.jpg'
//import './HomePage.css'; // Assuming you will create a separate CSS file for styling

const HomePage = () => {
  return (
    <div className="home-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <button className="search-button">Start Searching For Your Car!</button>
    </div>
  );
};


export default HomePage;
