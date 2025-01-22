import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import { TextField, Button, Typography, Box, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("")
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    // Handle form input changes
    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handleLoginClick = (e) => {
        navigate("/")
    }

    // Handle form submission
    const handleRegister = async (e) => {
        e.preventDefault();

        const requestData = {
            name: username,
            password: password,
            email: email
        };

        try {
            const userExists = await axios.get(`http://localhost:8080/user/${email}`)
            if(userExists !== 'ok'){
                console.error(JSON.stringify(userExists.data));
            }
            const response = await axios.post("http://localhost:8080/user/addUser", requestData);
            console.log("Register successful:", response.data);
            navigate("/Login");

        } catch (error) {
            console.error("Register failed:", error);
        }
    };

    return (
        <Box className="login-container">
            <Paper elevation={3} className="login-paper">
                <Typography variant="h4" className="login-title">
                    Register
                </Typography>
                <form onSubmit={handleRegister} className="login-form">
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={handleUsernameChange}
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <TextField
                        label="Email"
                        variant="outlined"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={handleEmailChange}
                    />
                    <Button onClick={handleRegister} variant="contained" color="secondary" type="submit" className="login-button">
                        Register
                    </Button>
                    <Button onClick={handleLoginClick} variant="contained" color="primary" type="submit" className="login-button">
                        Go to Login
                    </Button>
                </form>
                {errorMessage && <Typography color="error">{errorMessage}</Typography>}
            </Paper>
        </Box>
    );
}

export default Register;
