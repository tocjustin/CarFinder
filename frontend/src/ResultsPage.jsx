import React from 'react';
//import Button from 'react-bootstrap/Button';
import { useLocation } from 'react-router-dom';

const ResultsPage = () => {
  const location = useLocation();
  const { searchResults } = location.state || { searchResults: [] };

  return (
    <div className="results-container">
      <h1>Search Results</h1>
      {searchResults.length > 0 ? (
        <ul>
          {searchResults.map((car, index) => (
            <li key={index}>
              <h2>{car.title}</h2>
              <p>Price: {car.price}</p>
              <p>Mileage: {car.mileage}</p>
              <p>Dealer: {car.dealer}</p>
              {car.images && car.images.map((image, imgIndex) => (
                <img key={imgIndex} src={image} alt={`Car view ${imgIndex}`} style={{ width: '100px', height: 'auto' }}/>
              ))}
              <a href={car.dealer_url} target="_blank" rel="noopener noreferrer">Visit Dealer Site</a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found. Please adjust your search criteria and try again.</p>
      )}
    </div>
  );
};

export default ResultsPage;