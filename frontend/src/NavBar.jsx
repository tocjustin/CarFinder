import React from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import axios from "axios";
import {AppBar, Button, Toolbar, Typography} from "@mui/material";
import AlertsDropdown from './AlertsDropdown';
import {useAuth} from './AuthContext'; // Import the useAuth hook

const NavBar = () => {
    const navigate = useNavigate();
    const {isLoggedIn, logout} = useAuth(); // Use the context

    const handleLogout = () => {
        axios.post('http://localhost:5000/logout', {}, {withCredentials: true})
            .then(response => {
                console.log(response.data.message);
                logout(); // Update context to reflect logout
                navigate("/login");
            })
            .catch(error => {
                console.error('Logout failed:', error);
            });
    };

    return (
        <AppBar position="static">
            <Toolbar style={{justifyContent: 'space-between'}}>
                <Link to="/home" style={{textDecoration: 'none', color: 'inherit'}}>
                    <Typography variant="h6" component="h1">
                        CarFinder
                    </Typography>
                </Link>
                <div>
                    {isLoggedIn ? (
                        <>
                             <Button color="inherit" component={Link} to="/searches">My Searches</Button>
                            <AlertsDropdown/>
                            <Button color="inherit" onClick={handleLogout}>Log Out</Button>
                        </>
                    ) : (
                        <Button color="inherit" onClick={() => navigate("/login")}>Log In</Button>
                    )}
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
