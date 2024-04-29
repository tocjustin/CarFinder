import React, {useState} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    Slider,
    Typography,
    Select,
    MenuItem,
    FormControl
} from '@mui/material';

const EditSearchDialog = ({search, open, onClose, onSave}) => {
    const [formData, setFormData] = useState({...search});


    const handleChange = (event) => {
        console.log('Field:', event.target.name, 'Value:', event.target.value);
        setFormData({
            ...formData, [event.target.name]: event.target.value
        });
    };

    const handleSliderChange = (name) => (event, newValue) => {
        console.log('Slider Field:', name, 'New Value:', newValue);
        setFormData({
            ...formData, [name]: newValue
        });
    };

    const handleSave = () => {
        onSave(formData);
        onClose();
    };

    return (<Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Edit Search</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="Car Make"
                    type="text"
                    fullWidth
                    name="brand"
                    value={formData.brand || ''}
                    onChange={handleChange}
                    required
                />
                <TextField
                    margin="dense"
                    label="Car Model"
                    type="text"
                    fullWidth
                    name="model"
                    value={formData.model || ''}
                    onChange={handleChange}
                    required
                />
                <TextField
                    margin="dense"
                    label="Car Year"
                    type="text"
                    fullWidth
                    name="year"
                    value={formData.year || ''}
                    onChange={handleChange}
                    required
                />
                <Typography gutterBottom>Maximum Price ($)</Typography>
                <Slider
                    value={formData.maxPrice || 500}
                    onChange={handleSliderChange('maxPrice')}
                    valueLabelDisplay="auto"
                    min={500}
                    max={100000}
                    step={500}
                />
                <TextField
                    margin="dense"
                    label="Zip Code"
                    type="text"
                    fullWidth
                    name="zip_code"
                    value={formData.zip_code || ''}
                    onChange={handleChange}
                />
                <Typography gutterBottom>Location Range (miles)</Typography>
                <FormControl fullWidth margin="dense">
                    <Select
                        value={formData.maximumDistance || '10'}
                        onChange={handleChange}
                        name="maximumDistance"
                    >
                        {['10', '20', '30', '40', '50', '75', '100', '150', '200', '250', '500', 'all'].map((range) => (
                            <MenuItem key={range} value={range}>{range} miles</MenuItem>))}
                    </Select>
                </FormControl>
                <Typography gutterBottom>Maximum Mileage</Typography>
                <Slider
                    value={formData.maxMileage || 0}
                    onChange={handleSliderChange('maxMileage')}
                    valueLabelDisplay="auto"
                    min={0}
                    max={200000}
                    step={500}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Cancel</Button>
                <Button onClick={handleSave} color="primary">Save</Button>
            </DialogActions>
        </Dialog>);
};

export default EditSearchDialog;
