import React, { useState, useEffect } from 'react';
import { Button, Menu, MenuItem, Snackbar, Badge } from '@mui/material';
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:5000';

const AlertsDropdown = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [snackbar, setSnackbar] = useState({open: false, message: ''});

    const handleCloseSnackbar = () => {
        setSnackbar({open: false, message: ''});
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        fetchNotifications();
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDeleteAllNotifications = () => {
        axios.post('/notifications/delete-all')
            .then(response => {
                console.log(response.data.message);
                setSnackbar({open: true, message: "All notifications deleted."});
                fetchNotifications();
            })
            .catch(error => {
                console.error('Error deleting notifications:', error);
                setSnackbar({open: true, message: 'Failed to delete notifications'});
            });
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = () => {
        axios.get('/notifications')
            .then(response => {
                if (Array.isArray(response.data)) {
                    setNotifications(response.data);
                    const unread = response.data.filter(notif => !notif.read).length;
                    setUnreadCount(unread);
                } else {
                    console.error('Expected an array for notifications, received:', response.data);
                    setSnackbar({open: true, message: 'Error fetching notifications'});
                    setNotifications([]);
                }
            })
            .catch(error => {
                console.error('Error fetching notifications:', error);
                setSnackbar({open: true, message: 'Error fetching notifications'});
                setNotifications([]);
            });
    };

    return (
        <>
            <Badge badgeContent={unreadCount} color="error">
                <Button onClick={handleClick} color="inherit">
                    Alerts
                </Button>
            </Badge>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {notifications.length > 0 ? (
                    <>
                        {notifications.map((notification) => (
                            <MenuItem
                                key={notification.id}
                                onClick={() => window.open(notification.url, '_blank')}
                            >
                                {notification.message}
                            </MenuItem>
                        ))}
                        <MenuItem onClick={handleDeleteAllNotifications}>Delete All</MenuItem>
                    </>
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
