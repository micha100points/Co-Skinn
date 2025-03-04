import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        Username: '',
        Password: '',
        Email: '',
        Phone: '',
        Address: '',
        Role: 'User',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/users/register', formData);
            alert('Đăng ký thành công!');
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Lỗi khi đăng ký:', error.response.data);
            alert(error.response.data.message || 'Đăng ký thất bại!');
        }
    };

    return (
        <Box sx={{ width: 300, margin: '50px auto' }}>
            <Typography variant="h4" mb={3}>Register</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Username"
                    name="Username"
                    value={formData.Username}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Password"
                    name="Password"
                    type="password"
                    value={formData.Password}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Phone"
                    name="Phone"
                    value={formData.Phone}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Address"
                    name="Address"
                    value={formData.Address}
                    onChange={handleChange}
                    margin="normal"
                />
                <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
                    Register
                </Button>
            </form>
        </Box>
    );
};

export default Register;
