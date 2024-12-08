import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import {TextField, Button, Typography, Box, Paper} from "@mui/material";
import {useNavigate} from 'react-router-dom';


function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [setErrorMessage] = useState("");
    const navigate = useNavigate();
    // Handle form input changes
    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    // Handle form submission
    const handleLogin = async (e) => {
        e.preventDefault();


        const requestData = {
            name: username,
            password: password,
        }

        try {
            console.log(requestData);
            const response = await axios.post('http://localhost:8080/user/login', requestData);

            // Handle success (you can redirect or update state)
            console.log("Login successful:", response.data);
            if(response === "ok"){
                console.log(response);
            }

            navigate('/MainPage');
        } catch (error) {
            // Handle error (e.g., incorrect credentials)
            console.error("Login failed:", error);
            setErrorMessage("Invalid username or password.");
        }
    };

    return (
        <Box className="login-container">
            <Paper elevation={3} className="login-paper">
                <Typography variant="h4" className="login-title">
                    Login
                </Typography>
                <form onSubmit={handleLogin} className="login-form">
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
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        className="login-button"
                    >
                        Login
                    </Button>
                </form>
            </Paper>
        </Box>
    );
}

export default Login;