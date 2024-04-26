import backgroundImage from './assets/cars.jpg'
import React, {useState} from 'react';
import {json, useNavigate} from 'react-router-dom';
import axios from 'axios';
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
        mileage: '',
    });

    const navigate = useNavigate();

    const toggleDropdown = () => setShowDropdown(!showDropdown);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        console.log('Search Data:', formData);
        // Use axios to send a GET request to your backend
        axios.get('http://localhost:5000/search', {
            params: {
                brand: formData.make,
                model: formData.model,
                year: formData.year,
                price: formData.priceRange,
                mileage: formData.mileage,
                zip: formData.zipcode,
                maximumDistance: formData.milesRange,
            }
        })
        .then(response => {
            // handle success
            navigate("/results", { state: { searchResults: response.data } });
        })
        .catch(error => {
            // handle error
            console.log(error);
        });
    };

    const saveSearch = async(e) =>{
      console.log('Search Data:', formData)
      alert(formData.priceRange);

      try{
        const response = await axios.post('http://localhost:5000/saveSearch', {
            params: {
                brand: formData.make,
                model: formData.model,
                year: formData.year,
                price: formData.priceRange,
                mileage: formData.mileage,
                zip: formData.zipcode,
                maximumDistance: formData.milesRange,
            }
        });
        if(response.status == 201)
        {
            console.log(response.data.message);
            navigate('/home')
        }
        else if(response.status == 400)
        {
            alert(response.data.message)
        }
        else
        {
            alert(response.data.message)
        }
      }
      catch(error){
        console.error("Registration error", error.response || error);
      }
    };

    return (
        <div className="home-container" style={{backgroundImage: `url(${backgroundImage})`}}>
            <button className="search-button" onClick={toggleDropdown}>Start Searching For Your Car!</button>
            {showDropdown && (
                <div className="dropdown-menu">
                    <input type="text" name="priceRange" placeholder="Price Range (Max willing to spend)" onChange={handleChange} required/>
                    <input type="text" name="zipcode" placeholder="Zip Code" onChange={handleChange}/>
                    <input type="text" name="milesRange" placeholder="Location Range (miles)" onChange={handleChange}/>
                    <input type="text" name="make" placeholder="Car Make" onChange={handleChange} required/>
                    <input type="text" name="model" placeholder="Car Model" onChange={handleChange} required/>
                    <input type="text" name="year" placeholder="Car Year" onChange={handleChange} required/>
                    <input type="text" name="mileage" placeholder="Car Mileage (Maximum you're ok with)" onChange={handleChange} required/>

                    <label for="saveSearch">Click here if you want to save this search!</label>
                    <input type='checkbox' onClick={saveSearch} name ="saveSearch"/><br/>
                    <button onClick={handleSubmit}>Submit</button>
                    <button onClick={() => setShowDropdown(false)} style={{marginLeft: '10px'}}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default HomePage;