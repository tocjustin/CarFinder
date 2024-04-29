import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditSearchDialog from './EditSearchDialog';

const SearchesPage = () => {
    const [searches, setSearches] = useState([]);
    const [currentSearch, setCurrentSearch] = useState(null);

    useEffect(() => {
        fetchSearches();
    }, []);

    const fetchSearches = () => {
        axios.get('/user/searches')
            .then(response => setSearches(response.data))
            .catch(error => console.error('Error fetching searches:', error));
    };

    const handleDelete = (searchId) => {
        if (window.confirm('Are you sure you want to delete this search?')) {
            axios.delete(`/search/${searchId}`)
                .then(() => fetchSearches())
                .catch(error => console.error('Error deleting search:', error));
        }
    };

    const handleEdit = (search) => {
        setCurrentSearch(search);
    };

    const handleSaveEdit = (search) => {
        axios.put(`/search/${search.id}`, search)
            .then(() => fetchSearches())
            .catch(error => console.error('Error updating search:', error));
    };

    return (
        <>
            <List>
                {searches.map((search) => (
                    <ListItem key={search.id}>
                        <ListItemText
                            primary={`${search.brand} ${search.model} (${search.year})`}
                            secondary={`Price: ${search.price_range}, Mileage: ${search.mileage}, Zip: ${search.zip_code}`}
                        />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() => handleEdit(search)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton edge="end" onClick={() => handleDelete(search.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
            {currentSearch && (
                <EditSearchDialog
                    search={currentSearch}
                    open={Boolean(currentSearch)}
                    onClose={() => setCurrentSearch(null)}
                    onSave={handleSaveEdit}
                />
            )}
        </>
    );
};

export default SearchesPage;
