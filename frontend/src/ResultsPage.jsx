import React from 'react';
import { useLocation } from 'react-router-dom';
import { Typography, Box, Card, CardContent, CardMedia, Button, List, ListItem } from '@mui/material';

const ResultsPage = () => {
  const location = useLocation();
  const { searchResults } = location.state || { searchResults: [] };

  return (
     <Box className="results-container" sx={{ backgroundColor: 'white' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Search Results
      </Typography>
      {searchResults.length > 0 ? (
        <List>
          {searchResults.map((car, index) => (
            <ListItem key={index} component={Card} sx={{ mb: 2, width: '900px' }}>
              <CardMedia
                component="img"
                height="250"
                image={car.images ? car.images[0] : ''}
                alt={car.title}
              />
              <CardContent>
                <Typography variant="h5" component="h2">
                  {car.title}
                </Typography>
                <Typography color="textSecondary">
                  Price: {car.price}
                </Typography>
                <Typography color="textSecondary">
                  Mileage: {car.mileage}
                </Typography>
                <Typography color="textSecondary">
                  Dealer: {car.dealer}
                </Typography>
                {car.images && car.images.slice(1).map((image, imgIndex) => (
                  <Box component="img" key={imgIndex} src={image} alt={`Car view ${imgIndex + 1}`} sx={{ width: '100px', height: 'auto', p: 1 }}/>
                ))}
                <Button href={car.dealer_url} target="_blank" rel="noopener noreferrer" variant="outlined" color="primary">
                  Visit Dealer Site
                </Button>
              </CardContent>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="subtitle1" color="error" gutterBottom>
          No results found. Please adjust your search criteria and try again.
        </Typography>
      )}
    </Box>
  );
};

export default ResultsPage;