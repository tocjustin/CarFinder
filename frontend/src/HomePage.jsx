import backgroundImage from './assets/cars.jpg';
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from "axios";
import {
    MenuItem, Select, FormControl, TextField, Slider, Box, Typography, Button,
    Checkbox, FormControlLabel, CircularProgress
} from '@mui/material';//import './HomePage.css'; // Assuming you will create a separate CSS file for styling

const HomePage = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [formData, setFormData] = useState({
        maxPrice: 50000,
        zipcode: '',
        milesRange: '30',
        make: '',
        model: '',
        year: '',
        maxMileage: 100000,
    });

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const toggleDropdown = () => setShowDropdown(!showDropdown);

    const handleSliderChange = (name) => (event, newValue) => {
        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    const handleCheckboxChange = (event) => {
        setFormData(prev => ({
            ...prev,
            saveSearch: event.target.checked
        }));
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        console.log('Search Data:', formData);
        setIsLoading(true);
        // Use axios to send a GET request to your backend
        axios.get('http://localhost:5000/search', {
            params: {
                brand: formData.make,
                model: formData.model,
                year: formData.year,
                price: formData.maxPrice,
                mileage: formData.maxMileage,
                zip: formData.zipcode,
                maximumDistance: formData.milesRange,
            }
        })
            .then(response => {
                // handle success
                if (formData.saveSearch) {
                    console.log('Saving search...');
                    axios.post('http://localhost:5000/save_search', {
                        brand: formData.make,
                        model: formData.model,
                        year: formData.year,
                        price: formData.maxPrice,
                        mileage: formData.maxMileage,
                        zip: formData.zipcode,
                        maximumDistance: formData.milesRange,
                    }, {withCredentials: true})
                        .then(saveResponse => {
                            console.log('Search saved:', saveResponse.data);
                            navigate("/results", {state: {searchResults: response.data}}); // Navigate after save success
                        })
                        .catch(saveError => {
                            console.log('Error saving search:', saveError);
                        });
                }
                navigate("/results", {state: {searchResults: response.data}});
            })
            .catch(error => {
                // handle error
                console.log(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <div className="home-container" style={{backgroundImage: `url(${backgroundImage})`}}>
            {!showDropdown && (
                <Button variant="contained" color="primary" onClick={toggleDropdown}>
                    Start Searching For Your Car!
                </Button>
            )}
            {showDropdown && (
                <Box sx={{p: 2, bgcolor: 'background.paper'}}>
                    <TextField type="text" name="make" label="Car Make" variant="outlined" fullWidth margin="dense"
                               onChange={handleChange} required/>
                    <TextField type="text" name="model" label="Car Model" variant="outlined" fullWidth margin="dense"
                               onChange={handleChange} required/>
                    <TextField type="text" name="year" label="Car Year" variant="outlined" fullWidth margin="dense"
                               onChange={handleChange} required/>
                    <Typography gutterBottom>Maximum Price ($)</Typography>
                    <Slider
                        value={formData.maxPrice}
                        onChange={handleSliderChange('maxPrice')}
                        valueLabelDisplay="auto"
                        min={500}
                        max={100000}
                        step={500}
                    />
                    <TextField type="text" name="zipcode" label="Zip Code" variant="outlined" fullWidth margin="dense"
                               onChange={handleChange}/>

                    <Typography gutterBottom>Location Range (miles)</Typography>
                    <FormControl fullWidth>
                        <Select
                            labelId="milesRange-label"
                            value={formData.milesRange}
                            onChange={handleChange}
                            name="milesRange"
                        >
                            <MenuItem value="10">10 miles</MenuItem>
                            <MenuItem value="20">20 miles</MenuItem>
                            <MenuItem value="30">30 miles</MenuItem>
                            <MenuItem value="40">40 miles</MenuItem>
                            <MenuItem value="50">50 miles</MenuItem>
                            <MenuItem value="75">75 miles</MenuItem>
                            <MenuItem value="100">100 miles</MenuItem>
                            <MenuItem value="150">150 miles</MenuItem>
                            <MenuItem value="200">200 miles</MenuItem>
                            <MenuItem value="250">250 miles</MenuItem>
                            <MenuItem value="500">500 miles</MenuItem>
                            <MenuItem value="all">All</MenuItem>
                        </Select>
                    </FormControl>
                    <Typography gutterBottom>Maximum Mileage</Typography>
                    <Slider
                        value={formData.maxMileage}
                        onChange={handleSliderChange('maxMileage')}
                        valueLabelDisplay="auto"
                        min={0}
                        max={200000}
                        step={500}
                    />
                    <Box sx={{mt: 2, mb: 2}}>
                        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={isLoading}>
                            {isLoading ? <CircularProgress size={24} color="inherit"/> : "Submit"}
                        </Button>
                        <Button onClick={() => setShowDropdown(false)} variant="outlined" color="secondary"
                                sx={{ml: 2}}>Cancel</Button>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.saveSearch}
                                    onChange={handleCheckboxChange}
                                    name="saveSearch"
                                    color="primary"
                                />
                            }
                            label="Save this search"
                            style={{marginLeft: 20}}
                        />
                    </Box>
                </Box>
            )}
        </div>
    );
};

export default HomePage;