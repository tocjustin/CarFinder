import React from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import axios from "axios";
import {AppBar, Button, Toolbar, Typography} from "@mui/material";
import AlertsDropdown from './AlertsDropdown';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    axios.post('http://localhost:5000/logout', {}, { withCredentials: true })
        .then(response => {
            console.log(response.data.message);
            navigate("/login");
        })
        .catch(error => {
            console.error('Logout failed:', error);
        });
  };

  if (location.pathname === '/login') {
    return null;
  }

  return (
    <AppBar position="static">
      <Toolbar style={{ justifyContent: 'space-between' }}>
        <Link to="/home" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography variant="h6" component="h1">
            CarFinder
          </Typography>
        </Link>
        <div>
            <AlertsDropdown />
          <Button color="inherit" onClick={handleLogout}>Log Out</Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
