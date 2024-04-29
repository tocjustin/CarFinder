import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom'; // Import useNavigate
import loginLogo from './assets/car-logo.png';

const RegisterPage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({}); // New state for errors

    const navigate = useNavigate(); // Initialize the useNavigate hook

    const validateInputs = () => {
        const newErrors = {};
        const nameRegex = /^[A-Za-z']+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^[A-Za-z0-9!#$*-]+$/;

        if (!nameRegex.test(firstName)) {
            newErrors.firstName = "First name can only include alphabets and the ' character.";
        }
        if (!nameRegex.test(lastName)) {
            newErrors.lastName = "Last name can only include alphabets and the ' character.";
        }
        if (!emailRegex.test(email)) {
            newErrors.email = "Please enter a valid email address.";
        }
        if (!passwordRegex.test(password) || password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long and include only alphabets, numbers, and !#$-* characters.";
        }
        return newErrors;
    };

    const handleRegister = (e) => {
        e.preventDefault();
        const formErrors = validateInputs();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
        } else {
            fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password
                }),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    navigate('/login'); // Use navigate to go to the login page
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleRegister} className="login-form">
                <img src={loginLogo} alt="Car Logo" className="car-logo"/>
                <h2>Register Now</h2>
                <div className="input-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                        type="text"
                        id="firstName"
                        className={`input ${errors.firstName ? 'input-error' : ''}`}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                    {errors.firstName && <p className="error-text">{errors.firstName}</p>}
                </div>
                <div className="input-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        className={`input ${errors.lastName ? 'input-error' : ''}`}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                    {errors.lastName && <p className="error-text">{errors.lastName}</p>}
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        className={`input ${errors.email ? 'input-error' : ''}`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {errors.email && <p className="error-text">{errors.email}</p>}
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        className={`input ${errors.password ? 'input-error' : ''}`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {errors.password && <p className="error-text">{errors.password}</p>}
                </div>
                <button type="submit" className="login-button">Register Now</button>
            </form>
        </div>
    );
};

export default RegisterPage;