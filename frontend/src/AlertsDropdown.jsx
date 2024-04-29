import React, {useState, useEffect} from 'react';
import {Button, Menu, MenuItem, Snackbar} from '@mui/material';
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:5000';

const AlertsDropdown = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [snackbar, setSnackbar] = useState({open: false, message: ''});

    const handleCloseSnackbar = () => {
        setSnackbar({open: false, message: ''});
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (notificationId) => () => {
        markNotificationAsRead(notificationId);
        handleClose(); // Close menu after marking as read
    };

    useEffect(() => {
        // Trigger the fetchNotifications when the menu is opened
        if (anchorEl) {
            fetchNotifications();
        }
    }, [anchorEl]); // Dependency array includes anchorEl to react to changes

    const fetchNotifications = () => {
        axios.get('/notifications', {withCredentials: true})
            .then(response => {
                if (Array.isArray(response.data)) {
                    setNotifications(response.data);
                } else {
                    console.error('Expected an array for notifications, received:', response.data);
                    setSnackbar({open: true, message: 'Error: Notifications format is incorrect'});
                    setNotifications([]);
                }
            })
            .catch(error => {
                console.error('Error fetching notifications:', error);
                setSnackbar({open: true, message: 'Error fetching notifications'});
                setNotifications([]);
            });
    };

    const markNotificationAsRead = (notificationId) => {
        axios.post('/notifications/mark-read', {id: notificationId}, {withCredentials: true})
            .then(response => {
                console.log(response.data.message);
                setSnackbar({open: true, message: response.data.message});
                fetchNotifications(); // Optionally refresh notifications to reflect the changes
            })
            .catch(error => {
                console.error('Error marking notification as read:', error);
                setSnackbar({open: true, message: 'Failed to mark notification as read'});
            });
    };

    return (
        <>
            <Button onClick={handleClick} color="inherit">
                Alerts
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <MenuItem key={notification.id} onClick={handleMenuItemClick(notification.id)}>
                            {notification.message} {notification.read ? '(Read)' : '(Unread)'}
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem onClick={handleClose}>No notifications</MenuItem>
                )}
            </Menu>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={snackbar.message}
            />
        </>
    );
};

export default AlertsDropdown;
